import { addViewLog, getQuoteDetail } from "../../service/api"
import { calculateItemTotalAmountAndDeliveryPeriodDays, calculateShareStatus } from "../../utils/quote-utils"

enum ViewEntryType { Share = "share", Preview = "preview" }

Page({
  data: {
    quoteDetail: {} as QuoteDetail,
    shareStatus: 'normal' as ShareStatus,
    currentTheme: "amber",
    entryType: ViewEntryType.Share as ViewEntryType,
  },

  onLoad(options: Record<string, string>) {
    const entryType = (options.entry as ViewEntryType) || ViewEntryType.Share
    this.setData({ entryType })

    this.initData(options.id)
    this.addViewLog(options.id)
  },

  goHome() {
    wx.reLaunch({ url: "/pages/index/index" })
  },

  goBack() { wx.navigateBack() },

  async initData(quoteId: string) {
    const quoteDetail = await getQuoteDetail(quoteId)
    if (!quoteDetail) return
    const shareStatus = calculateShareStatus(quoteDetail.expiresAt, quoteDetail.removeFlag)
    const currentTheme = quoteDetail.theme || "amber"
    calculateItemTotalAmountAndDeliveryPeriodDays(quoteDetail.pricingItems)
    this.setData({ quoteDetail, shareStatus, currentTheme })
  },

  // 添加访问记录
  async addViewLog(quoteId: string) {
    const systemInfo = wx.getSystemInfoSync()
    const app = getApp<IAppOption>()
    var globalData = app.globalData
    const info = {
      quoteId: quoteId,
      viewerId: globalData.uid || "unknown",
      viewerDevice: systemInfo.platform,
      viewerSystem: systemInfo.system,
      viewTime: new Date(),
    }
    await addViewLog(info)
  }
})
