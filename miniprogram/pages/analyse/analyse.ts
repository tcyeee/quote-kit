import { getShareQuote } from "../../utils/cloud-database"
import { calculateTotalAmount } from "../../utils/quote-utils"

Page({
  data: {
    safeTop: 0,
    quoteList: [] as Array<QuoteDetail>,
  },

  async onLoad() {
    this.calculateSafeAreaHeight()
    await this.queryShareList()
  },

  onBackTap() {
    wx.navigateBack()
  },

  calculateSafeAreaHeight() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({ safeTop: systemInfo.statusBarHeight || 0 })
  },

  async queryShareList() {
    const rawList = await getShareQuote()
    const quoteList = (rawList || []).map(item => {
      const computeData = item.computeData || {}
      const hasTotalAmount = typeof computeData.totalAmount === "number"
      const totalAmount = hasTotalAmount ? computeData.totalAmount : calculateTotalAmount(item)
      return {
        ...item,
        computeData: {
          ...computeData,
          totalAmount,
        },
      }
    })
    this.setData({ quoteList })
  }
})
