import { calculateItemTotalAmountAndDeliveryPeriodDays, calculateOverallDeliveryPeriodDays } from '../../../utils/quote-utils'

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    quoteDetail: {} as QuoteDetail,
    currentTab: 'basic',
  },
  lifetimes: {
    async attached() {
      // 设置 quoteDetail 数据
      const app = getApp<IAppOption>()
      this.setData({ quoteDetail: app.globalData.quoteDetail })
      // 页面计算
      this.quoteDetailUpdate(false)
    },
  },
  methods: {

    // 跳转到分析页
    onAnalyseTap() {
      wx.navigateTo({ url: "/pages/analyse/analyse" })
    },

    onConfigTabChange(e: any) {
      const key = e && e.detail ? (e.detail.key as string) : ''
      const currentTab = key === 'service' || key === 'payment' || key === 'remark' ? key : 'basic'
      this.setData({ currentTab })
      this.triggerEvent("toggleConfirmDialog", false)
    },

    onBasicConfigUpdate(e: any) {
      const detail = (e && e.detail) || {}
      this.updateQuoteDetail(detail as Partial<QuoteDetail>)
      this.quoteDetailUpdate()
    },

    onServiceConfigUpdate(e: any) {
      const detail = (e && e.detail) || {}
      this.updateQuoteDetail(detail as Partial<QuoteDetail>)
      this.quoteDetailUpdate()
    },

    onPaymentConfigUpdate(e: any) {
      const detail = (e && e.detail) || {}
      this.updateQuoteDetail(detail as Partial<QuoteDetail>)
      this.quoteDetailUpdate()
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

    // 重新计算 quoteDetail 的衍生数据并同步到全局
    quoteDetailUpdate(showToast: boolean = true) {
      const app = getApp<IAppOption>()
      const quoteDetail = this.data.quoteDetail
      // 计算项目周期
      calculateOverallDeliveryPeriodDays(quoteDetail)
      // 计算每个服务项的金额
      calculateItemTotalAmountAndDeliveryPeriodDays(quoteDetail.pricingItems)
      this.setData({ quoteDetail: { ...quoteDetail } })
      app.globalData.quoteDetail = quoteDetail
      if (showToast) this.triggerEvent("quoteDetailUpdate")
    },
  },
})
