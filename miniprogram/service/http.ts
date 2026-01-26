const BASE_URL = "http://127.0.0.1:3000"

export function get<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASE_URL + url,
            method: 'GET',
            success: (result) => resolve(result.data as T),
            fail: reject,
        })
    })
}

export function post<T>(url: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASE_URL + url,
            method: 'POST',
            data,
            success: (result) => resolve(result.data as T),
            fail: reject,
        })
    })
}