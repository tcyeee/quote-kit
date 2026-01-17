import { calculateItemTotalAmountAndDeliveryPeriodDays, calculateOverallDeliveryPeriodDays } from '../../../utils/quote-utils'

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
    // 编辑面板各大区块的折叠状态
    CollapseStatus: {
      theme: false,
      client: false,
      company: false,
      service: false,
      payment: false,
      remark: false,
    } as CollapseStatus,
  },
  lifetimes: {
    async attached() {
      var quoteDetail = getApp<IAppOption>().globalData.quoteDetail
      // 计算项目周期
      await calculateOverallDeliveryPeriodDays(quoteDetail)
      // 计算每个服务项的金额
      await calculateItemTotalAmountAndDeliveryPeriodDays(quoteDetail.pricingItems)
      this.setData({ quoteDetail })
    },
  },
  methods: {

    // 跳转到分析页
    onAnalyseTap() {
      wx.navigateTo({ url: "/pages/analyse/analyse" })
    },

    // 合并并更新 quoteDetail 的部分字段
    updateQuoteDetail(partial: Partial<QuoteDetail>) {
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          ...partial,
        },
      })
    },

    // 打开确认分享弹窗
    toggleConfirmDialog() {
      this.triggerEvent("toggleConfirmDialog", true)
    },

    // 计算拖拽浮层的位置（预留，当前返回默认值）
    calculateDragOverlayTop() {
      return {
        top: 0,
        itemHeight: 0,
      }
    },

    // 切换主题
    onThemeTap(e: any) {
      const theme = e.currentTarget.dataset.theme as string
      this.updateQuoteDetail({ theme })
      this.quoteDetailUpdate()
    },

    // 输入客户名称时更新数据
    onClientNameInput(e: any) {
      const clientName = e.detail.value as string
      this.updateQuoteDetail({ clientName })
    },

    // 客户名称输入完成后重新计算报价
    onClientNameBlur() {
      this.quoteDetailUpdate()
    },

    // 输入公司名称时更新数据
    onDomainNameInput(e: any) {
      const name = e.detail.value as string
      this.updateQuoteDetail({
        domain: {
          ...this.data.quoteDetail.domain,
          name,
        },
      } as any)
    },

    // 公司名称输入完成后重新计算报价
    onDomainNameBlur() {
      this.quoteDetailUpdate()
    },

    // 支付节点内容变更时更新数据
    onPayNodesChange(e: any) {
      const PayNodes = e.detail.payNodes as QuotePayNode[]
      this.updateQuoteDetail({ PayNodes })
    },

    // 支付节点编辑完成后重新计算报价
    onPayNodesBlur() {
      this.quoteDetailUpdate()
    },

    // 服务条款输入完成后重新计算报价
    onServiceTermsBlur() {
      this.quoteDetailUpdate()
    },

    // 接收子组件更新后的 pricingItems
    onUpdatePricingItems(e: any) {
      const pricingItems = e.detail.pricingItems as QuotePricingCategory[]
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
      this.quoteDetailUpdate()
    },

    // 服务条目内容变更时更新对应条目
    onServiceChange(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const serviceIndex = e.detail.serviceIndex as number
      const service = e.detail.service as any
      this.updateServiceItem(categoryIndex, serviceIndex, () => service)
    },

    // 更新指定分类下的单个服务条目
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

    // 在指定分类下新增服务条目
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
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
      this.quoteDetailUpdate()
    },

    // 新增一个服务分类
    onAddCategory() {
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      const newCategory: QuotePricingCategory = {
        name: "新建服务类型",
        items: [],
      }
      pricingItems.push(newCategory)
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
      this.quoteDetailUpdate()
    },

    // 服务表单失焦时触发重新计算
    onServiceFieldBlur() {
      this.quoteDetailUpdate()
    },

    // 折叠或展开编辑面板的某个大区块
    onToggleSection(e: any) {
      const section = e.currentTarget.dataset.section as keyof CollapseStatus
      const CollapseStatus = this.data.CollapseStatus
      this.setData({
        CollapseStatus: { ...CollapseStatus, [section]: !CollapseStatus[section] },
      })
    },

    // 删除某个服务条目
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
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
      this.quoteDetailUpdate()
    },

    // 删除某个服务分类
    onDeleteCategory(e: any) {
      const categoryIndex = e.detail.categoryIndex as number
      const pricingItems = (this.data.quoteDetail.pricingItems || []).slice()
      if (!pricingItems[categoryIndex]) return
      pricingItems.splice(categoryIndex, 1)
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          pricingItems,
        },
      })
      this.quoteDetailUpdate()
    },

    // 重新计算 quoteDetail 的衍生数据并同步到全局
    quoteDetailUpdate() {
      const app = getApp<IAppOption>()
      const quoteDetail = this.data.quoteDetail
      // 计算项目周期
      calculateOverallDeliveryPeriodDays(quoteDetail)
      // 计算每个服务项的金额
      calculateItemTotalAmountAndDeliveryPeriodDays(quoteDetail.pricingItems)
      this.setData({ quoteDetail: { ...quoteDetail } })
      app.globalData.quoteDetail = quoteDetail
      this.triggerEvent("quoteDetailUpdate")
    },
  },
})
