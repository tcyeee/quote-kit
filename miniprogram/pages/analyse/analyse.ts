import { getShareQuote, getShareQuoteLog } from "../../utils/cloud-database"
import { calculateTotalAmount } from "../../utils/quote-utils"

function formatDateTime(value?: any) {
  if (!value) return ""
  const date = value instanceof Date ? value : new Date(value)
  if (!date || typeof date.getTime !== "function" || Number.isNaN(date.getTime())) return ""
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  const hours = `${date.getHours()}`.padStart(2, "0")
  const minutes = `${date.getMinutes()}`.padStart(2, "0")
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

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
    const list = Array.isArray(rawList) ? rawList : []
    const quoteList = await Promise.all(
      (list as any[]).map(async (item) => {
        const computeData = item.computeData || {}
        const hasTotalAmount = typeof computeData.totalAmount === "number"
        const totalAmount = hasTotalAmount ? computeData.totalAmount : calculateTotalAmount(item as QuoteDetail)
        const shareDate = item.shareDate || {}
        const shareTimeText = formatDateTime(shareDate.createdAt)
        const expireTimeText = formatDateTime(shareDate.expiresAt)
        let viewCount = 0
        let viewCountDisplay = "0"
        if (item._id) {
          try {
            const logs = await getShareQuoteLog(item._id as string)
            viewCount = Array.isArray(logs) ? logs.length : 0
          } catch (e) {
            viewCount = 0
          }
          viewCountDisplay = viewCount > 50 ? ">50" : `${viewCount}`
        }
        return {
          ...item,
          computeData: {
            ...computeData,
            totalAmount,
          },
          analyseMeta: {
            shareTimeText,
            expireTimeText,
            viewCount,
            viewCountDisplay,
          },
        }
      })
    )
    this.setData({ quoteList })
  }
})
