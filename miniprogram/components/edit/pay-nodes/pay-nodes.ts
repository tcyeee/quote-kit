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
  data: {
    payNodeCollapseStatus: [] as boolean[],
  },
  lifetimes: {
    attached() {
      const payNodes = this.data.payNodes || []
      const length = payNodes.length || 0
      if (!length) return
      const status = new Array<boolean>(length).fill(false)
      this.setData({
        payNodeCollapseStatus: status,
      })
    },
  },
  methods: {
    onToggleCollapseTap(e: any) {
      const index = e.currentTarget.dataset.index as number
      const current = ((this.data as any).payNodeCollapseStatus as boolean[]) || []
      const next = current.slice()
      const currentValue = !!next[index]
      next[index] = !currentValue
      this.setData({
        payNodeCollapseStatus: next,
      })
    },

    onNodeDateChange(e: any) {
      const index = e.currentTarget.dataset.index as number
      const value = e.detail.value || ""
      const payNodes = (this.data.payNodes || []).slice()
      const node = payNodes[index]
      if (!node) return
      payNodes[index] = {
        ...node,
        nodeDate: value || undefined,
      }
      this.setData({
        payNodes,
      })
      this.triggerEvent("change", {
        payNodes,
      })
      this.triggerEvent("blur")
    },

    onNodeNameBlur(e: any) {
      const index = e.currentTarget.dataset.index as number
      const rawValue = e.detail.value || ""
      const payNodes = (this.data.payNodes || []).slice()
      const node = payNodes[index]
      if (!node) return
      payNodes[index] = {
        ...node,
        nodeName: rawValue,
      }
      this.setData({
        payNodes,
      })
      this.triggerEvent("change", {
        payNodes,
      })
      this.triggerEvent("blur")
    },

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

    onDeleteNodeTap(e: any) {
      const index = e.currentTarget.dataset.index as number
      const payNodes = (this.data.payNodes || []).slice()
      if (index < 0 || index >= payNodes.length) return
      payNodes.splice(index, 1)
      const currentStatus = ((this.data as any).payNodeCollapseStatus as boolean[]) || []
      const nextStatus = currentStatus.slice()
      if (index < nextStatus.length) {
        nextStatus.splice(index, 1)
      }
      this.setData({
        payNodes,
        payNodeCollapseStatus: nextStatus,
      })
      this.triggerEvent("change", {
        payNodes,
      })
      this.triggerEvent("blur")
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
      const currentStatus = ((this.data as any).payNodeCollapseStatus as boolean[]) || []
      const nextStatus = currentStatus.slice()
      nextStatus.push(false)
      this.setData({
        payNodes,
        payNodeCollapseStatus: nextStatus,
      })
      this.triggerEvent("change", {
        payNodes,
      })
      this.triggerEvent("blur")
    },
  },
})
