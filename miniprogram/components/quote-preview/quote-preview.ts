Component({
  data: {
    client: {
      name: "",
      logoUrl: "",
    },
    pricingItems: [] as QuotePricingCategory[],
    serviceProcess: {
      depositRatio: 0,
      finalPaymentRatio: 0,
    },
    overallDeliveryPeriodDays: 0,
    serviceTerms: "",
    theme: "",
  },

  lifetimes: {
    attached() {
      this.setData({
        quoteDetail: getApp<IAppOption>().globalData.quoteDetail as QuoteDetail,
      })
    },
  },
})
