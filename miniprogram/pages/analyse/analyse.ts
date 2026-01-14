Page({
  data: {
    quoteDetail: {} as QuoteDetail,
    totalAmount: 0,
    totalServices: 0,
    totalCategories: 0,
    safeTop: 0,
  },

  onBackTap() {
    wx.navigateBack()
  },

  onLoad() {
    const app = getApp<IAppOption>()
    const systemInfo = wx.getSystemInfoSync()
    const safeTop = systemInfo.statusBarHeight || 0
    const quoteDetail = app.globalData.quoteDetail
    const { totalAmount, totalServices, totalCategories } = this.calculateStatistics(quoteDetail)
    this.setData({
      quoteDetail,
      totalAmount,
      totalServices,
      totalCategories,
      safeTop,
    })
  },

  calculateStatistics(quoteDetail: QuoteDetail) {
    const pricingItems = quoteDetail.pricingItems || []
    let totalAmount = 0
    let totalServices = 0

    pricingItems.forEach(category => {
      const items = category.items || []
      totalServices += items.length
      items.forEach(item => {
        totalAmount += item.unitPrice * item.quantity
      })
    })

    return {
      totalAmount,
      totalServices,
      totalCategories: pricingItems.length,
    }
  },
})
