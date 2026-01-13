Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  properties: {
    pricingItems: {
      type: Array,
      value: [],
    },
    serviceCollapseStatus: {
      type: Array,
      value: [],
    },
  },
  data: {
    dragServiceOverlayTop: 0,
    dragServiceCategoryIndex: -1,
    dragServiceIndex: -1,
    dragServiceSnapshot: {} as any,
    showDragServiceOverlay: false,
    categoryCollapseStatus: [] as boolean[],
  },
  methods: {
    onAddServiceTap(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      this.triggerEvent("addService", {
        categoryIndex,
      })
    },

    emitServiceChange(categoryIndex: number, serviceIndex: number, service: any) {
      this.triggerEvent("serviceChange", {
        categoryIndex,
        serviceIndex,
        service,
      })
    },

    onFieldBlur(e: any) {
      const field = e.currentTarget.dataset.field as string
      const rawValue = e.detail.value || ""
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const pricingItems = this.data.pricingItems || []
      const category = pricingItems[categoryIndex] || {}
      const items = (category as any).items || []
      const service = { ...(items[serviceIndex] || {}) }
      if (field === "name" || field === "unit") {
        ; (service as any)[field] = rawValue
      } else if (field === "unitPrice") {
        const value = parseFloat(rawValue || "0")
          ; (service as any).unitPrice = isNaN(value) ? 0 : value
      } else if (field === "quantity") {
        const value = parseInt(rawValue || "0", 10)
          ; (service as any).quantity = isNaN(value) ? 0 : value
      } else if (field === "deliveryPeriodDays") {
        const value = parseInt(rawValue || "0", 10)
          ; (service as any).deliveryPeriodDays = isNaN(value) ? 0 : value
      }
      this.emitServiceChange(categoryIndex, serviceIndex, service)
      this.triggerEvent("fieldBlur")
    },

    onDeleteTap(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      this.triggerEvent("delete", {
        categoryIndex,
        serviceIndex,
      })
    },

    onDeleteCategoryTap(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      this.triggerEvent("deleteCategory", {
        categoryIndex,
      })
    },

    onToggleCategoryCollapseTap(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const current = (this.data as any).categoryCollapseStatus as boolean[] || []
      const next = current.slice()
      next[categoryIndex] = !next[categoryIndex]
      this.setData({
        categoryCollapseStatus: next,
      })
    },

    onToggleCollapseTap(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      this.triggerEvent("toggleCollapse", {
        categoryIndex,
        serviceIndex,
      })
    },

    resetDragServiceState() {
      this.setData({
        showDragServiceOverlay: false,
        dragServiceCategoryIndex: -1,
        dragServiceIndex: -1,
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

    onDragStart(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      const pricingItems = this.data.pricingItems || []
      const category = pricingItems[categoryIndex]
      if (!category) return
      const items = (category as any).items || []
      const service = items[serviceIndex]
      if (!service) return
      const query = wx.createSelectorQuery().in(this)
      const selector = `.service-list-box-${categoryIndex}`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || clientY === null || clientY === undefined) return
        const count = items.length || 1
        const { top } = this.calculateDragOverlayTop(clientY, rect, count)
        this.setData({
          dragServiceOverlayTop: top,
          dragServiceCategoryIndex: categoryIndex,
          dragServiceIndex: serviceIndex,
          dragServiceSnapshot: {
            name: service.name,
            unitPrice: service.unitPrice,
            unit: service.unit,
            quantity: service.quantity,
            deliveryPeriodDays: service.deliveryPeriodDays,
          },
          showDragServiceOverlay: true,
        })
      }).exec()
    },

    onDragMove(e: any) {
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      const categoryIndex = (this.data as any).dragServiceCategoryIndex as number
      if (categoryIndex < 0) return
      const pricingItems = this.data.pricingItems || []
      const category = pricingItems[categoryIndex]
      if (!category) return
      const items = (category as any).items || []
      const query = wx.createSelectorQuery().in(this)
      const selector = `.service-list-box-${categoryIndex}`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || clientY === null || clientY === undefined) return
        const count = items.length || 1
        const { top } = this.calculateDragOverlayTop(clientY, rect, count)
        this.setData({
          dragServiceOverlayTop: top,
        })
      }).exec()
    },

    onDragEnd(e: any) {
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      const categoryIndex = (this.data as any).dragServiceCategoryIndex as number
      const fromIndex = (this.data as any).dragServiceIndex as number
      if (categoryIndex < 0 || fromIndex < 0) {
        this.resetDragServiceState()
        return
      }
      const pricingItems = (this.data.pricingItems || []).slice()
      const category = pricingItems[categoryIndex]
      if (!category) return
      const items = ((category as any).items || []).slice()
      if (!items.length) {
        this.resetDragServiceState()
        return
      }
      const query = wx.createSelectorQuery().in(this)
      const selector = `.service-list-box-${categoryIndex}`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || clientY === null || clientY === undefined) {
          this.resetDragServiceState()
          return
        }
        const count = items.length || 1
        const { top, itemHeight } = this.calculateDragOverlayTop(clientY, rect, count)
        let targetIndex = Math.round(itemHeight ? top / itemHeight : 0)
        if (targetIndex < 0) targetIndex = 0
        if (targetIndex > items.length - 1) targetIndex = items.length - 1
        if (targetIndex !== fromIndex) {
          const moved = items.splice(fromIndex, 1)[0]
          items.splice(targetIndex, 0, moved)
          const updatedCategory = {
            ...(category as any),
            items,
          }
          pricingItems[categoryIndex] = updatedCategory as any
          const status = (this.data.serviceCollapseStatus || []).slice() as boolean[][]
          const categoryStatus = (status[categoryIndex] || []).slice()
          const movedStatus = categoryStatus.splice(fromIndex, 1)[0]
          categoryStatus.splice(targetIndex, 0, movedStatus)
          status[categoryIndex] = categoryStatus
          this.triggerEvent("updatePricingItems", {
            pricingItems,
            serviceCollapseStatus: status,
          })
        }
        this.resetDragServiceState()
      }).exec()
    },
  },
})
