import { setShareQuoteLog } from "../../utils/cloud-database"

Page({
  data: {
  },

  onLoad(options: Record<string, string>) {
    setShareQuoteLog(options.id)
  },

  goHome() {
    wx.reLaunch({ url: "/pages/index/index" })
  },
})
