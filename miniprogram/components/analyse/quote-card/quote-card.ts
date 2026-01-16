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
  },
})
