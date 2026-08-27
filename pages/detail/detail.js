const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')

Page({
  data: { item: null, catInfo: {}, paragraphs: [], isFav: false, related: [] },

  onLoad(options) {
    this._loadItemId = options.id
    getApp().onCloudReady(() => this.loadItem(options.id))
  },

  onShow() {
    if (this.data.item) this.setData({ isFav: storage.isFavorited(this.data.item.id) })
  },

  loadItem(id) {
    const knowledge = getApp().getData()
    if (!knowledge) return
    const item = knowledge.knowledgeList.find(k => k.id === id)
    if (!item) {
      wx.showToast({ title: '内容不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    const catInfo = util.getCategoryInfo(item.category)
    const paragraphs = item.content.split('\n\n')
    const related = knowledge.knowledgeList.filter(k => k.category === item.category && k.id !== item.id).slice(0, 3)
    wx.setNavigationBarTitle({ title: item.title })
    storage.addHistory(item)
    this.setData({ item, catInfo, paragraphs, related, isFav: storage.isFavorited(item.id) })
  },

  toggleFav() {
    if (!this.data.item) return
    const result = storage.toggleFavorite(this.data.item)
    this.setData({ isFav: result.favorited })
    wx.showToast({ title: result.favorited ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  goToDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }) },

  onShareAppMessage() {
    return {
      title: this.data.item ? this.data.item.title : '航天知识库',
      path: '/pages/detail/detail?id=' + (this.data.item ? this.data.item.id : '')
    }
  }
})
