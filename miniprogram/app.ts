// app.ts
// 小程序全局入口，负责初始化全局数据和生命周期
App<IAppOption>({
  globalData: {
    // 当前小程序使用的默认报价详情
    quoteDetail: {
      theme: "amber",
      clientName: "某不愿透露姓名甲方",
      overallDeliveryPeriodDays: 90,
      serviceTerms: "To be determined",
      domain: {
        name: "熬夜汽水设计工作室",
        logoUrl: "https://example.com/assets/logo.png",
      },
      PayNodes: [{
        nodeName: "定金",
        nodeRatio: 0.3,
      }, {
        nodeName: "尾款",
        nodeRatio: 0.7,
      }],
      pricingItems: [{
        name: "品牌设计",
        items: [
          { name: "标志(LOGO)设计", description: null, unit: "项", unitPrice: 600, quantity: 1, deliveryPeriodDays: 5 },
          { name: "品牌视觉识别(VI)设计", description: null, unit: "项", unitPrice: 4000, quantity: 1, deliveryPeriodDays: -1 },
        ]
      }, {
        name: "平面设计",
        items: [
          { name: "海报设计", description: null, unit: "张", unitPrice: 200, quantity: 5, deliveryPeriodDays: 2 },
          { name: "名片/会员卡设计", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
          { name: "DM/宣传单", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
          { name: "画册/手册/宣传册", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
          { name: "三折页", description: null, unit: "张", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
          { name: "展架/易拉宝设计", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
          { name: "主KV画面设计", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
          { name: "文化墙", description: null, unit: "平方米", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
        ],
      }],
    },
  },
  onLaunch() { },
})
