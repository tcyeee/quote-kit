/// <reference path="./types/index.d.ts" />

interface QuoteServiceItem {
  name: string,
  description: string | null,
  unit: string,
  unitPrice: number,
  quantity: number,
  deliveryPeriodDays: number,
}

interface QuotePricingCategory {
  name: string,
  items: QuoteServiceItem[],
}

interface QuoteServiceProcess {
  depositRatio: number,
  finalPaymentRatio: number,
}

interface QuoteDetail {
  pricingItems: QuotePricingCategory[],
  serviceProcess: QuoteServiceProcess,
  overallDeliveryPeriodDays: number,
  serviceTerms: string,
}

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    quoteDetail: QuoteDetail,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}
