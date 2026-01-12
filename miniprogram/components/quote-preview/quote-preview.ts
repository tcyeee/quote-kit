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
  },

  lifetimes: {
    attached() {
      const {
        client,
        pricingItems,
        serviceProcess,
        overallDeliveryPeriodDays,
        serviceTerms,
      } = getApp<IAppOption>().globalData.quoteDetail

      this.setData({
        client,
        pricingItems,
        serviceProcess,
        overallDeliveryPeriodDays,
        serviceTerms,
      })
    },
  },
})
