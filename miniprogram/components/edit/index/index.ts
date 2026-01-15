import { calculateOverallDeliveryPeriodDays } from '../../../utils/quote-utils'

type CollapseStatus = {
  theme: boolean,
  client: boolean,
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
      client: false,
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
        if (!items.length) return []
        const status = new Array<boolean>(items.length).fill(true)
        status[0] = false
        return status
      })
      this.setData({
        quoteDetail,
        serviceCollapseStatus,
      })
      this.quoteDetailUpdate()
    },
  },
  methods: {
    onAnalyseTap() {
      wx.navigateTo({
        url: "/pages/analyse/analyse",
      })
    },

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

    toggleConfirmDialog() {
      this.triggerEvent("toggleConfirmDialog", true)
    },

    calculateDragOverlayTop() {
      return {
        top: 0,
        itemHeight: 0,
      }
    },

    onThemeTap(e: any) {
      const theme = e.currentTarget.dataset.theme as string
      this.updateQuoteDetail({ theme })
      this.quoteDetailUpdate()
    },

    onClientNameInput(e: any) {
      const clientName = e.detail.value as string
      this.updateQuoteDetail({ clientName })
    },

    onClientNameBlur() {
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

    onPayNodesChange(e: any) {
      const PayNodes = e.detail.payNodes as QuotePayNode[]
      this.updateQuoteDetail({ PayNodes })
    },

    onPayNodesBlur() {
      this.quoteDetailUpdate()
    },

    onServiceTermsInput(e: any) {
      const serviceTerms = e.detail.value as string
      this.updateQuoteDetail({ serviceTerms })
    },

    onServiceTermsBlur() {
      this.quoteDetailUpdate()
    },

    onUpdatePricingItems(e: any) {
      const pricingItems = e.detail.pricingItems as QuotePricingCategory[]
      const serviceCollapseStatus = e.detail.serviceCollapseStatus as boolean[][]
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
        serviceCollapseStatus,
      })
      this.quoteDetailUpdate()
    },

    onServiceChange(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const serviceIndex = e.detail.serviceIndex as number
      const service = e.detail.service as any
      this.updateServiceItem(categoryIndex, serviceIndex, () => service)
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
      const serviceCollapseStatus = this.data.serviceCollapseStatus.slice()
      const nextCategoryStatus = new Array<boolean>(items.length).fill(true)
      nextCategoryStatus[items.length - 1] = false
      serviceCollapseStatus[categoryIndex] = nextCategoryStatus
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
        serviceCollapseStatus,
      })
      this.quoteDetailUpdate()
    },

    onAddCategory() {
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      const newCategory: QuotePricingCategory = {
        name: "新建服务类型",
        items: [],
      }
      pricingItems.push(newCategory)
      const serviceCollapseStatus = this.data.serviceCollapseStatus.slice()
      serviceCollapseStatus.push([])
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
        serviceCollapseStatus,
      })
      this.quoteDetailUpdate()
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
      const current = !!categoryStatus[serviceIndex]
      for (let i = 0; i < categoryStatus.length; i++) {
        categoryStatus[i] = true
      }
      categoryStatus[serviceIndex] = !current
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

    quoteDetailUpdate() {
      const app = getApp<IAppOption>()
      const quoteDetail = this.data.quoteDetail
      const overallDeliveryPeriodDays = calculateOverallDeliveryPeriodDays(quoteDetail)
      const nextQuoteDetail: QuoteDetail = {
        ...quoteDetail,
        computeData: {
          ...quoteDetail.computeData,
          overallDeliveryPeriodDays,
        },
      }
      this.setData({
        quoteDetail: nextQuoteDetail,
      })
      app.globalData.quoteDetail = nextQuoteDetail
      this.triggerEvent("quoteDetailUpdate")
    },
  },
})
