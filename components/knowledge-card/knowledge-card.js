Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    showCategory: {
      type: Boolean,
      value: true
    },
    showSummary: {
      type: Boolean,
      value: true
    },
    compact: {
      type: Boolean,
      value: false
    }
  },
  data: {
    catInfo: {}
  },
  observers: {
    'item': function(item) {
      if (item && item.category) {
        const util = require('../../utils/util.js')
        this.setData({ catInfo: util.getCategoryInfo(item.category) })
      }
    }
  },
  methods: {
    onTap() {
      const id = this.data.item.id
      if (id) {
        wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
      }
    }
  }
})
