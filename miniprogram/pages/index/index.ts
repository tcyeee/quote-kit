// 获取带有自定义全局数据类型的 App 实例
const app = getApp<IAppOption>()

// 首页报价预览页面
Page({
  data: {
    // 页面展示相关的配置项
    options: {
      bottomDialogCollapsedHeight: 20,
      bottomDialogExpandedHeight: 85,
    },
    // 当前报价对应的客户信息，将在 onLoad 中从全局数据填充
    client: {
      name: "",
      logoUrl: "",
    },
    // 报价条目列表，初始为空，onLoad 时从全局数据填充
    pricingItems: [] as QuotePricingCategory[],
    // 支付流程信息，onLoad 时从全局数据填充
    serviceProcess: {
      depositRatio: 0,
      finalPaymentRatio: 0,
    },
    // 总体交付周期（天），onLoad 时从全局数据填充
    overallDeliveryPeriodDays: 0,
    // 服务条款说明，onLoad 时从全局数据填充
    serviceTerms: "",
    // 底部弹窗当前是否处于展开状态
    bottomDialogExpanded: false,
  },

  // 页面加载时，从全局 quoteDetail 中读取数据并设置到页面
  onLoad() {
    const {
      client,
      pricingItems,
      serviceProcess,
      overallDeliveryPeriodDays,
      serviceTerms,
    } = app.globalData.quoteDetail

    this.setData({
      client,
      pricingItems,
      serviceProcess,
      overallDeliveryPeriodDays,
      serviceTerms,
    })
  },

  // 切换底部弹窗的展开 / 收起状态
  toggleBottomDialog() {
    this.setData({
      bottomDialogExpanded: !this.data.bottomDialogExpanded,
    })
  },
})
