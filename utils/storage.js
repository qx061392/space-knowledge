/**
 * 航天知识库 - 本地存储管理
 * 管理收藏、浏览历史、每日推荐状态等
 */

const FAVORITES_KEY = 'space_favorites'
const HISTORY_KEY = 'space_history'
const DAILY_KEY = 'space_daily_date'
const QUIZ_RECORD_KEY = 'space_quiz_record'
const MAX_HISTORY = 50

function initStorage() {
  if (wx.getStorageSync(FAVORITES_KEY) === '') {
    wx.setStorageSync(FAVORITES_KEY, [])
  }
  if (wx.getStorageSync(HISTORY_KEY) === '') {
    wx.setStorageSync(HISTORY_KEY, [])
  }
}

function getFavorites() {
  return wx.getStorageSync(FAVORITES_KEY) || []
}

function isFavorited(id) {
  const list = getFavorites()
  return list.some(item => item.id === id)
}

function addFavorite(item) {
  const list = getFavorites()
  if (!list.some(i => i.id === item.id)) {
    list.unshift({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      icon: item.icon,
      year: item.year,
      favTime: Date.now()
    })
    wx.setStorageSync(FAVORITES_KEY, list)
  }
  return list
}

function removeFavorite(id) {
  const list = getFavorites().filter(item => item.id !== id)
  wx.setStorageSync(FAVORITES_KEY, list)
  return list
}

function toggleFavorite(item) {
  if (isFavorited(item.id)) {
    return { favorited: false, list: removeFavorite(item.id) }
  } else {
    return { favorited: true, list: addFavorite(item) }
  }
}

function getHistory() {
  return wx.getStorageSync(HISTORY_KEY) || []
}

function addHistory(item) {
  const list = getHistory().filter(i => i.id !== item.id)
  list.unshift({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    category: item.category,
    icon: item.icon,
    year: item.year,
    visitTime: Date.now()
  })
  if (list.length > MAX_HISTORY) {
    list.splice(MAX_HISTORY)
  }
  wx.setStorageSync(HISTORY_KEY, list)
  return list
}

function clearHistory() {
  wx.setStorageSync(HISTORY_KEY, [])
}

function isDailyRefreshed() {
  const today = new Date()
  const todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const lastDate = wx.getStorageSync(DAILY_KEY)
  if (lastDate !== todayStr) {
    wx.setStorageSync(DAILY_KEY, todayStr)
    return false
  }
  return true
}

function getQuizRecord() {
  return wx.getStorageSync(QUIZ_RECORD_KEY) || {
    bestScore: 0,
    bestTotal: 0,
    totalAttempts: 0,
    lastScore: 0,
    lastTotal: 0
  }
}

function saveQuizResult(score, total) {
  const record = getQuizRecord()
  record.lastScore = score
  record.lastTotal = total
  const previousBest = record.bestScore || 0
  const isNewBest = score > previousBest
  record.totalAttempts = (record.totalAttempts || 0) + 1
  if (isNewBest) {
    record.bestScore = score
    record.bestTotal = total
  }
  wx.setStorageSync(QUIZ_RECORD_KEY, record)
  return { ...record, isNewBest }
}

module.exports = {
  initStorage,
  getFavorites,
  isFavorited,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  getHistory,
  addHistory,
  clearHistory,
  isDailyRefreshed,
  getQuizRecord,
  saveQuizResult
}
