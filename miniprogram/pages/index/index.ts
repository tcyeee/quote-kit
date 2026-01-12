const app = getApp<IAppOption>()

Page({
  data: {
    options: {
      bottomDialogCollapsedHeight: 20,
      bottomDialogExpandedHeight: 85,
    },
    client: {
      name: "熬夜汽水设计工作室",
      logoUrl: "https://example.com/assets/logo.png",
    },
    pricingItems: [] as QuotePricingCategory[],
    serviceProcess: {
      depositRatio: 0,
      finalPaymentRatio: 0,
    },
    overallDeliveryPeriodDays: 0,
    serviceTerms: "",
    bottomDialogExpanded: false,
  },

  onLoad() {
    const {
      pricingItems,
      serviceProcess,
      overallDeliveryPeriodDays,
      serviceTerms,
    } = app.globalData.quoteDetail

    this.setData({
      pricingItems,
      serviceProcess,
      overallDeliveryPeriodDays,
      serviceTerms,
    })
  },

  toggleBottomDialog() {
    this.setData({
      bottomDialogExpanded: !this.data.bottomDialogExpanded,
    })
  },
})
