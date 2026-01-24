Component({
  properties: {
    quoteDetail: { type: Object, value: {} as QuoteDetail },
    parentViewMode: { type: String, value: 'real' },
  },
  methods: {
    onSaveImage() {
      wx.showToast({
        title: 'hello-amber',
        icon: 'none',
      })
    },
  },
})
