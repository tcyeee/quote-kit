import { appDefaultQuote } from './utils/cloud-database'
import { loginAndAuth } from './service/auth'

App<IAppOption>({
  globalData: {
    uid: undefined,
    quoteDetail: appDefaultQuote(),
    loginStatus: 'NONE',
  },
  async onLaunch() {
    await loginAndAuth(this as IAppOption)
  },
})
