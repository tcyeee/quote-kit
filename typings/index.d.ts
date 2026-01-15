/// <reference path="./types/index.d.ts" />

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
