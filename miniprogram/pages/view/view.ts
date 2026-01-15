Page({
  data: {
    options: {
    },
  },

  goHome() {
    wx.reLaunch({
      url: "/pages/index/index",
    })
  },
})
