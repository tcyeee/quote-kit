Component({
  data: {
    quoteDetail: {} as QuoteDetail,
  },

  lifetimes: {
    attached() {
      this.setData({
        quoteDetail: getApp<IAppOption>().globalData.quoteDetail,
      })
    },
  },
})

