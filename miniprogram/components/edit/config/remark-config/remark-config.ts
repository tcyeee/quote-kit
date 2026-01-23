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

    onBusinessDiscountBlur(e: any) {
      const value = e.detail.value
      const amount = Number(value)
      const businessDiscountAmount = Number.isNaN(amount) ? 0 : amount
      this.updateQuoteDetail({ businessDiscountAmount })
    },

    onServiceTermsBlur(e: any) {
      const serviceTerms = e.detail.value as string
      this.updateQuoteDetail({ serviceTerms })
    },
  },
})
