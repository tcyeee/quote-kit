import { getShareQuote } from "../../utils/cloud-database"

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
    const quoteList = await getShareQuote()
    this.setData({ quoteList })
  }
})
