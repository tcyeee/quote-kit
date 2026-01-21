Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    quoteDetail: {} as QuoteDetail,
  },
  lifetimes: {
    attached() {
      const app = getApp<IAppOption>()
      this.setData({
        quoteDetail: app.globalData.quoteDetail,
      })
    },
  },
  methods: {
    updateQuoteDetail(partial: Partial<QuoteDetail>) {
      const quoteDetail = {
        ...this.data.quoteDetail,
        ...partial,
      }
      this.setData({
        quoteDetail,
      })
      this.triggerEvent("update", partial)
    },

    onUpdatePricingItems(e: any) {
      const pricingItems = e.detail.pricingItems as QuotePricingCategory[]
      this.updateQuoteDetail({ pricingItems })
    },

    onServiceChange(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const serviceIndex = e.detail.serviceIndex as number
      const service = e.detail.service as any
      this.updateServiceItem(categoryIndex, serviceIndex, () => service)
    },

    updateServiceItem(categoryIndex: number, serviceIndex: number, updater: (service: any) => any) {
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

    onAddService(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      const category = pricingItems[categoryIndex]
      if (!category) return
      const items = (category.items || []).slice()
      const newService: QuoteServiceItem = {
        name: "新建项目",
        description: null,
        unit: "项",
        unitPrice: 0,
        quantity: 1,
        deliveryPeriodDays: 10,
      }
      items.push(newService)
      pricingItems[categoryIndex] = {
        ...category,
        items,
      }
      this.updateQuoteDetail({ pricingItems })
    },

    onAddCategory() {
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      const newCategory: QuotePricingCategory = {
        name: "新建服务类型",
        items: [],
      }
      pricingItems.push(newCategory)
      this.updateQuoteDetail({ pricingItems })
    },

    onServiceFieldBlur() {},

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
      this.updateQuoteDetail({ pricingItems })
    },

    onDeleteCategory(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      if (!pricingItems[categoryIndex]) return
      pricingItems.splice(categoryIndex, 1)
      this.updateQuoteDetail({ pricingItems })
    },
  },
})
