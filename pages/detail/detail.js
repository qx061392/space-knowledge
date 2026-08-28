const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')

const FONT_SIZES = {
  small: { content: '26rpx', title: '40rpx', summary: '26rpx' },
  medium: { content: '30rpx', title: '42rpx', summary: '28rpx' },
  large: { content: '34rpx', title: '44rpx', summary: '30rpx' }
}

Page({
  data: {
    item: null,
    catInfo: {},
    paragraphs: [],
    isFav: false,
    related: [],
    fontSize: 'medium',
    fontStyles: FONT_SIZES.medium,
    scrollTop: 0,
    readProgress: 0,
    savedProgress: 0
  },

  onLoad(options) {
    this._loadItemId = options.id
    const fs = storage.getFontSize()
    this.setData({ fontSize: fs, fontStyles: FONT_SIZES[fs] })
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
    const savedProgress = storage.getReadProgress(id)
    wx.setNavigationBarTitle({ title: item.title })
    storage.addHistory(item)
    this.setData({ item, catInfo, paragraphs, related, isFav: storage.isFavorited(item.id), savedProgress })
    if (savedProgress > 0) {
      setTimeout(() => { wx.showToast({ title: '已恢复阅读位置', icon: 'none', duration: 1500 }) }, 500)
    }
  },

  toggleFontSize() {
    const sizes = ['small', 'medium', 'large']
    const next = sizes[(sizes.indexOf(this.data.fontSize) + 1) % sizes.length]
    storage.setFontSize(next)
    this.setData({ fontSize: next, fontStyles: FONT_SIZES[next] })
    wx.showToast({ title: next === 'small' ? '小号' : next === 'medium' ? '中号' : '大号', icon: 'none' })
  },

  onScroll(e) {
    const top = e.detail.scrollTop
    const height = e.detail.scrollHeight - e.detail.clientHeight
    const progress = height > 0 ? Math.min(Math.round(top / height * 100), 100) : 0
    this.setData({ readProgress: progress })
    if (progress % 10 === 0 && this.data.item) storage.setReadProgress(this.data.item.id, progress)
  },

  toggleFav() {
    if (!this.data.item) return
    const result = storage.toggleFavorite(this.data.item)
    this.setData({ isFav: result.favorited })
    wx.showToast({ title: result.favorited ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  goToDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }) },

  onShareAppMessage() {
    const item = this.data.item
    return {
      title: item ? item.title + ' | ' + item.subtitle : '航天知识库',
      path: '/pages/detail/detail?id=' + (item ? item.id : '')
    }
  },

  onShareTimeline() {
    const item = this.data.item
    return { title: item ? item.title + ' - ' + item.summary.slice(0, 40) : '航天知识库', query: 'id=' + (item ? item.id : '') }
  }
})
