Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    quoteDetail: {} as QuoteDetail,
  },
  lifetimes: {
    attached() {
      const app = getApp<IAppOption>()
      this.setData({
        quoteDetail: app.globalData.quoteDetail,
      })
    },
  },
  methods: {
    updateQuoteDetail(partial: Partial<QuoteDetail>) {
      const quoteDetail = {
        ...this.data.quoteDetail,
        ...partial,
      }
      this.setData({
        quoteDetail,
      })
      this.triggerEvent("update", partial)
    },

    onServiceTermsBlur(e: any) {
      const serviceTerms = e.detail.value as string
      this.updateQuoteDetail({ serviceTerms })
    },
  },
})

