Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    quoteDetail: {} as QuoteDetail,
    totalAmount: 0,
    linkExpireDays: 7,
  },
  lifetimes: {
    attached() {
      const app = getApp<IAppOption>()
      const quoteDetail = app.globalData.quoteDetail
      const pricingItems = quoteDetail.pricingItems || []
      let totalAmount = 0
      pricingItems.forEach(category => {
        const items = category.items || []
        items.forEach(item => {
          totalAmount += item.unitPrice * item.quantity
        })
      })
      const computeData = quoteDetail.computeData
      const linkExpireDays =
        computeData && typeof computeData.expiresDays === "number"
          ? computeData.expiresDays
          : 7
      this.setData({
        quoteDetail,
        totalAmount,
        linkExpireDays,
      })
    },
  },
  methods: {
    onExpireDaysTap(e: any) {
      const days = e.currentTarget.dataset.days as number
      if (!days) return
      const quoteDetail = this.data.quoteDetail
      const nextComputeData: QuoteComputeData = {
        ...(quoteDetail.computeData || ({} as QuoteComputeData)),
        expiresDays: days,
      }
      const nextQuoteDetail: QuoteDetail = {
        ...quoteDetail,
        computeData: nextComputeData,
      }

      this.setData({
        quoteDetail: nextQuoteDetail,
        linkExpireDays: days,
      })
      this.quoteDataUpdate()
    },


    toggleConfirmDialog() {
      this.triggerEvent("toggleConfirmDialog", false)
    },

    quoteDataUpdate() {
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail = this.data.quoteDetail
    },
  },
})
