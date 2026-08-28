Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '🏠' },
      { pagePath: '/pages/category/category', text: '分类', icon: '📚' },
      { pagePath: '/pages/quiz/quiz', text: '问答', icon: '🧠' },
      { pagePath: '/pages/favorites/favorites', text: '收藏', icon: '⭐' }
    ]
  },
  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      const path = this.data.list[index].pagePath
      wx.switchTab({ url: path })
    }
  }
})
