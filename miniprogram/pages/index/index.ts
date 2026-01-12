// 首页报价预览页面
Page({
  data: {
    options: {
      bottomDialogCollapsedHeight: 20,
      bottomDialogExpandedHeight: 85,
    },
    bottomDialogExpanded: false,
  },
  onBottomDialogMaskTouchMove() {},
  toggleBottomDialog() {
    this.setData({
      bottomDialogExpanded: !this.data.bottomDialogExpanded,
    })
  },
})
