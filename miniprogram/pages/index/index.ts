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
  onCollapseBottomDialog() {
    this.setData({ bottomDialogExpanded: true })
  },
  // onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
  //   // 创建分享数据
  //   wx.showModal({
  //     title: "报价单创建成功",
  //     content: "请在统计面板中追踪后续点击情况",
  //     showCancel: false,
  //     success(res) {
  //       if (res.confirm) {
  //         wx.navigateTo({ url: "/pages/analyse/analyse" })
  //       }
  //     },
  //   })
  //   console.log("quote-kit: 报价单分享完成")
  //   const content: WechatMiniprogram.Page.ICustomShareContent = {
  //     title: "报价单",
  //     path: "/pages/view/view?id=019bbc4b-2d05-723d-8f5f-156613014502",
  //   }
  //   return content
  // },
})
