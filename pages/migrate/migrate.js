const knowledge = require('../../data/knowledge.js')
const quiz = require('../../data/quiz.js')

Page({
  data: {
    status: 'idle',
    progress: 0,
    message: '',
    detail: ''
  },

  async doMigrate() {
    this.setData({ status: 'running', message: '开始迁移...', progress: 0 })
    const db = wx.cloud.database()
    const cmd = db.command

    try {
      // 1. 迁移分类
      this.setData({ message: '迁移分类数据...', detail: knowledge.categories.length + ' 条' })
      await this.batchInsert(db, 'categories', knowledge.categories)

      // 2. 迁移知识条目
      this.setData({ message: '迁移知识条目...', detail: knowledge.knowledgeList.length + ' 条' })
      await this.batchInsert(db, 'knowledge', knowledge.knowledgeList)

      // 3. 迁移问答题
      this.setData({ message: '迁移问答题...', detail: quiz.quizList.length + ' 条' })
      await this.batchInsert(db, 'quiz', quiz.quizList)

      this.setData({ status: 'done', message: '迁移完成！', progress: 100, detail: '共 ' + (knowledge.categories.length + knowledge.knowledgeList.length + quiz.quizList.length) + ' 条数据' })
      wx.showToast({ title: '迁移成功', icon: 'success' })
    } catch (err) {
      this.setData({ status: 'error', message: '迁移失败', detail: err.errMsg || err.message || '未知错误' })
      wx.showToast({ title: '迁移失败', icon: 'none' })
    }
  },

  async batchInsert(db, collection, items) {
    const col = db.collection(collection)
    for (let i = 0; i < items.length; i += 20) {
      const batch = items.slice(i, i + 20)
      const tasks = batch.map(item => col.add({ data: item }))
      await Promise.all(tasks)
      const progress = Math.min(Math.round(((i + 20) / items.length) * 100), 100)
      this.setData({ progress })
    }
  }
})
