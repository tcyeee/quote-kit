import { setShareQuoteLog, getShareQuoteById } from "../../utils/cloud-database"
import { calculateShareStatus } from "../../utils/quote-utils"

Page({
  data: {
    quoteDetail: undefined as QuoteDetail | undefined,
    shareStatus: 'normal' as ShareStatus,
    currentTheme: "amber",
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

  async initData(quoteId: string) {
    const quoteDetail = await getShareQuoteById(quoteId)
    if (!quoteDetail || !quoteDetail.shareDate) return
    const shareStatus = calculateShareStatus(quoteDetail.shareDate)
    const currentTheme = quoteDetail.theme || "amber"
    this.setData({ quoteDetail, shareStatus, currentTheme })
  }
})
