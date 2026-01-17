import { setShareQuoteLog, getShareQuoteById } from "../../utils/cloud-database"
import { calculateItemTotalAmountAndDeliveryPeriodDays, calculateShareStatus } from "../../utils/quote-utils"

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

    // 计算每个quoteDetail.items的总价,总时间, 并存入 quoteDetail.items[n].computeData中
    calculateItemTotalAmountAndDeliveryPeriodDays(quoteDetail.pricingItems)

    this.setData({ quoteDetail, shareStatus, currentTheme })
  }
})
