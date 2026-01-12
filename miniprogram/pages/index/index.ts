let bottomDialogHeaderTouchStartY = 0
// 首页报价预览页面
Page({
  data: {
    options: {
      bottomDialogCollapsedHeight: 20,
      bottomDialogExpandedHeight: 85,
    },
    bottomDialogExpanded: false,
  },
  onBottomDialogMaskTouchMove() { },
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
})
