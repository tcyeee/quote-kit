import { appDefaultQuote, getDefaultQuoteDetail } from './utils/cloud-database'
import { cloudInit, getUserId } from './utils/cloud-function'
import { pingBackend } from './service/api'

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

    await pingBackend().then((res) => {
      console.log('调用后端 ping 接口成功')
      console.log(res)
    }).catch((error) => {
      console.error('调用后端 ping 接口失败', error)
    })
  },
})
