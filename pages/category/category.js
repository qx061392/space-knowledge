Page({
  data: { categories: [] },
  onLoad() {
    getApp().onCloudReady(() => this.loadData())
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },
  loadData() {
    const knowledge = getApp().getData()
    if (!knowledge) return
    const categories = knowledge.categories.map(cat => {
      const items = knowledge.knowledgeList.filter(k => k.category === cat.id)
      return { ...cat, count: items.length, items: items.slice(0, 3) }
    })
    this.setData({ categories })
  },
  goToCategoryList(e) { wx.navigateTo({ url: '/pages/category-list/category-list?cat=' + e.currentTarget.dataset.id }) },
  goToDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }) }
})
