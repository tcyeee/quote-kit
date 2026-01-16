import { setShareQuoteLog, getShareQuoteById } from "../../utils/cloud-database"

Page({
  data: {
    quoteDetail: undefined as QuoteDetail | undefined,
  },

  onLoad(options: Record<string, string>) {
    // 拿到报价单信息
    this.initData(options.id)
    // 添加浏览记录
    setShareQuoteLog(options.id)
  },

  goHome() {
    wx.reLaunch({ url: "/pages/index/index" })
  },

  initData(quoteId: string) {
    getShareQuoteById(quoteId).then((quoteDetail) => {
      this.setData({ quoteDetail })
    })
  }
})

