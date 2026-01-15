/// <reference path="./types/index.d.ts" />

/**
 * 单个服务条目的报价信息
 * 对应一行可计价的服务内容
 */
interface QuoteServiceItem {
  // 服务名称，例如“海报设计”
  name: string,
  // 额外描述，为 null 时表示暂无补充说明
  description: string | null,
  // 计价单位，例如“张”“项”
  unit: string,
  // 单价
  unitPrice: number,
  // 数量
  quantity: number,
  // 交付周期（天），为负数时可表示“待定”
  deliveryPeriodDays: number,
}

/**
 * 报价中的服务类别
 * 例如“品牌设计”“平面设计”等
 */
interface QuotePricingCategory {
  // 类别名称
  name: string,
  // 该类别下的具体服务条目列表
  items: QuoteServiceItem[],
}

/**
 * 报价对应的客户信息
 */
interface QuoteDomain {
  // 客户名称或公司名称
  name: string,
  // 客户 Logo 的图片地址
  logoUrl: string,
}

/**
 * 服务款项的支付流程信息
 */
interface QuotePayNode {
  // 节点名称
  nodeName: string,
  // 节点支付比例，例如 0.7 表示 70%
  nodeRatio: number,
  // 节点时间（可选），例如“2025-01-01”或“5月中旬”
  nodeDate?: string,
}

/**
 * 一份完整的报价详情结构
 * 包含客户信息、各项服务报价和服务条款等
 */
interface QuoteDetail {
  // 客户名称
  clientName: string,
  // 我的公司信息
  domain: QuoteDomain,
  // 报价条目列表
  pricingItems: QuotePricingCategory[],
  // 支付节点
  PayNodes: QuotePayNode[],
  // 总体交付周期（天）
  overallDeliveryPeriodDays: number,
  // 服务条款说明
  serviceTerms: string,
  theme: string,
}

/**
 * 小程序全局 App 实例的自定义扩展类型
 * 用于通过 getApp<IAppOption>() 获取带类型的 globalData
 */
interface IAppOption {
  globalData: {
    // 全局用户 ID
    uid?: string,
    // 微信用户信息，可选
    userInfo?: WechatMiniprogram.UserInfo,
    // 当前展示的报价详情
    quoteDetail: QuoteDetail,
  }
  // 获取用户信息成功后的回调
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}
