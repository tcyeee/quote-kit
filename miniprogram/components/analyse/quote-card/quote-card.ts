Component({
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
  methods: {
    onOfflineTap() {
      const index = this.data.index as number
      this.triggerEvent("offline", { index })
    },
    onDeleteTap() {
      const index = this.data.index as number
      this.triggerEvent("delete", { index })
    },
  },
})
