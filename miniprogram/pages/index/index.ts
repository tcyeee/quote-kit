let bottomDialogHeaderTouchStartY = 0
const app = getApp<IAppOption>()
Page({
  data: {
    options: {
      bottomDialogCollapsedHeight: 20,
      bottomDialogExpandedHeight: 85,
    },
    bottomDialogExpanded: false,
    currentTheme: 'amber',
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
      currentTheme: quoteDetail.theme || 'amber',
    })
  },
  onQuoteDetailUpdate() {
    this.showSavingToast()
    const quoteDetail = app.globalData.quoteDetail
    this.setData({
      currentTheme: quoteDetail.theme || 'amber',
    })
    const preview = this.selectComponent("#quotePreview")
    if (preview) {
      preview.setData({ quoteDetail })
    }
  },
  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    const quoteDetail = app.globalData.quoteDetail
    const content: WechatMiniprogram.Page.ICustomShareContent = {
      title: "报价单",
      path: "/pages/view/view?id=019bbc4b-2d05-723d-8f5f-156613014502",
    }
    if (quoteDetail && quoteDetail.domain && quoteDetail.domain.logoUrl) {
      content.imageUrl = quoteDetail.domain.logoUrl
    }
    return content
  },
})
