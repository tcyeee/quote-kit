const BASE_URL = "http://127.0.0.1:3000"

export function get<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASE_URL + url,
            method: 'GET',
            header: {
                'Authorization': 'Bearer ' + getApp<IAppOption>().globalData.token || '',
            },
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
            header: {
                'Authorization': 'Bearer ' + getApp<IAppOption>().globalData.token || '',
            },
            data,
            success: (result) => resolve(result.data as T),
            fail: reject,
        })
    })
}

export function del<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASE_URL + url,
            method: 'DELETE',
            header: {
                'Authorization': 'Bearer ' + getApp<IAppOption>().globalData.token || '',
            },
            success: (result) => resolve(result.data as T),
            fail: reject,
        })
    })
}

export function put<T>(url: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASE_URL + url,
            method: 'PUT',
            header: {
                'Authorization': 'Bearer ' + getApp<IAppOption>().globalData.token || '',
            },
            data,
            success: (result) => resolve(result.data as T),
            fail: reject,
        })
    })
}
