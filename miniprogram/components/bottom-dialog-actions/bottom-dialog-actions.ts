type CollapseStatus = {
  theme: boolean,
  company: boolean,
  service: boolean,
  payment: boolean,
  remark: boolean,
}

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    quoteDetail: {} as QuoteDetail,
    CollapseStatus: {
      theme: false,
      company: false,
      service: false,
      payment: false,
      remark: false,
    },
    serviceCollapseStatus: [] as boolean[][],
  },
  lifetimes: {
    attached() {
      const quoteDetail = getApp<IAppOption>().globalData.quoteDetail
      const serviceCollapseStatus = (quoteDetail.pricingItems || []).map(category =>
        (category.items || []).map(() => false),
      )
      this.setData({
        quoteDetail,
        serviceCollapseStatus,
      })
    },
  },
  methods: {
    onSaveImageTap() {
      wx.showToast({ title: "当前版本不支持", icon: "none" })
    },

    onThemeTap(e: any) {
      const theme = e.currentTarget.dataset.theme as string
      this.setData({ quoteDetail: { ...this.data.quoteDetail, theme } })
      this.quoteDetailUpdate()
    },

    onDomainNameInput(e: any) {
      const name = e.detail.value as string
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          domain: {
            ...this.data.quoteDetail.domain,
            name,
          },
        },
      })
    },

    onDomainNameBlur() {
      this.quoteDetailUpdate()
    },

    onDepositRatioInput(e: any) {
      const value = parseFloat(e.detail.value || "0")
      const depositRatio = isNaN(value) ? 0 : value / 100
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          serviceProcess: {
            ...this.data.quoteDetail.serviceProcess,
            depositRatio,
          },
        },
      })
    },

    onDepositRatioBlur() {
      this.quoteDetailUpdate()
    },

    onFinalPaymentRatioInput(e: any) {
      const value = parseFloat(e.detail.value || "0")
      const finalPaymentRatio = isNaN(value) ? 0 : value / 100
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          serviceProcess: {
            ...this.data.quoteDetail.serviceProcess,
            finalPaymentRatio,
          },
        },
      })
    },

    onFinalPaymentRatioBlur() {
      this.quoteDetailUpdate()
    },

    onServiceTermsInput(e: any) {
      const serviceTerms = e.detail.value as string
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          serviceTerms,
        },
      })
    },

    onServiceTermsBlur() {
      this.quoteDetailUpdate()
    },

    onServiceNameInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const name = e.detail.value as string
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      const items = category.items.slice()
      const service = items[serviceIndex]
      items[serviceIndex] = {
        ...service,
        name,
      }
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
    },

    onServiceUnitPriceInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const value = parseFloat(e.detail.value || "0")
      const unitPrice = isNaN(value) ? 0 : value
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      const items = category.items.slice()
      const service = items[serviceIndex]
      items[serviceIndex] = {
        ...service,
        unitPrice,
      }
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
    },

    onServiceUnitInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const unit = e.detail.value as string
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      const items = category.items.slice()
      const service = items[serviceIndex]
      items[serviceIndex] = {
        ...service,
        unit,
      }
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
    },

    onServiceQuantityInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const value = parseInt(e.detail.value || "0", 10)
      const quantity = isNaN(value) ? 0 : value
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      const items = category.items.slice()
      const service = items[serviceIndex]
      items[serviceIndex] = {
        ...service,
        quantity,
      }
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
    },

    onServiceDeliveryPeriodInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const value = parseInt(e.detail.value || "0", 10)
      const deliveryPeriodDays = isNaN(value) ? 0 : value
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      const items = category.items.slice()
      const service = items[serviceIndex]
      items[serviceIndex] = {
        ...service,
        deliveryPeriodDays,
      }
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
    },

    onServiceFieldBlur() {
      this.quoteDetailUpdate()
    },

    onToggleSection(e: any) {
      const section = e.currentTarget.dataset.section as keyof CollapseStatus
      const CollapseStatus = this.data.CollapseStatus
      this.setData({
        CollapseStatus: { ...CollapseStatus, [section]: !CollapseStatus[section] },
      })
    },

    onToggleServiceCollapse(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const status = this.data.serviceCollapseStatus.slice()
      const categoryStatus = (status[categoryIndex] || []).slice()
      categoryStatus[serviceIndex] = !categoryStatus[serviceIndex]
      status[categoryIndex] = categoryStatus
      this.setData({
        serviceCollapseStatus: status,
      })
    },

    onDeleteService(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      const items = category.items.slice()
      items.splice(serviceIndex, 1)
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      const status = this.data.serviceCollapseStatus.slice()
      const categoryStatus = (status[categoryIndex] || []).slice()
      categoryStatus.splice(serviceIndex, 1)
      status[categoryIndex] = categoryStatus
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
        serviceCollapseStatus: status,
      })
      this.quoteDetailUpdate()
    },

    onMoveServiceUp(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      if (serviceIndex === 0) return
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      const items = category.items.slice()
      const prevIndex = serviceIndex - 1
      const current = items[serviceIndex]
      const prev = items[prevIndex]
      items[prevIndex] = current
      items[serviceIndex] = prev
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      const status = this.data.serviceCollapseStatus.slice()
      const categoryStatus = (status[categoryIndex] || []).slice()
      const prevStatus = categoryStatus[prevIndex]
      const currentStatus = categoryStatus[serviceIndex]
      categoryStatus[prevIndex] = currentStatus
      categoryStatus[serviceIndex] = prevStatus
      status[categoryIndex] = categoryStatus
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
        serviceCollapseStatus: status,
      })
      this.quoteDetailUpdate()
    },

    onMoveServiceDown(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      const items = category.items.slice()
      if (serviceIndex >= items.length - 1) return
      const nextIndex = serviceIndex + 1
      const current = items[serviceIndex]
      const next = items[nextIndex]
      items[nextIndex] = current
      items[serviceIndex] = next
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      const status = this.data.serviceCollapseStatus.slice()
      const categoryStatus = (status[categoryIndex] || []).slice()
      const nextStatus = categoryStatus[nextIndex]
      const currentStatus = categoryStatus[serviceIndex]
      categoryStatus[nextIndex] = currentStatus
      categoryStatus[serviceIndex] = nextStatus
      status[categoryIndex] = categoryStatus
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
        serviceCollapseStatus: status,
      })
      this.quoteDetailUpdate()
    },

    quoteDetailUpdate() {
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail = this.data.quoteDetail
      this.triggerEvent("quoteDetailUpdate")
    },
  },
})
