const storage = require('./utils/storage.js')

const CLOUD_ENV = 'cloud1-d9gs26i6825e93d6d'

App({
  globalData: {
    systemInfo: null,
    statusBarHeight: 20,
    navBarHeight: 44,
    knowledgeData: null,
    quizData: null,
    cloudReady: false
  },

  onLaunch() {
    const sysInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = sysInfo
    this.globalData.statusBarHeight = sysInfo.statusBarHeight || 20

    const menuButton = wx.getMenuButtonBoundingClientRect()
    const navBarHeight = (menuButton.top - this.globalData.statusBarHeight) * 2 + menuButton.height
    this.globalData.navBarHeight = navBarHeight || 44

    storage.initStorage()

    if (wx.cloud) {
      wx.cloud.init({ env: CLOUD_ENV })
      this.loadCloudData()
    } else {
      this.loadLocalData()
    }
  },

  loadCloudData() {
    const db = wx.cloud.database()
    Promise.all([
      db.collection('categories').limit(10).get(),
      db.collection('knowledge').limit(100).get(),
      db.collection('quiz').limit(100).get()
    ]).then(([cRes, kRes, qRes]) => {
      if (!kRes.data.length || !cRes.data.length) {
        this.loadLocalData()
        return
      }
      this.globalData.knowledgeData = {
        categories: cRes.data,
        knowledgeList: kRes.data
      }
      this.globalData.quizData = {
        quizList: qRes.data
      }
      this.globalData.cloudReady = true
      if (this.dataReadyCallback) this.dataReadyCallback()
    }).catch(err => {
      console.error('Cloud load failed, fallback to local:', err)
      this.loadLocalData()
    })
  },

  loadLocalData() {
    const knowledge = require('./data/knowledge.js')
    const quiz = require('./data/quiz.js')
    this.globalData.knowledgeData = knowledge
    this.globalData.quizData = quiz
    this.globalData.cloudReady = true
    if (this.dataReadyCallback) this.dataReadyCallback()
  },

  getData() {
    return this.globalData.knowledgeData
  },

  getQuiz() {
    return this.globalData.quizData
  },

  onCloudReady(cb) {
    if (this.globalData.cloudReady) {
      cb()
    } else {
      this.dataReadyCallback = cb
    }
  },

  getSystemInfo() { return this.globalData.systemInfo },
  getStatusBarHeight() { return this.globalData.statusBarHeight },
  getNavBarHeight() { return this.globalData.navBarHeight }
})
