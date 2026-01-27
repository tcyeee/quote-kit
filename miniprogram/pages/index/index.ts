import { createQuoteDetail, saveAsPic } from "../../service/api"

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

  async onSaveImage() {
    var quote = app.globalData.quoteDetail
    var quoteDetail = await createQuoteDetail(quote)
    var url = await saveAsPic(quoteDetail.id)
    console.log("============");
    console.log(url);
    console.log("============");
  },

  async onSaveExcel() {
    var quote = app.globalData.quoteDetail
    var quoteDetail = await createQuoteDetail(quote)
    var url = await saveAsPic(quoteDetail.id)
    console.log("============");
    console.log(url);
    console.log("============");
  },

  async onShareAppMessage() {
    const app = getApp<IAppOption>()
    var quote = app.globalData.quoteDetail
    var quoteDetail = await createQuoteDetail(quote)
    console.log("quote-kit: 报价单分享完成,ID:" + quoteDetail.id)
    const title = app.globalData.quoteDetail.projectName || "报价单"
    const content: WechatMiniprogram.Page.ICustomShareContent = {
      title,
      path: "/pages/view/view?id=" + quoteDetail.id + "&entry=share",
      imageUrl: "/assets/share.png",
    }
    return content
  },
})
