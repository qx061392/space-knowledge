/**
 * 航天知识库 - 通用工具函数
 */

function formatDate(date) {
  if (typeof date === 'string') date = new Date(date)
  if (!(date instanceof Date)) date = new Date()
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatTime(date) {
  if (typeof date === 'string') date = new Date(date)
  if (!(date instanceof Date)) date = new Date()
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${formatDate(date)} ${h}:${m}`
}

function getCategoryInfo(catId) {
  const map = {
    'spacecraft': { name: '航天器与火箭', icon: '🚀', color: '#4A90E2' },
    'history': { name: '航天历史', icon: '📜', color: '#E94B3C' },
    'solar-system': { name: '太阳系与深空', icon: '🪐', color: '#F5A623' },
    'astronauts': { name: '航天员与宇航员', icon: '👨‍🚀', color: '#7B61FF' },
    'basics': { name: '航天基础知识', icon: '📐', color: '#2ECC71' }
  }
  return map[catId] || { name: '未知', icon: '❓', color: '#888888' }
}

function getDifficultyColor(difficulty) {
  const map = {
    '简单': '#2ECC71',
    '中等': '#F5A623',
    '困难': '#E94B3C'
  }
  return map[difficulty] || '#888888'
}

function shuffleArray(arr) {
  const result = arr.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function getDailySeed() {
  const now = new Date()
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
}

function pickDaily(array, count) {
  if (!array || array.length === 0) return []
  const n = Math.min(count, array.length)
  const seed = getDailySeed()
  const result = []
  const used = new Set()
  for (let i = 0; i < n; i++) {
    const idx = (seed + i * 7 + i * i) % array.length
    if (used.has(idx)) {
      for (let j = 0; j < array.length; j++) {
        if (!used.has(j)) { used.add(j); result.push(array[j]); break }
      }
    } else {
      used.add(idx)
      result.push(array[idx])
    }
  }
  return result
}

function truncate(str, len) {
  if (!str) return ''
  if (str.length <= len) return str
  return str.substring(0, len) + '...'
}

function highlightKeyword(text, keyword) {
  if (!keyword || !text) return [{ text: text || '', highlight: false }]
  const result = []
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  let lastIndex = 0
  let idx = lowerText.indexOf(lowerKeyword)
  while (idx !== -1) {
    if (idx > lastIndex) {
      result.push({ text: text.substring(lastIndex, idx), highlight: false })
    }
    result.push({ text: text.substring(idx, idx + keyword.length), highlight: true })
    lastIndex = idx + keyword.length
    idx = lowerText.indexOf(lowerKeyword, lastIndex)
  }
  if (lastIndex < text.length) {
    result.push({ text: text.substring(lastIndex), highlight: false })
  }
  return result
}

module.exports = {
  formatDate,
  formatTime,
  getCategoryInfo,
  getDifficultyColor,
  shuffleArray,
  getDailySeed,
  pickDaily,
  truncate,
  highlightKeyword
}
