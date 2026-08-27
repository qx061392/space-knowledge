const util = require('../../utils/util.js')

Page({
  data: { catId: '', catInfo: {}, items: [], sortBy: 'default' },
  onLoad(options) {
    this.setData({ catId: options.cat || 'spacecraft' })
    getApp().onCloudReady(() => this.loadCategory(options.cat || 'spacecraft'))
  },
  loadCategory(catId) {
    const knowledge = getApp().getData()
    if (!knowledge) return
    const catInfo = knowledge.categories.find(c => c.id === catId) || util.getCategoryInfo(catId)
    const items = knowledge.knowledgeList.filter(k => k.category === catId)
    wx.setNavigationBarTitle({ title: catInfo.name || '知识列表' })
    this.setData({ catId, catInfo, items })
  },
  onSortChange(e) {
    const sortBy = e.currentTarget.dataset.sort
    let items = this.data.items.slice()
    if (sortBy === 'year') items.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0))
    else { const knowledge = getApp().getData(); items = knowledge.knowledgeList.filter(k => k.category === this.data.catId) }
    this.setData({ items, sortBy })
  },
  goToDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }) }
})
