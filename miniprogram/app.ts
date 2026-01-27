import { appDefaultQuote } from './utils/cloud-database'
import { loginAndAuth } from './service/auth'
import { getQuoteAction } from './service/api'

App<IAppOption>({
  globalData: {
    uid: undefined,
    token: undefined,
    loginStatus: 'NONE',
    quoteDetail: appDefaultQuote(),
    quoteAnalyze: {} as QuoteAnalyze,
  },
  async onLaunch() {
    // 登录
    await loginAndAuth(this as IAppOption)
    // 获取统计信息
    this.globalData.quoteAnalyze = await getQuoteAction()
  },
})
