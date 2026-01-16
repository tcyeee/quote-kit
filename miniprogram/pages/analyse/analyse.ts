import { getShareQuote, getShareQuoteLog } from "../../utils/cloud-database"
import { calculateTotalAmount } from "../../utils/quote-utils"
import { formatDateTime } from "../../utils/base-utils"

declare interface AnalyseQuote {
  quoteId: string,     // 报价单ID
  quote: QuoteDetail,  // 源报价数据（包含总金额等计算属性）
  shareTimeText: string, // 分享时间文案
  expireTimeText: string, // 截止时间文案
  viewCount: number,   // 查看次数
  viewCountDisplay: string, // 查看次数显示文本(最多10次,超出则显示>10)
  viewLog: Array<QuoteViewLog>, // 查看记录
}

Page({
  data: {
    safeTop: 0,
    // 这个字段用于展示页面信息
    list: [] as Array<AnalyseQuote>,
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
    const sourceList = Array.isArray(rawList) ? rawList : []
    const analyseList = await Promise.all(
      (sourceList as Array<QuoteDetail & { _id?: string; quoteId?: string }>).map(item => buildAnalyseQuoteItem(item))
    )
    this.setData({ list: analyseList })
  }
})

// 根据分享记录构建查看次数相关元信息
async function buildQuoteViewMeta(quoteId?: string) {
  if (!quoteId) {
    return {
      viewCount: 0,
      viewCountDisplay: "0",
      viewLog: [] as Array<QuoteViewLog>,
    }
  }
  let viewCount = 0
  let viewLog: Array<QuoteViewLog> = []
  try {
    const logs = await getShareQuoteLog(quoteId)
    viewLog = Array.isArray(logs) ? logs as Array<QuoteViewLog> : []
    viewCount = viewLog.length
  } catch (e) {
    viewCount = 0
    viewLog = []
  }
  const viewCountDisplay = viewCount > 10 ? ">10" : `${viewCount}`
  return {
    viewCount,
    viewCountDisplay,
    viewLog,
  }
}

// 确保报价单包含总金额计算结果
function buildQuoteWithTotalAmount(item: QuoteDetail) {
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
}


async function buildAnalyseQuoteItem(item: QuoteDetail & { _id?: string; quoteId?: string }) {
  const quoteId = (item as any).quoteId || (item as any)["_id"] || ""
  const quote = buildQuoteWithTotalAmount(item)
  const shareDate = quote.shareDate || {}
  const shareTimeText = formatDateTime(shareDate.createdAt)
  const expireTimeText = formatDateTime(shareDate.expiresAt)
  const viewMeta = await buildQuoteViewMeta(quoteId)
  return {
    quoteId,
    quote,
    shareTimeText,
    expireTimeText,
    viewCount: viewMeta.viewCount,
    viewCountDisplay: viewMeta.viewCountDisplay,
    viewLog: viewMeta.viewLog,
  }
}
