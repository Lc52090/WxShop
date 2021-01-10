/**
 * promise 形式的微信登录login
 */

export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

/**
 * promise 形式的微信支付 requestPayment
 * @param {object} pay 支付所必要参数
 */

export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}