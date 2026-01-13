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
      const serviceCollapseStatus = (quoteDetail.pricingItems || []).map(category => {
        const items = category.items || []
        return items.map(() => true)
      })
      this.setData({
        quoteDetail,
        serviceCollapseStatus,
      })
    },
  },
  methods: {
    updateQuoteDetail(partial: Partial<QuoteDetail>) {
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          ...partial,
        },
      })
    },

    updateServiceItem(
      categoryIndex: number,
      serviceIndex: number,
      updater: (service: any) => any,
    ) {
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      const category = pricingItems[categoryIndex]
      if (!category) return
      const items = (category.items || []).slice()
      const service = items[serviceIndex]
      if (!service) return
      items[serviceIndex] = updater(service)
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      this.updateQuoteDetail({ pricingItems })
    },

    resetDragServiceState() { },

    calculateDragOverlayTop() {
      return {
        top: 0,
        itemHeight: 0,
      }
    },

    onSaveImageTap() {
      wx.showToast({ title: "当前版本不支持", icon: "none" })
    },

    onThemeTap(e: any) {
      const theme = e.currentTarget.dataset.theme as string
      this.updateQuoteDetail({ theme })
      this.quoteDetailUpdate()
    },

    onDomainNameInput(e: any) {
      const name = e.detail.value as string
      this.updateQuoteDetail({
        domain: {
          ...this.data.quoteDetail.domain,
          name,
        },
      } as any)
    },

    onDomainNameBlur() {
      this.quoteDetailUpdate()
    },

    onDepositRatioInput(e: any) {
      const value = parseFloat(e.detail.value || "0")
      const depositRatio = isNaN(value) ? 0 : value / 100
      this.updateQuoteDetail({
        serviceProcess: {
          ...this.data.quoteDetail.serviceProcess,
          depositRatio,
        },
      } as any)
    },

    onDepositRatioBlur() {
      this.quoteDetailUpdate()
    },

    onFinalPaymentRatioInput(e: any) {
      const value = parseFloat(e.detail.value || "0")
      const finalPaymentRatio = isNaN(value) ? 0 : value / 100
      this.updateQuoteDetail({
        serviceProcess: {
          ...this.data.quoteDetail.serviceProcess,
          finalPaymentRatio,
        },
      } as any)
    },

    onFinalPaymentRatioBlur() {
      this.quoteDetailUpdate()
    },

    onServiceTermsInput(e: any) {
      const serviceTerms = e.detail.value as string
      this.updateQuoteDetail({ serviceTerms })
    },

    onServiceTermsBlur() {
      this.quoteDetailUpdate()
    },

    onServiceChange(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const serviceIndex = e.detail.serviceIndex as number
      const service = e.detail.service as any
      this.updateServiceItem(categoryIndex, serviceIndex, () => service)
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
      const categoryIndex = e.detail.categoryIndex as number
      const serviceIndex = e.detail.serviceIndex as number
      const status = this.data.serviceCollapseStatus.slice()
      const categoryStatus = (status[categoryIndex] || []).slice()
      categoryStatus[serviceIndex] = !categoryStatus[serviceIndex]
      status[categoryIndex] = categoryStatus
      this.setData({
        serviceCollapseStatus: status,
      })
    },

    onDeleteService(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const serviceIndex = e.detail.serviceIndex as number
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      const category = pricingItems[categoryIndex]
      if (!category) return
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

    onDeleteCategory(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      if (!pricingItems[categoryIndex]) return
      pricingItems.splice(categoryIndex, 1)
      const serviceCollapseStatus = this.data.serviceCollapseStatus.slice()
      serviceCollapseStatus.splice(categoryIndex, 1)
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
        serviceCollapseStatus,
      })
      this.quoteDetailUpdate()
    },

    onServiceDragStart() { },

    onServiceDragMove() { },

    onServiceDragEnd() { },

    quoteDetailUpdate() {
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail = this.data.quoteDetail
      this.triggerEvent("quoteDetailUpdate")
    },
  },
})
