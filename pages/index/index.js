const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')

Page({
  data: {
    categories: [],
    dailyItem: null,
    dailyCatInfo: {},
    recentHistory: [],
    totalKnowledge: 0,
    totalQuiz: 0,
    loading: true
  },

  onLoad() {
    getApp().onCloudReady(() => this.loadData())
  },

  onShow() {
    const history = storage.getHistory()
    this.setData({ recentHistory: history.slice(0, 3) })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  onPullDownRefresh() {
    this.loadData()
    wx.stopPullDownRefresh()
  },

  loadData() {
    const app = getApp()
    const knowledge = app.getData()
    const quiz = app.getQuiz()
    if (!knowledge || !quiz) return

    const categories = knowledge.categories.map(cat => {
      const count = knowledge.knowledgeList.filter(k => k.category === cat.id).length
      return { ...cat, count }
    })

    const daily = util.pickDaily(knowledge.knowledgeList, 1)
    const dailyItem = daily[0] || knowledge.knowledgeList[0]

    this.setData({
      categories,
      dailyItem,
      dailyCatInfo: util.getCategoryInfo(dailyItem.category),
      totalKnowledge: knowledge.knowledgeList.length,
      totalQuiz: quiz.quizList.length,
      recentHistory: storage.getHistory().slice(0, 3),
      loading: false
    })
  },

  goToSearch() { wx.navigateTo({ url: '/pages/search/search' }) },
  goToCategory(e) { wx.navigateTo({ url: '/pages/category-list/category-list?cat=' + e.currentTarget.dataset.id }) },
  goToCategoryList() { wx.switchTab({ url: '/pages/category/category' }) },
  goToDetail(e) {
    const id = e.currentTarget.dataset.id || this.data.dailyItem.id
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  },
  goToQuiz() { wx.switchTab({ url: '/pages/quiz/quiz' }) },
  goToMigrate() { wx.navigateTo({ url: '/pages/migrate/migrate' }) }
})
