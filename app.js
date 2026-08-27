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
      this.fetchAll(db, 'categories', 10),
      this.fetchAll(db, 'knowledge', 100),
      this.fetchAll(db, 'quiz', 100)
    ]).then(([cats, knows, quizzes]) => {
      if (!knows.length || !cats.length) {
        this.loadLocalData()
        return
      }
      this.globalData.knowledgeData = {
        categories: cats,
        knowledgeList: knows
      }
      this.globalData.quizData = {
        quizList: quizzes
      }
      this.globalData.cloudReady = true
      if (this.dataReadyCallback) this.dataReadyCallback()
    }).catch(err => {
      console.error('Cloud load failed, fallback to local:', err)
      this.loadLocalData()
    })
  },

  async fetchAll(db, collection, max) {
    let all = []
    let skip = 0
    while (all.length < max) {
      const res = await db.collection(collection).skip(skip).limit(20).get()
      all = all.concat(res.data)
      if (res.data.length < 20) break
      skip += 20
    }
    return all
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
