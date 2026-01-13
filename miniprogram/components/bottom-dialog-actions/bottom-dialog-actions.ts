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
    dragServiceOverlayTop: 0,
    dragServiceCategoryIndex: -1,
    dragServiceIndex: -1,
    dragServiceSnapshot: {} as any,
    showDragServiceOverlay: false,
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

    onServiceNameInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const name = e.detail.value as string
      this.updateServiceItem(categoryIndex, serviceIndex, service => ({
        ...service,
        name,
      }))
    },

    onServiceUnitPriceInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const value = parseFloat(e.detail.value || "0")
      const unitPrice = isNaN(value) ? 0 : value
      this.updateServiceItem(categoryIndex, serviceIndex, service => ({
        ...service,
        unitPrice,
      }))
    },

    onServiceUnitInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const unit = e.detail.value as string
      this.updateServiceItem(categoryIndex, serviceIndex, service => ({
        ...service,
        unit,
      }))
    },

    onServiceQuantityInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const value = parseInt(e.detail.value || "0", 10)
      const quantity = isNaN(value) ? 0 : value
      this.updateServiceItem(categoryIndex, serviceIndex, service => ({
        ...service,
        quantity,
      }))
    },

    onServiceDeliveryPeriodInput(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const value = parseInt(e.detail.value || "0", 10)
      const deliveryPeriodDays = isNaN(value) ? 0 : value
      this.updateServiceItem(categoryIndex, serviceIndex, service => ({
        ...service,
        deliveryPeriodDays,
      }))
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

    onServiceDragStart(e: any) {
      const categoryIndex = e.currentTarget.dataset.categoryIndex as number
      const serviceIndex = e.currentTarget.dataset.serviceIndex as number
      const pricingItems = this.data.quoteDetail.pricingItems || []
      const category = pricingItems[categoryIndex]
      if (!category) return
      const items = category.items || []
      const service = items[serviceIndex]
      if (!service) return
      const query = wx.createSelectorQuery().in(this)
      const selector = `.service-list-box-${categoryIndex}`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || !e.changedTouches || !e.changedTouches[0]) return
        const clientY = e.changedTouches[0].clientY
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

    onServiceDragMove(e: any) {
      const categoryIndex = this.data.dragServiceCategoryIndex
      if (categoryIndex < 0) return
      const pricingItems = this.data.quoteDetail.pricingItems || []
      const category = pricingItems[categoryIndex]
      if (!category) return
      const items = category.items || []
      const query = wx.createSelectorQuery().in(this)
      const selector = `.service-list-box-${categoryIndex}`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || !e.changedTouches || !e.changedTouches[0]) return
        const clientY = e.changedTouches[0].clientY
        const count = items.length || 1
        const { top } = this.calculateDragOverlayTop(clientY, rect, count)
        this.setData({
          dragServiceOverlayTop: top,
        })
      }).exec()
    },

    onServiceDragEnd(e: any) {
      const categoryIndex = this.data.dragServiceCategoryIndex
      const fromIndex = this.data.dragServiceIndex
      if (categoryIndex < 0 || fromIndex < 0) {
        this.resetDragServiceState()
        return
      }
      const pricingItems = this.data.quoteDetail.pricingItems.slice()
      const category = pricingItems[categoryIndex]
      if (!category) return
      const items = (category.items || []).slice()
      if (!items.length) {
        this.resetDragServiceState()
        return
      }
      const query = wx.createSelectorQuery().in(this)
      const selector = `.service-list-box-${categoryIndex}`
      query.select(selector).boundingClientRect(rect => {
        if (!rect || !e.changedTouches || !e.changedTouches[0]) {
          this.resetDragServiceState()
          return
        }
        const clientY = e.changedTouches[0].clientY
        const count = items.length || 1
        const { top, itemHeight } = this.calculateDragOverlayTop(clientY, rect, count)
        let targetIndex = Math.round(itemHeight ? top / itemHeight : 0)
        if (targetIndex < 0) targetIndex = 0
        if (targetIndex > items.length - 1) targetIndex = items.length - 1
        if (targetIndex !== fromIndex) {
          const moved = items.splice(fromIndex, 1)[0]
          items.splice(targetIndex, 0, moved)
          pricingItems[categoryIndex] = {
            ...category,
            items,
          }
          const status = this.data.serviceCollapseStatus.slice()
          const categoryStatus = (status[categoryIndex] || []).slice()
          const movedStatus = categoryStatus.splice(fromIndex, 1)[0]
          categoryStatus.splice(targetIndex, 0, movedStatus)
          status[categoryIndex] = categoryStatus
          this.setData({
            quoteDetail: {
              ...this.data.quoteDetail,
              pricingItems,
            },
            serviceCollapseStatus: status,
          })
          this.quoteDetailUpdate()
        }
        this.resetDragServiceState()
      }).exec()
    },

    quoteDetailUpdate() {
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail = this.data.quoteDetail
      this.triggerEvent("quoteDetailUpdate")
    },
  },
})
