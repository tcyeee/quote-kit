import { setShareQuote } from "../../utils/cloud-database"

let bottomDialogHeaderTouchStartY = 0
const app = getApp<IAppOption>()
Page({
  data: {
    options: {
      bottomDialogCollapsedHeight: 20,
      bottomDialogExpandedHeight: 85,
    },
    bottomDialogExpanded: false,
    showEditEnd: false,
    currentTheme: 'amber',
    quoteDetail: {} as QuoteDetail,
  },
  showSavingToast() {
    const toast = this.selectComponent("#savingToast") as any
    if (toast && typeof toast.show === "function") {
      toast.show()
    }
  },
  onBottomDialogMaskTouchMove() {
    this.showSavingToast()
  },
  onBottomDialogHeaderTouchStart(e: WechatMiniprogram.TouchEvent) {
    const touch = e.touches[0]
    if (!touch) return
    bottomDialogHeaderTouchStartY = touch.clientY
  },
  onBottomDialogHeaderTouchEnd(e: WechatMiniprogram.TouchEvent) {
    const touch = e.changedTouches[0]
    if (!touch) return
    const deltaY = touch.clientY - bottomDialogHeaderTouchStartY
    const threshold = 30
    if (deltaY < -threshold && !this.data.bottomDialogExpanded) {
      this.setData({
        bottomDialogExpanded: true,
      })
    } else if (deltaY > threshold && this.data.bottomDialogExpanded) {
      this.setData({
        bottomDialogExpanded: false,
      })
    }
  },
  toggleBottomDialog() {
    this.setData({
      bottomDialogExpanded: !this.data.bottomDialogExpanded,
    })
  },
  onLoad() {
    const quoteDetail = app.globalData.quoteDetail
    this.setData({
      quoteDetail,
      currentTheme: quoteDetail.theme || 'amber',
    })
  },

  // 报价单更新时调用
  onQuoteDetailUpdate() {
    this.showSavingToast()
    const quoteDetail = app.globalData.quoteDetail
    this.setData({
      quoteDetail,
      currentTheme: quoteDetail.theme || 'amber',
    })
  },
  toggleConfirmDialog(event: any) {
    this.setData({
      bottomDialogExpanded: true,
      showEditEnd: event.detail
    })
  },

  async onShareAppMessage() {
    var shareId = await setShareQuote()
    console.log("quote-kit: 报价单分享完成,ID:" + shareId)
    const content: WechatMiniprogram.Page.ICustomShareContent = {
      title: "报价单",
      path: "/pages/view/view?id=" + shareId,
    }
    return content
  },
})
