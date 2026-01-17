const CLOUD_ENV = 'cloud1-0gyo5sli9601b011'

export async function cloudInit() {
    wx.cloud.init({ env: CLOUD_ENV, traceUser: true })
}

declare type GetOpenIdResult = { openid: string }

export async function getUserId() {
    const result = await wx.cloud.callFunction({ name: 'getopenid' })
    const data = result.result as GetOpenIdResult | undefined
    const app = getApp<IAppOption>()
    app.globalData.uid = data?.openid
}
