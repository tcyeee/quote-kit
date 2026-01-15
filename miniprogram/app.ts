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
  },
})
