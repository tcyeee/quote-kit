Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  properties: {
    item: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: 0,
    },
  },
  data: {
    showViewLog: false,
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
    onOfflineTap() {
      const index = this.data.index as number
      this.triggerEvent("offline", { index })
    },
    onDeleteTap() {
      const index = this.data.index as number
      this.triggerEvent("delete", { index })
    },
    onToggleViewLogTap() {
      const showViewLog = this.data.showViewLog as boolean
      this.setData({
        showViewLog: !showViewLog,
      })
    },
    onMoreTap() {
      const item = this.data.item as any
      const isOfflined = !!(item.quote.shareDate && item.quote.shareDate.isManuallyOfflined)

      const itemList = isOfflined ? ['删除'] : ['下架', '删除']

      wx.showActionSheet({
        itemList,
        success: (res) => {
          if (isOfflined) {
            if (res.tapIndex === 0) this.onDeleteTap()
          } else {
            if (res.tapIndex === 0) this.onOfflineTap()
            else if (res.tapIndex === 1) this.onDeleteTap()
          }
        }
      })
    },
  },
})
