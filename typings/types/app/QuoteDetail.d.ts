interface QuoteDetail {
    // 项目名称
    projectName: string,
    // 我的公司信息
    domain: QuoteDomain,
    // 报价条目列表
    pricingItems: QuotePricingCategory[],
    // 支付节点
    PayNodes: QuotePayNode[],
    // 服务条款说明
    serviceTerms?: string,
    // 主题
    theme: string,
    // 最终折扣
    businessDiscountAmount?: number,
    /* 分享属性 */
    shareDate?: QuoteShareInfo,
    /* 计算属性 */
    computeData?: QuoteComputeData,
}

interface QuoteShareInfo {
    // 链接创建时间
    createdAt?: Date,
    // 链接过期时间
    expiresAt?: Date,
    // 手动下架
    isManuallyOfflined?: boolean,
}
interface QuoteComputeData {
    // 链接有效期（天）
    expiresDays?: number,
    // 项目总金额
    totalAmount?: number,
    // 整体预计工期（天）
    overallDeliveryPeriodDays?: number,
    // 分享状态
    shareStatus?: ShareStatus,
}

type ShareStatus = "normal" | "offlined" | "expired"

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

interface QuoteServiceItemComputeData {
    // 项目总金额
    amount?: number,
    // 预计工期（天）
    deliveryPeriodDays?: number,
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
    // 计算数据
    computeData?: QuoteServiceItemComputeData,
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
