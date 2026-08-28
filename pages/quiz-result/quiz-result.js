const storage = require('../../utils/storage.js')

Page({
  data: {
    score: 0,
    total: 10,
    percent: 0,
    rating: '',
    ratingIcon: '',
    ratingColor: '',
    bestScore: 0,
    isNewBest: false
  },

  onLoad(options) {
    const score = parseInt(options.score) || 0
    const total = parseInt(options.total) || 10
    const isNewBest = options.isNewBest === '1'
    const percent = Math.round((score / total) * 100)
    const record = storage.getQuizRecord()

    let rating, ratingIcon, ratingColor
    if (percent === 100) { rating = '航天专家'; ratingIcon = '🏆'; ratingColor = '#FFD700' }
    else if (percent >= 80) { rating = '太空达人'; ratingIcon = '🌟'; ratingColor = '#00D4FF' }
    else if (percent >= 60) { rating = '航天爱好者'; ratingIcon = '🚀'; ratingColor = '#2ECC71' }
    else if (percent >= 40) { rating = '航天新兵'; ratingIcon = '🌌'; ratingColor = '#F5A623' }
    else { rating = '继续努力'; ratingIcon = '🌱'; ratingColor = '#8B92B0' }

    this.setData({
      score, total, percent,
      rating, ratingIcon, ratingColor,
      bestScore: record.bestScore || 0,
      isNewBest
    })
  },

  retry() {
    wx.redirectTo({ url: '/pages/quiz/quiz' })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  goCategory() {
    wx.switchTab({ url: '/pages/category/category' })
  }
})
