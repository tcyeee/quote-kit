import { formatDateTime } from "../../../utils/base-utils"

Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  properties: {
    item: {
      type: Object,
      value: {} as QuoteAnalyzeItem,
    },
    index: {
      type: Number,
      value: 0,
    },
  },
  data: {
    showViewLog: false,
    showMoreMenu: false,
  },
  methods: {
    onPreviewTap() {
      const item = this.data.item as any
      const quoteId = item && item.quoteId
      if (!quoteId) return
      wx.navigateTo({
        url: "/pages/view/view?id=" + quoteId + "&entry=preview",
      })
    },
    onOnlineTap() {
      const index = this.data.index as number
      this.triggerEvent("online", { index })
      this.setData({ showMoreMenu: false })
    },
    onOfflineTap() {
      const index = this.data.index as number
      this.triggerEvent("offline", { index })
      this.setData({ showMoreMenu: false })
    },
    onDeleteTap() {
      const index = this.data.index as number
      this.triggerEvent("delete", { index })
      this.setData({ showMoreMenu: false })
    },
    onToggleViewLogTap() {
      const showViewLog = this.data.showViewLog as boolean
      this.setData({
        showViewLog: !showViewLog,
      })
    },
    onMoreTap() {
      this.setData({
        showMoreMenu: !this.data.showMoreMenu,
      })
    },
    onCloseMenu() {
      this.setData({
        showMoreMenu: false,
      })
    },

    formatDate(expireTime: number) {
      return formatDateTime(expireTime)
    }
  },
})
