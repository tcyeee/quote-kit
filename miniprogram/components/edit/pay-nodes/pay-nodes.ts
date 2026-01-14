Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  properties: {
    payNodes: {
      type: Array,
      value: [],
    },
  },
  methods: {
    onRatioInput(e: any) {
      const index = e.currentTarget.dataset.index as number
      const value = parseFloat(e.detail.value || "0")
      const nodeRatio = isNaN(value) ? 0 : value / 100
      const payNodes = (this.data.payNodes || []).slice()
      const node = payNodes[index]
      if (!node) return
      payNodes[index] = {
        ...node,
        nodeRatio,
      }
      this.setData({
        payNodes,
      })
      this.triggerEvent("change", {
        payNodes,
      })
    },

    onBlur() {
      this.triggerEvent("blur")
    },

    onAddNode() {
      const payNodes = (this.data.payNodes || []).slice()
      const nextIndex = payNodes.length + 1
      const newNode: QuotePayNode = {
        nodeName: `交付节点${nextIndex}`,
        nodeRatio: 0,
      }
      payNodes.push(newNode)
      this.setData({
        payNodes,
      })
      this.triggerEvent("change", {
        payNodes,
      })
      this.triggerEvent("blur")
    },
  },
})

