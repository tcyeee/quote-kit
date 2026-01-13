Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  properties: {
    service: {
      type: Object,
      value: {},
    },
    collapsed: {
      type: Boolean,
      value: false,
    },
    categoryIndex: {
      type: Number,
      value: 0,
    },
    serviceIndex: {
      type: Number,
      value: 0,
    },
  },
  methods: {
    emitServiceChange(service: any) {
      this.triggerEvent("serviceChange", {
        categoryIndex: this.data.categoryIndex,
        serviceIndex: this.data.serviceIndex,
        service,
      })
    },

    onFieldBlur(e: any) {
      const field = e.currentTarget.dataset.field as string
      const rawValue = e.detail.value || ""
      const service = { ...(this.data.service || {}) }
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
      this.emitServiceChange(service)
      this.triggerEvent("fieldBlur")
    },

    onDeleteTap() {
      this.triggerEvent("delete", {
        categoryIndex: this.data.categoryIndex,
        serviceIndex: this.data.serviceIndex,
      })
    },

    onToggleCollapseTap() {
      this.triggerEvent("toggleCollapse", {
        categoryIndex: this.data.categoryIndex,
        serviceIndex: this.data.serviceIndex,
      })
    },

    onDragStart(e: any) {
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      this.triggerEvent("dragStart", {
        categoryIndex: this.data.categoryIndex,
        serviceIndex: this.data.serviceIndex,
        clientY,
      })
    },

    onDragMove(e: any) {
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      this.triggerEvent("dragMove", {
        clientY,
      })
    },

    onDragEnd(e: any) {
      const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null
      this.triggerEvent("dragEnd", {
        clientY,
      })
    },
  },
})
