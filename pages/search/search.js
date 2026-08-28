const util = require('../../utils/util.js')

Page({
  data: { keyword: '', results: [], hasSearched: false, hotTags: [], searchHistory: [] },

  onLoad(options) {
    getApp().onCloudReady(() => {
      this.loadTags()
      if (options.tag) {
        this.setData({ keyword: options.tag }, () => this.onSearch())
      }
    })
    const searchHistory = wx.getStorageSync('space_search_history') || []
    this.setData({ searchHistory })
  },

  loadTags() {
    const knowledge = getApp().getData()
    if (!knowledge) return
    const allTags = new Set()
    knowledge.knowledgeList.forEach(item => {
      if (item.tags) item.tags.forEach(tag => allTags.add(tag))
    })
    this.setData({ hotTags: Array.from(allTags).slice(0, 12) })
  },

  onInput(e) { this.setData({ keyword: e.detail.value }) },

  onSearch() {
    const keyword = this.data.keyword.trim()
    if (!keyword) { this.setData({ results: [], hasSearched: false }); return }
    const knowledge = getApp().getData()
    if (!knowledge) return
    const results = knowledge.knowledgeList.filter(item =>
      item.title.includes(keyword) || item.subtitle.includes(keyword) ||
      item.summary.includes(keyword) || (item.tags && item.tags.some(t => t.includes(keyword))) ||
      item.content.includes(keyword)
    ).map(item => ({
      ...item,
      titleParts: util.highlightKeyword(item.title, keyword),
      summaryParts: util.highlightKeyword(item.summary, keyword)
    }))
    this.saveSearchHistory(keyword)
    this.setData({ results, hasSearched: true })
  },

  saveSearchHistory(keyword) {
    let history = wx.getStorageSync('space_search_history') || []
    history = [keyword, ...history.filter(h => h !== keyword)].slice(0, 10)
    wx.setStorageSync('space_search_history', history)
    this.setData({ searchHistory: history })
  },

  clearHistory() { wx.setStorageSync('space_search_history', []); this.setData({ searchHistory: [] }) },
  onTagTap(e) { this.setData({ keyword: e.currentTarget.dataset.tag }, () => this.onSearch()) },
  onHistoryTap(e) { this.setData({ keyword: e.currentTarget.dataset.keyword }, () => this.onSearch()) },
  onClearInput() { this.setData({ keyword: '', results: [], hasSearched: false }) },
  goToDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }) }
})
