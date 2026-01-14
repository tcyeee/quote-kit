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
    dragPayNodeOverlayTop: 0,
    dragPayNodeIndex: -1,
    dragPayNodeSnapshot: {} as any,
    showDragPayNodeOverlay: false,
  },
  lifetimes: {
    attached() {
      const payNodes = this.data.payNodes || []
      const length = payNodes.length || 0
      if (!length) return
      const status = new Array<boolean>(length).fill(true)
      status[0] = false
      this.setData({
        payNodeCollapseStatus: status,
      })
    },
  },
  methods: {
    resetDragPayNodeState() {
      this.setData({
        showDragPayNodeOverlay: false,
        dragPayNodeIndex: -1,
      })
    },

    calculateDragOverlayTop(clientY: number, rect: WechatMiniprogram.BoundingClientRectCallbackResult, count: number) {
      const listTop = rect.top
      const listHeight = rect.height || 0
      const itemCount = count || 1
      const itemHeight = itemCount > 0 && listHeight > 0 ? listHeight / itemCount : 60
      let top = clientY - listTop - itemHeight / 2
      if (top < 0) top = 0
      const maxTop = Math.max(0, listHeight - itemHeight)
      if (top > maxTop) top = maxTop
      return {
        top,
        itemHeight,
      }
    },

    onPayNodeDragStart(e: any) {
      const index = e.currentTarget.dataset.index as number
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      const payNodes = this.data.payNodes || []
      const node = payNodes[index]
      if (!node) return
      const query = wx.createSelectorQuery().in(this)
      const selector = `.pay-node-list-box`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || clientY === null || clientY === undefined) return
        const count = payNodes.length || 1
        const { top } = this.calculateDragOverlayTop(clientY, rect, count)
        this.setData({
          dragPayNodeOverlayTop: top,
          dragPayNodeIndex: index,
          dragPayNodeSnapshot: {
            nodeName: node.nodeName,
            nodeRatio: node.nodeRatio,
            nodeDate: node.nodeDate,
          },
          showDragPayNodeOverlay: true,
        })
      }).exec()
    },

    onPayNodeDragMove(e: any) {
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      const index = (this.data as any).dragPayNodeIndex as number
      if (index < 0) return
      const payNodes = this.data.payNodes || []
      if (!payNodes.length) return
      const query = wx.createSelectorQuery().in(this)
      const selector = `.pay-node-list-box`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || clientY === null || clientY === undefined) return
        const count = payNodes.length || 1
        const { top } = this.calculateDragOverlayTop(clientY, rect, count)
        this.setData({
          dragPayNodeOverlayTop: top,
        })
      }).exec()
    },

    onPayNodeDragEnd(e: any) {
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      const fromIndex = (this.data as any).dragPayNodeIndex as number
      if (fromIndex < 0) {
        this.resetDragPayNodeState()
        return
      }
      const payNodes = (this.data.payNodes || []).slice()
      if (!payNodes.length) {
        this.resetDragPayNodeState()
        return
      }
      const query = wx.createSelectorQuery().in(this)
      const selector = `.pay-node-list-box`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || clientY === null || clientY === undefined) {
          this.resetDragPayNodeState()
          return
        }
        const count = payNodes.length || 1
        const { top, itemHeight } = this.calculateDragOverlayTop(clientY, rect, count)
        let targetIndex = Math.round(itemHeight ? top / itemHeight : 0)
        if (targetIndex < 0) targetIndex = 0
        if (targetIndex > payNodes.length - 1) targetIndex = payNodes.length - 1
        if (targetIndex !== fromIndex) {
          const moved = payNodes.splice(fromIndex, 1)[0]
          payNodes.splice(targetIndex, 0, moved)
          const status = (this.data.payNodeCollapseStatus || []).slice() as boolean[]
          const nextStatus = status.slice()
          if (nextStatus.length === payNodes.length) {
            const movedStatus = nextStatus.splice(fromIndex, 1)[0]
            nextStatus.splice(targetIndex, 0, movedStatus)
          }
          this.setData({
            payNodes,
            payNodeCollapseStatus: nextStatus,
          })
          this.triggerEvent("change", {
            payNodes,
          })
        }
        this.resetDragPayNodeState()
      }).exec()
    },
    onToggleCollapseTap(e: any) {
      const index = e.currentTarget.dataset.index as number
      const current = ((this.data as any).payNodeCollapseStatus as boolean[]) || []
      const isCollapsed = !!current[index]
      const next = current.map(() => true)
      next[index] = !isCollapsed
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
      nextStatus.push(true)
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
