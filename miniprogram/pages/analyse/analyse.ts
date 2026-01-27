import { delQuoteDetail, getQuoteAction, offlineQuoteDetail, restoreQuoteDetail, updateQuoteDetail } from "../../service/api";

const app = getApp<IAppOption>()


Page({
  data: {
    safeTop: 0,
    loading: true,
    quoteAnalyze: {} as QuoteAnalyze,
  },

  async onLoad() {
    // 计算安全高度
    const systemInfo = wx.getSystemInfoSync()
    this.setData({ safeTop: systemInfo.statusBarHeight || 0 })
    // 先拿到全局的报价分析数据
    this.setData({ quoteAnalyze: app.globalData.quoteAnalyze || {} })
    // 重新统计
    this.setData({ quoteAnalyze: await getQuoteAction() })
    this.setData({ loading: false })
  },

  onBackTap() {
    wx.navigateBack()
  },

  async onOnlineTap(e: any) {
    const detailIndex = e && e.detail && typeof e.detail.index === "number" ? e.detail.index : undefined
    const datasetIndex = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.index : undefined
    const index = typeof detailIndex === "number" ? detailIndex : datasetIndex
    if (typeof index !== "number") return
    const item = this.data.quoteAnalyze.quotes[index] as QuoteAnalyzeItem | undefined
    if (!item) return

    // 修改线上数据
    restoreQuoteDetail(item.id)
    // 修改本地数据中的状态(removeFlag=false)
    const nextList = this.data.quoteAnalyze.quotes.slice()
    nextList[index] = { ...item, removeFlag: false }
    this.setData({ quoteAnalyze: { ...this.data.quoteAnalyze, quotes: nextList } })
  },

  onOfflineTap(e: any) {
    const detailIndex = e && e.detail && typeof e.detail.index === "number" ? e.detail.index : undefined
    const datasetIndex = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.index : undefined
    const index = typeof detailIndex === "number" ? detailIndex : datasetIndex
    if (typeof index !== "number") return
    const item = this.data.quoteAnalyze.quotes[index] as QuoteAnalyzeItem | undefined
    if (!item) return

    // 修改线上数据
    offlineQuoteDetail(item.id)
    // 修改本地数据中的状态(removeFlag=true)
    const nextList = this.data.quoteAnalyze.quotes.slice()
    nextList[index] = { ...item, removeFlag: true }
    this.setData({ quoteAnalyze: { ...this.data.quoteAnalyze, quotes: nextList } })
  },

  onDeleteTap(e: any) {
    const detailIndex = e && e.detail && typeof e.detail.index === "number" ? e.detail.index : undefined
    const datasetIndex = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.index : undefined
    const index = typeof detailIndex === "number" ? detailIndex : datasetIndex
    if (typeof index !== "number") return
    const item = this.data.quoteAnalyze.quotes[index] as QuoteAnalyzeItem | undefined
    if (!item) return
    wx.showModal({
      title: "删除确认",
      content: "确定要删除该报价单吗？此操作不可恢复。",
      success: (res) => {
        if (!res.confirm) return
        // 修改本地数据
        const nextList = this.data.quoteAnalyze.quotes.slice()
        nextList.splice(index, 1)
        this.setData({ quoteAnalyze: { ...this.data.quoteAnalyze, quotes: nextList } })
        // 修改线上数据
        delQuoteDetail(item.id)
      }
    })
  },

  onShareAppMessage(res: any) {
    const quoteId = res.target.dataset.quoteId as string
    return {
      title: "报价单",
      path: "/pages/view/view?id=" + quoteId + "&entry=share",
    }
  }
})