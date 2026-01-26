import { appDefaultQuote, getDefaultQuoteDetail } from './utils/cloud-database'
import { cloudInit, getUserId } from './utils/cloud-function'

App<IAppOption>({
  globalData: {
    uid: undefined,
    quoteDetail: appDefaultQuote(),
  },
  async onLaunch() {
    await cloudInit()
    await getUserId()
    const quoteDetail = await getDefaultQuoteDetail()
    this.globalData.quoteDetail = quoteDetail as QuoteDetail
    try {
      await new Promise<WechatMiniprogram.RequestSuccessCallbackResult>((resolve, reject) => {
        wx.request({
          url: 'http://127.0.0.1:3000/ping',
          method: 'GET',
          success: resolve,
          fail: reject,
        })
      })
    } catch (error) {
      console.error('调用后端 ping 接口失败', error)
    }
  },
})
