const util = require('../../utils/util.js')
const storage = require('../../utils/storage.js')

const QUESTIONS_PER_ROUND = 10

Page({
  data: {
    stage: 'intro',
    questions: [],
    currentIndex: 0,
    score: 0,
    selectedOption: -1,
    answered: false,
    bestRecord: null,
    progressPercent: 0,
    catInfo: {},
    optionLetters: ['A', 'B', 'C', 'D']
  },

  onLoad() {
    this.setData({ bestRecord: storage.getQuizRecord() })
  },

  onShow() {
    if (this.data.stage === 'intro') {
      this.setData({ bestRecord: storage.getQuizRecord() })
    }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  startQuiz() {
    const quiz = getApp().getQuiz()
    if (!quiz) return
    const shuffled = util.shuffleArray(quiz.quizList)
    const selected = shuffled.slice(0, QUESTIONS_PER_ROUND)
    const firstCat = util.getCategoryInfo(selected[0].category)
    this.setData({
      stage: 'question',
      questions: selected,
      currentIndex: 0,
      score: 0,
      selectedOption: -1,
      answered: false,
      catInfo: firstCat,
      progressPercent: (1 / selected.length) * 100
    })
  },

  selectOption(e) {
    if (this.data.answered) return
    const optionIndex = e.currentTarget.dataset.index
    const question = this.data.questions[this.data.currentIndex]
    const correct = optionIndex === question.answer
    this.setData({
      selectedOption: optionIndex,
      answered: true,
      score: correct ? this.data.score + 1 : this.data.score
    })
  },

  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1
    if (nextIndex >= this.data.questions.length) {
      this.finishQuiz()
      return
    }
    const nextCat = util.getCategoryInfo(this.data.questions[nextIndex].category)
    this.setData({
      currentIndex: nextIndex,
      selectedOption: -1,
      answered: false,
      catInfo: nextCat,
      progressPercent: ((nextIndex + 1) / this.data.questions.length) * 100
    })
  },

  finishQuiz() {
    const score = this.data.score
    const total = this.data.questions.length
    const result = storage.saveQuizResult(score, total)
    this.setData({ stage: 'intro', bestRecord: storage.getQuizRecord() })
    wx.navigateTo({
      url: '/pages/quiz-result/quiz-result?score=' + score + '&total=' + total + '&isNewBest=' + (result.isNewBest ? 1 : 0)
    })
  }
})
