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
      this.setData({
        quoteDetail,
        totalAmount,
      })
    },
  },
  methods: {
    toggleConfirmDialog() {
      this.triggerEvent("toggleConfirmDialog", false)
    },
  },
})
