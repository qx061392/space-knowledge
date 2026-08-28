#!/usr/bin/env node
/**
 * 航天知识库 - 新闻定时拉取脚本
 * 
 * 用法：
 *   node scripts/fetch-space-news.js          # 拉取自上次以来的新文章
 *   node scripts/fetch-space-news.js --all    # 拉取所有文章（不按日期过滤）
 *   node scripts/fetch-space-news.js --list    # 列出已缓存的文章
 * 
 * 定时运行（crontab）：
 *   每天早上8点拉取：
 *   0 8 * * * cd /你的项目路径 && node scripts/fetch-space-news.js >> docs/news-cache/fetch.log 2>&1
 *   每周一早上8点拉取：
 *   0 8 * * 1 cd /你的项目路径 && node scripts/fetch-space-news.js >> docs/news-cache/fetch.log 2>&1
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

// ===== 配置 =====
const PROJECT_ROOT = path.resolve(__dirname, '..')
const CACHE_DIR = path.join(PROJECT_ROOT, 'docs', 'news-cache')
const STATE_FILE = path.join(CACHE_DIR, '.last-run')
const MAX_ARTICLES_PER_FEED = 20

// RSS 源列表
const FEEDS = [
  {
    name: 'NASA News',
    url: 'https://www.nasa.gov/news-release/feed/',
    lang: 'en',
    type: 'rss'
  },
  {
    name: 'Space.com',
    url: 'https://www.space.com/feeds/all',
    lang: 'en',
    type: 'rss'
  },
  {
    name: 'SpaceNews',
    url: 'https://spacenews.com/feed/',
    lang: 'en',
    type: 'rss'
  },
  {
    name: 'ESA Top News',
    url: 'https://www.esa.int/rssfeed/Our_Activities',
    lang: 'en',
    type: 'rss'
  },
  {
    name: 'NASA Breaking News',
    url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    lang: 'en',
    type: 'rss'
  },
  {
    name: 'CNSA 国家航天局',
    url: 'http://www.cnsa.gov.cn/',
    lang: 'zh',
    type: 'html'
  },
  {
    name: 'Xinhua Tech 新华社科技',
    url: 'https://www.news.cn/tech/',
    lang: 'zh',
    type: 'html'
  },
  {
    name: 'CCTV Science 央视科教',
    url: 'https://news.cctv.com/science/',
    lang: 'zh',
    type: 'html'
  }
]

// ===== 工具函数 =====

function fetch(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SpaceNewsFetcher/1.0)' },
      timeout
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetch(res.headers.location, timeout))
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function parseRSS(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = extractTag(block, 'title')
    const link = extractTag(block, 'link')
    const description = stripHtml(extractTag(block, 'description'))
    const pubDate = extractTag(block, 'pubDate')
    const guid = extractTag(block, 'guid') || link
    const creator = extractTag(block, 'dc:creator') || extractTag(block, 'author') || ''
    if (title && link) {
      items.push({ title, link, description, pubDate, guid, creator, fetchedAt: new Date().toISOString() })
    }
  }
  return items
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<(?:\\w+:)?${tag}[^>]*>([\\s\\S]*?)</(?:\\w+:)?${tag}>`, 'i')
  const match = xml.match(regex)
  if (!match) return ''
  return match[1].trim().replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1')
}

function stripHtml(str) {
  if (!str) return ''
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function parseDate(dateStr) {
  if (!dateStr) return null
  try {
    return new Date(dateStr)
  } catch {
    return null
  }
}

function getLastRun() {
  try {
    const content = fs.readFileSync(STATE_FILE, 'utf8')
    return new Date(content.trim())
  } catch {
    return new Date(0)
  }
}

function saveLastRun() {
  fs.writeFileSync(STATE_FILE, new Date().toISOString())
}

function isSpaceRelated(item) {
  const keywords = [
    'space', 'rocket', 'satellite', 'orbit', 'mars', 'moon', 'lunar',
    'nasa', 'esa', 'spacex', 'astronaut', 'cosmonaut', 'station',
    'launch', 'shuttle', 'capsule', 'mars', 'venus', 'jupiter',
    'saturn', 'telescope', 'probe', 'rover', 'ISS', 'Artemis',
    '航天', '火箭', '卫星', '轨道', '火星', '月球', '嫦娥', '长征',
    '空间站', '发射', '宇航员', '航天员', '探测器', '飞船', '神舟',
    '探月', '深空', '载荷', '回收', '乘组', '出舱', '可重复使用'
  ]
  const text = (item.title + ' ' + item.description).toLowerCase()
  return keywords.some(k => text.includes(k.toLowerCase()))
}

function parseHtml(html, baseUrl) {
  const items = []
  const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1]
    const text = stripHtml(match[2])
    if (!text || text.length < 8) continue
    if (href.startsWith('/')) href = new URL(href, baseUrl).href
    if (!href.startsWith('http')) continue
    items.push({
      title: text,
      link: href,
      description: '',
      pubDate: '',
      guid: href,
      creator: '',
      fetchedAt: new Date().toISOString()
    })
  }
  return items
}

function saveArticle(feedName, item) {
  const dateStr = item.pubDate ? parseDate(item.pubDate)?.toISOString().slice(0, 10) : 'unknown'
  const safeTitle = item.title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
  const filename = `${dateStr}_${safeTitle}.md`
  const filepath = path.join(CACHE_DIR, filename)

  if (fs.existsSync(filepath)) return false

  const content = `# ${item.title}

- **来源**: ${feedName}
- **日期**: ${item.pubDate || '未知'}
- **链接**: ${item.link}
- **作者**: ${item.creator || '未知'}
- **拉取时间**: ${item.fetchedAt}

## 摘要

${item.description || '无摘要'}

## 原文链接

${item.link}
`
  fs.writeFileSync(filepath, content)
  return true
}

function listCached() {
  const files = fs.readdirSync(CACHE_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
    .sort()
    .reverse()
  console.log(`\n📦 已缓存 ${files.length} 篇文章：\n`)
  files.forEach(f => console.log(`  ${f}`))
}

// ===== 主流程 =====

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--list')) {
    listCached()
    return
  }

  const fetchAll = args.includes('--all')
  const lastRun = fetchAll ? new Date(0) : getLastRun()
  
  if (!fetchAll) {
    console.log(`\n🛰️  航天新闻拉取脚本启动`)
    console.log(`📅 上次拉取时间: ${lastRun.toISOString()}`)
    console.log(`📡 监控 ${FEEDS.length} 个源（${FEEDS.filter(f=>f.type==='rss').length} RSS + ${FEEDS.filter(f=>f.type==='html').length} HTML）\n`)
  } else {
    console.log(`\n🛰️  航天新闻拉取脚本（全量模式）`)
    console.log(`📡 监控 ${FEEDS.length} 个源（${FEEDS.filter(f=>f.type==='rss').length} RSS + ${FEEDS.filter(f=>f.type==='html').length} HTML）\n`)
  }

  let totalFetched = 0
  let totalSkipped = 0

  for (const feed of FEEDS) {
    try {
      process.stdout.write(`  拉取 ${feed.name}... `)
      const raw = await fetch(feed.url, 20000)
      const items = feed.type === 'html' ? parseHtml(raw, feed.url) : parseRSS(raw)
      
      let newCount = 0
      let skipCount = 0

      for (const item of items.slice(0, MAX_ARTICLES_PER_FEED)) {
        const pubDate = parseDate(item.pubDate)
        
        // 日期过滤
        if (!fetchAll && pubDate && pubDate < lastRun) {
          skipCount++
          continue
        }

        // 航天相关性过滤
        if (!isSpaceRelated(item)) {
          skipCount++
          continue
        }

        // 保存
        const saved = saveArticle(feed.name, item)
        if (saved) {
          newCount++
          totalFetched++
        } else {
          skipCount++
        }
      }

      totalSkipped += skipCount
      console.log(`✓ ${items.length} 篇解析，${newCount} 篇新增，${skipCount} 篇跳过`)
    } catch (err) {
      console.log(`✗ 失败: ${err.message}`)
    }
  }

  saveLastRun()

  console.log(`\n✅ 完成！新增 ${totalFetched} 篇，跳过 ${totalSkipped} 篇`)
  console.log(`📁 缓存目录: ${CACHE_DIR}`)
  
  if (totalFetched > 0) {
    console.log(`\n💡 下一步：在 opencode 中输入 "整理缓存的航天新闻" 来更新知识库`)
  }
}

main().catch(err => {
  console.error('❌ 脚本错误:', err.message)
  process.exit(1)
})
