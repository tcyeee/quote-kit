import { loginAndAuth } from './service/auth'
import { getQuoteAction } from './service/api'

App<IAppOption>({
  globalData: {
    uid: undefined,
    token: undefined,
    loginStatus: 'NONE',
    quoteDetail: appDefaultQuote() as QuoteDetail,
    quoteAnalyze: {} as QuoteAnalyze,
  },
  async onLaunch() {
    // 登录
    await loginAndAuth(this as IAppOption)
    // 获取统计信息
    this.globalData.quoteAnalyze = await getQuoteAction() as QuoteAnalyze
  },
})

function appDefaultQuote(): QuoteDetail {
  return {
    id: undefined,
    theme: "sky",
    projectName: "某公司UI设计项目",
    businessDiscountAmount: 500,
    deleteFlag: false,
    removeFlag: false,
    computeData: {
      expiresDays: 7,
    },
    domain: {
      name: "一家设计工作室",
      logoUrl: "https://example.com/assets/logo.png",
    },
    PayNodes: [{
      nodeName: "定金",
      nodeRatio: 0.3,
    }, {
      nodeName: "尾款",
      nodeRatio: 0.7,
    }],
    serviceTerms: "1.以上价格不包含第三方产生的额外费用\n2.服务内容变更需重新评估周期与成本。\n3.所有交付物在尾款支付完成后正式移交。",
    pricingItems: [{
      name: "品牌设计",
      items: [
        { name: "标志(LOGO)设计", description: null, unit: "个", unitPrice: 600, quantity: 1, deliveryPeriodDays: 5 },
        { name: "品牌视觉识别(VI)设计", description: null, unit: "项", unitPrice: 4000, quantity: 1, deliveryPeriodDays: -1 },
      ]
    }, {
      name: "平面设计",
      items: [
        { name: "海报设计", description: null, unit: "张", unitPrice: 200, quantity: 5, deliveryPeriodDays: 2 },
        { name: "名片/会员卡设计", description: null, unit: "张", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
        { name: "DM/宣传单", description: null, unit: "张", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
        { name: "画册/手册/宣传册", description: null, unit: "张", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
        { name: "文化墙", description: null, unit: "平方米", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
      ],
    }],
  }
}
