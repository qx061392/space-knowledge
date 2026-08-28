const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')

Page({
  data: {
    activeTab: 'favorites',
    favorites: [],
    history: [],
    favCount: 0,
    hisCount: 0
  },

  onShow() {
    this.loadData()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  loadData() {
    const favorites = storage.getFavorites()
    const history = storage.getHistory()
    this.setData({
      favorites: this.enrichItems(favorites),
      history: this.enrichItems(history),
      favCount: favorites.length,
      hisCount: history.length
    })
  },

  enrichItems(items) {
    return items.map(item => ({
      ...item,
      catInfo: util.getCategoryInfo(item.category)
    }))
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  },

  removeFav(e) {
    const id = e.currentTarget.dataset.id
    const list = storage.removeFavorite(id)
    this.setData({
      favorites: this.enrichItems(list),
      favCount: list.length
    })
    wx.showToast({ title: '已取消收藏', icon: 'none' })
  },

  clearHistory() {
    wx.showModal({
      title: '清空浏览历史',
      content: '确定要清空所有浏览历史吗？',
      confirmColor: '#00D4FF',
      success: (res) => {
        if (res.confirm) {
          storage.clearHistory()
          this.setData({ history: [], hisCount: 0 })
          wx.showToast({ title: '已清空', icon: 'none' })
        }
      }
    })
  }
})
