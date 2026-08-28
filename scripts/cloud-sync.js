#!/usr/bin/env node
/**
 * 航天知识库 - 云数据库直写脚本
 * 直接从容器写入微信云数据库，无需sync-pull/DevTools/迁移页面
 *
 * 用法：node scripts/cloud-sync.js
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const ENV_FILE = path.join(PROJECT_ROOT, '.env')

// 加载.env
const env = {}
fs.readFileSync(ENV_FILE, 'utf8').split('\n').forEach(line => {
  const [k, v] = line.trim().split('=')
  if (k && v) env[k] = v
})

const WX_APPID = env.WX_APPID
const WX_SECRET = env.WX_SECRET
const WX_CLOUD_ENV = env.WX_CLOUD_ENV

if (!WX_APPID || !WX_SECRET || !WX_CLOUD_ENV) {
  console.error('❌ 缺少微信配置，请检查 .env 文件')
  process.exit(1)
}

function fetch(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout }, res => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function post(url, body, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const data = JSON.stringify(body)
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      timeout
    }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => resolve(d))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
    req.write(data)
    req.end()
  })
}

async function getToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WX_APPID}&secret=${WX_SECRET}`
  const resp = JSON.parse(await fetch(url))
  if (!resp.access_token) throw new Error('获取token失败: ' + resp.errmsg)
  return resp.access_token
}

async function dbQuery(token, query) {
  const url = `https://api.weixin.qq.com/tcb/databasequery?access_token=${token}`
  const resp = JSON.parse(await post(url, { env: WX_CLOUD_ENV, query }))
  if (resp.errcode && resp.errcode !== 0) throw new Error(`查询失败: ${resp.errmsg}`)
  return resp.data ? resp.data.map(d => JSON.parse(d)) : []
}

async function dbAdd(token, collection, record) {
  const url = `https://api.weixin.qq.com/tcb/databaseadd?access_token=${token}`
  const dataStr = JSON.stringify(record).replace(/'/g, "\\'")
  const query = `db.collection('${collection}').add({data: ${dataStr}})`
  const resp = JSON.parse(await post(url, { env: WX_CLOUD_ENV, query }))
  if (resp.errcode && resp.errcode !== 0) throw new Error(`添加失败: ${resp.errmsg}`)
  return resp.idList || resp._id
}

async function dbDelete(token, collection, id) {
  const url = `https://api.weixin.qq.com/tcb/databasedelete?access_token=${token}`
  const query = `db.collection('${collection}').doc('${id}').remove()`
  const resp = JSON.parse(await post(url, { env: WX_CLOUD_ENV, query }))
  return resp
}

async function dbUpdate(token, collection, id, data) {
  const url = `https://api.weixin.qq.com/tcb/databaseupdate?access_token=${token}`
  const dataStr = JSON.stringify(data).replace(/'/g, "\\'")
  const query = `db.collection('${collection}').doc('${id}').update({data: ${dataStr}})`
  const resp = JSON.parse(await post(url, { env: WX_CLOUD_ENV, query }))
  return resp
}

async function clearCollection(token, name) {
  let deleted = 0
  while (true) {
    const records = await dbQuery(token, `db.collection('${name}').limit(20).get()`)
    if (!records.length) break
    for (const r of records) {
      if (r._id) await dbDelete(token, name, r._id)
      deleted++
    }
    process.stdout.write(`\r  清空 ${name}: ${deleted} 条已删除`)
  }
  if (deleted > 0) console.log(`\n  ✅ ${name} 清空完成 (${deleted}条)`)
  else console.log(`  ⏭️  ${name} 已为空`)
  return deleted
}

async function batchAdd(token, collection, items) {
  let added = 0
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    // 清理_id字段（云端自动生成）
    const { _id, ...cleanItem } = item
    await dbAdd(token, collection, cleanItem)
    added++
    if (added % 10 === 0 || added === items.length) {
      process.stdout.write(`\r  写入 ${collection}: ${added}/${items.length}`)
    }
  }
  console.log(`\n  ✅ ${collection} 写入完成 (${added}条)`)
  return added
}

async function main() {
  console.log('\n🚀 航天知识库 - 云数据库直写\n')

  // 加载数据
  const knowledge = require(path.join(PROJECT_ROOT, 'data', 'knowledge.js'))
  const quiz = require(path.join(PROJECT_ROOT, 'data', 'quiz.js'))
  console.log(`📚 本地数据: ${knowledge.knowledgeList.length} 条知识, ${quiz.quizList.length} 道问答\n`)

  // 获取token
  process.stdout.write('获取 access_token... ')
  const token = await getToken()
  console.log('✅\n')

  // 清空集合
  console.log('📦 清空旧数据:')
  await clearCollection(token, 'knowledge')
  await clearCollection(token, 'quiz')
  await clearCollection(token, 'categories')
  console.log('')

  // 写入新数据
  console.log('📝 写入新数据:')
  await batchAdd(token, 'categories', knowledge.categories)
  await batchAdd(token, 'knowledge', knowledge.knowledgeList)
  await batchAdd(token, 'quiz', quiz.quizList)
  console.log('')

  // 验证
  const kCount = await dbQuery(token, `db.collection('knowledge').limit(1).get()`)
  console.log(`✅ 同步完成！云数据库已更新，用户打开小程序即可看到最新内容。`)
  console.log(`   knowledge: ${knowledge.knowledgeList.length} 条`)
  console.log(`   quiz: ${quiz.quizList.length} 题`)
  console.log(`   categories: ${knowledge.categories.length} 个分类\n`)
}

main().catch(err => {
  console.error('\n❌ 错误:', err.message)
  process.exit(1)
})
