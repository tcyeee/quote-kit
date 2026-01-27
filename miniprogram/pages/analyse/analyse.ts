import { delQuoteDetail, getQuoteAction, offlineQuoteDetail, restoreQuoteDetail } from "../../service/api";

const app = getApp<IAppOption>()

/** 从事件中提取 index（兼容组件 detail 和 dataset 两种传递方式） */
function getIndexFromEvent(e: any): number | undefined {
  const detailIndex = e?.detail?.index
  const datasetIndex = e?.currentTarget?.dataset?.index
  const index = typeof detailIndex === "number" ? detailIndex : datasetIndex
  return typeof index === "number" ? index : undefined
}

Page({
  data: {
    safeTop: 0,
    loading: true,
    quoteAnalyze: {} as QuoteAnalyze,
  },

  async onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      safeTop: systemInfo.statusBarHeight || 0,
      quoteAnalyze: app.globalData.quoteAnalyze || {},
    })
    const quoteAnalyze = await getQuoteAction()
    this.setData({ quoteAnalyze, loading: false })
  },

  onBackTap() {
    wx.navigateBack()
  },

  /** 根据 index 获取报价项，不存在则返回 undefined */
  getQuoteItem(e: any) {
    const index = getIndexFromEvent(e)
    if (index === undefined) return undefined
    const item = this.data.quoteAnalyze.quotes[index] as QuoteAnalyzeItem | undefined
    return item ? { index, item } : undefined
  },

  /** 更新指定位置报价项的字段并刷新视图 */
  updateQuoteItem(index: number, patch: Partial<QuoteAnalyzeItem>) {
    const nextList = this.data.quoteAnalyze.quotes.slice()
    nextList[index] = { ...nextList[index], ...patch }
    this.setData({ quoteAnalyze: { ...this.data.quoteAnalyze, quotes: nextList } })
  },

  onOnlineTap(e: any) {
    const result = this.getQuoteItem(e)
    if (!result) return
    restoreQuoteDetail(result.item.id)
    this.updateQuoteItem(result.index, { removeFlag: false })
  },

  onOfflineTap(e: any) {
    const result = this.getQuoteItem(e)
    if (!result) return
    offlineQuoteDetail(result.item.id)
    this.updateQuoteItem(result.index, { removeFlag: true })
  },

  onDeleteTap(e: any) {
    const result = this.getQuoteItem(e)
    if (!result) return
    wx.showModal({
      title: "删除确认",
      content: "确定要删除该报价单吗？此操作不可恢复。",
      success: (res) => {
        if (!res.confirm) return
        const nextList = this.data.quoteAnalyze.quotes.slice()
        nextList.splice(result.index, 1)
        this.setData({ quoteAnalyze: { ...this.data.quoteAnalyze, quotes: nextList } })
        delQuoteDetail(result.item.id)
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