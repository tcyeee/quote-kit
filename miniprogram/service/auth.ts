import { login } from "./api"

export const loginAndAuth = async (app: IAppOption) => {
    app.globalData.loginStatus = 'LOADING'

    const code = await wxLogin()
    const res = await login(code).catch((err) => {
        app.globalData.loginStatus = 'FAILED'
        throw err
    })

    app.globalData.uid = res.openid
    app.globalData.token = res.token
    app.globalData.loginStatus = 'SUCCESS'
    console.log("USER初始化成功..:", app.globalData.uid);
    return res
}

function wxLogin(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        wx.login({
            success: (wxRes) => resolve(wxRes.code),
            fail: (err) => reject(err)
        })
    })
}
