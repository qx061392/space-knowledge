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
    this.setData({ status: 'running', message: '准备迁移...', progress: 0 })
    const db = wx.cloud.database()

    try {
      this.setData({ message: '清空旧数据...', detail: 'knowledge + quiz' })
      await this.clearCollection(db, 'knowledge')
      await this.clearCollection(db, 'quiz')
      await this.clearCollection(db, 'categories')

      this.setData({ message: '迁移分类数据...', detail: knowledge.categories.length + ' 条', progress: 10 })
      await this.batchInsert(db, 'categories', knowledge.categories)

      this.setData({ message: '迁移知识条目...', detail: knowledge.knowledgeList.length + ' 条' })
      await this.batchInsert(db, 'knowledge', knowledge.knowledgeList)

      this.setData({ message: '迁移问答题...', detail: quiz.quizList.length + ' 条' })
      await this.batchInsert(db, 'quiz', quiz.quizList)

      const total = knowledge.categories.length + knowledge.knowledgeList.length + quiz.quizList.length
      this.setData({ status: 'done', message: '迁移完成！', progress: 100, detail: '共 ' + total + ' 条数据' })
      wx.showToast({ title: '迁移成功', icon: 'success' })
    } catch (err) {
      this.setData({ status: 'error', message: '迁移失败', detail: err.errMsg || err.message || '未知错误' })
      wx.showToast({ title: '迁移失败', icon: 'none' })
    }
  },

  async clearCollection(db, name) {
    const col = db.collection(name)
    const count = await col.count()
    if (count.total === 0) return
    let deleted = 0
    while (deleted < count.total) {
      const res = await col.limit(20).get()
      if (!res.data.length) break
      await Promise.all(res.data.map(item => col.doc(item._id).remove()))
      deleted += res.data.length
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
