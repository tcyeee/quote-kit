import { setShareQuoteLog, getShareQuoteById } from "../../utils/cloud-database"

Page({
  data: {
    quoteDetail: undefined as QuoteDetail | undefined,
    shareStatus: "normal" as "normal" | "offlined" | "expired",
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

  initData(quoteId: string) {
    getShareQuoteById(quoteId).then((quoteDetail) => {
      let shareStatus: "normal" | "offlined" | "expired" = "normal"
      const shareDate = quoteDetail.shareDate

      if (shareDate?.isManuallyOfflined) {
        shareStatus = "offlined"
      } else if (shareDate?.expiresAt) {
        const expiresAt =
          shareDate.expiresAt instanceof Date
            ? shareDate.expiresAt
            : new Date(shareDate.expiresAt)
        if (expiresAt.getTime() < Date.now()) {
          shareStatus = "expired"
        }
      }

      this.setData({
        quoteDetail,
        shareStatus,
        currentTheme: quoteDetail.theme || "amber",
      })
    })
  }
})
