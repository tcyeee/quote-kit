import { delShareQuote, getMyShareQuoteList, getShareQuoteLog, offlineShareQuote } from "../../utils/cloud-database"
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
  viewLogTop10: Array<QuoteViewLog & { viewTimeText: string; displayText: string }>,
}

Page({
  data: {
    safeTop: 0,
    // 这个字段用于展示页面信息
    list: [] as Array<AnalyseQuote>,
    loading: true,
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

  onOfflineTap(e: any) {
    const detailIndex = e && e.detail && typeof e.detail.index === "number" ? e.detail.index : undefined
    const datasetIndex = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.index : undefined
    const index = typeof detailIndex === "number" ? detailIndex : datasetIndex
    if (typeof index !== "number") return
    const item = this.data.list[index] as AnalyseQuote | undefined
    if (!item) return
    // 修改线上数据
    offlineShareQuote(item.quoteId)
    // 修改本地数据并刷新视图
    const nextList = this.data.list.slice()
    const nextQuote: QuoteDetail = {
      ...item.quote,
      shareDate: {
        ...(item.quote.shareDate || {}),
        isManuallyOfflined: true,
      },
    }
    nextList[index] = {
      ...item,
      quote: nextQuote,
    }
    this.setData({ list: nextList })
  },

  onDeleteTap(e: any) {
    const detailIndex = e && e.detail && typeof e.detail.index === "number" ? e.detail.index : undefined
    const datasetIndex = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.index : undefined
    const index = typeof detailIndex === "number" ? detailIndex : datasetIndex
    if (typeof index !== "number") return
    const item = this.data.list[index] as AnalyseQuote | undefined
    if (!item) return
    wx.showModal({
      title: "删除确认",
      content: "确定要删除该报价单吗？此操作不可恢复。",
      success: (res) => {
        if (!res.confirm) return
        // 修改本地数据
        const nextList = this.data.list.slice()
        nextList.splice(index, 1)
        this.setData({ list: nextList })
        // 修改线上数据
        delShareQuote(item.quoteId)
      }
    })
  },

  async queryShareList() {
    this.setData({ loading: true })
    try {
      const rawList = await getMyShareQuoteList()
      const sourceList = Array.isArray(rawList) ? rawList : []
      const typedList = sourceList as Array<QuoteDetail & { _id?: string; quoteId?: string }>
      const quoteIdList = typedList
        .map(item => (item as any).quoteId || (item as any)["_id"] || "")
        .filter(id => !!id) as string[]
      const logs = quoteIdList.length > 0 ? await getShareQuoteLog(quoteIdList) : []
      const logsByQuoteId: Record<string, QuoteViewLog[]> = {}
      logs.forEach(log => {
        const id = (log as any).quoteId
        if (!id) return
        if (!logsByQuoteId[id]) logsByQuoteId[id] = []
        logsByQuoteId[id].push(log)
      })
      const analyseList = typedList.map(item => buildAnalyseQuoteItem(item, logsByQuoteId))
      this.setData({ list: analyseList, loading: false })
    } catch (e) {
      this.setData({ list: [], loading: false })
    }
  },

  onShareAppMessage(res: any) {
    const quoteId = res.target.dataset.quoteId as string
    return {
      title: "报价单",
      path: "/pages/view/view?id=" + quoteId + "&entry=share",
    }
  }
})

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


function buildAnalyseQuoteItem(
  item: QuoteDetail & { _id?: string; quoteId?: string },
  logsByQuoteId: Record<string, QuoteViewLog[]>
) {
  const quoteId = (item as any).quoteId || (item as any)["_id"] || ""
  const quote = buildQuoteWithTotalAmount(item)
  const shareDate = quote.shareDate || {}
  const shareTimeText = formatDateTime(shareDate.createdAt)
  const expireTimeText = formatDateTime(shareDate.expiresAt)
  const viewLog = logsByQuoteId[quoteId] || []
  const viewCount = viewLog.length
  const viewCountDisplay = viewCount > 10 ? ">10" : `${viewCount}`
  const viewLogTop10 = viewLog.slice(0, 10).map(log => {
    const viewTimeText = formatDateTime((log as any).viewTime)
    const viewerDevice = (log as any).viewerDevice || ""
    const deviceText = viewerDevice ? `${viewerDevice}设备` : "未知设备"
    const displayText = `${viewTimeText} 一位${deviceText}用户查看了报价单`
    return {
      ...log,
      viewTimeText,
      displayText,
    }
  })
  return {
    quoteId,
    quote,
    shareTimeText,
    expireTimeText,
    viewCount,
    viewCountDisplay,
    viewLog,
    viewLogTop10,
  }
}
