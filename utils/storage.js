/**
 * 航天知识库 - 本地存储管理
 * 管理收藏、浏览历史、字号、阅读进度、问答排行榜等
 */

const FAVORITES_KEY = 'space_favorites'
const HISTORY_KEY = 'space_history'
const DAILY_KEY = 'space_daily_date'
const QUIZ_RECORD_KEY = 'space_quiz_record'
const QUIZ_HISTORY_KEY = 'space_quiz_history'
const FONT_SIZE_KEY = 'space_font_size'
const READ_PROGRESS_KEY = 'space_read_progress'
const MAX_HISTORY = 50
const MAX_QUIZ_HISTORY = 20

function initStorage() {
  if (wx.getStorageSync(FAVORITES_KEY) === '') wx.setStorageSync(FAVORITES_KEY, [])
  if (wx.getStorageSync(HISTORY_KEY) === '') wx.setStorageSync(HISTORY_KEY, [])
  if (wx.getStorageSync(QUIZ_HISTORY_KEY) === '') wx.setStorageSync(QUIZ_HISTORY_KEY, [])
}

// ===== 收藏 =====
function getFavorites() { return wx.getStorageSync(FAVORITES_KEY) || [] }
function isFavorited(id) { return getFavorites().some(item => item.id === id) }
function addFavorite(item) {
  const list = getFavorites()
  if (!list.some(i => i.id === item.id)) {
    list.unshift({ id: item.id, title: item.title, subtitle: item.subtitle, category: item.category, icon: item.icon, year: item.year, favTime: Date.now() })
    wx.setStorageSync(FAVORITES_KEY, list)
  }
  return list
}
function removeFavorite(id) { const list = getFavorites().filter(item => item.id !== id); wx.setStorageSync(FAVORITES_KEY, list); return list }
function toggleFavorite(item) {
  if (isFavorited(item.id)) return { favorited: false, list: removeFavorite(item.id) }
  return { favorited: true, list: addFavorite(item) }
}

// ===== 浏览历史 =====
function getHistory() { return wx.getStorageSync(HISTORY_KEY) || [] }
function addHistory(item) {
  const list = getHistory().filter(i => i.id !== item.id)
  list.unshift({ id: item.id, title: item.title, subtitle: item.subtitle, category: item.category, icon: item.icon, year: item.year, visitTime: Date.now() })
  if (list.length > MAX_HISTORY) list.splice(MAX_HISTORY)
  wx.setStorageSync(HISTORY_KEY, list)
  return list
}
function clearHistory() { wx.setStorageSync(HISTORY_KEY, []) }

// ===== 每日推荐 =====
function isDailyRefreshed() {
  const today = new Date()
  const todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const lastDate = wx.getStorageSync(DAILY_KEY)
  if (lastDate !== todayStr) { wx.setStorageSync(DAILY_KEY, todayStr); return false }
  return true
}

// ===== 问答记录 =====
function getQuizRecord() {
  return wx.getStorageSync(QUIZ_RECORD_KEY) || { bestScore: 0, bestTotal: 0, totalAttempts: 0, lastScore: 0, lastTotal: 0 }
}

function saveQuizResult(score, total) {
  const record = getQuizRecord()
  record.lastScore = score
  record.lastTotal = total
  const previousBest = record.bestScore || 0
  const isNewBest = score > previousBest
  record.totalAttempts = (record.totalAttempts || 0) + 1
  if (isNewBest) { record.bestScore = score; record.bestTotal = total }
  wx.setStorageSync(QUIZ_RECORD_KEY, record)

  // 保存到排行榜历史
  const history = getQuizHistory()
  history.unshift({ score, total, percent: Math.round(score / total * 100), time: Date.now(), isNewBest })
  if (history.length > MAX_QUIZ_HISTORY) history.splice(MAX_QUIZ_HISTORY)
  wx.setStorageSync(QUIZ_HISTORY_KEY, history)

  return { ...record, isNewBest }
}

function getQuizHistory() { return wx.getStorageSync(QUIZ_HISTORY_KEY) || [] }

// ===== 字号偏好 =====
function getFontSize() { return wx.getStorageSync(FONT_SIZE_KEY) || 'medium' }
function setFontSize(size) { wx.setStorageSync(FONT_SIZE_KEY, size) }

// ===== 阅读进度 =====
function getReadProgress(id) {
  const all = wx.getStorageSync(READ_PROGRESS_KEY) || {}
  return all[id] || 0
}
function setReadProgress(id, progress) {
  const all = wx.getStorageSync(READ_PROGRESS_KEY) || {}
  all[id] = progress
  // 只保留最近50条的进度
  const keys = Object.keys(all)
  if (keys.length > 50) { delete all[keys[0]] }
  wx.setStorageSync(READ_PROGRESS_KEY, all)
}

module.exports = {
  initStorage,
  getFavorites, isFavorited, addFavorite, removeFavorite, toggleFavorite,
  getHistory, addHistory, clearHistory,
  isDailyRefreshed,
  getQuizRecord, saveQuizResult, getQuizHistory,
  getFontSize, setFontSize,
  getReadProgress, setReadProgress
}
