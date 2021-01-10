// pages/auth/index.js
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  login
} from '../../utils/asyncWx'
Page({
  data: {

  },
  async handlegetuserinfo(e) {
    try {
      // 获取信息
      const {
        encryptedData,
        errMsg,
        iv,
        rawData,
        signature
      } = e.detail
      // 获取小程序登录成功后的值
      const {
        code
      } = await login()
      const loginParams = {
        encryptedData,
        errMsg,
        iv,
        rawData,
        signature,
        code
      }
      // 发送请求获取token值
      // 获取临时token
      const grant_type = "client_credential"
      const appid = "wx2db2fbbe13228c0a"
      const secret = "4de269562582a1a6eed7c53785fec410"
      const tokenParams = {
        grant_type,
        appid,
        secret
      }
      wx.request({
        url: "https://api.weixin.qq.com/cgi-bin/token?",
        data: tokenParams,
        success: (res) => {
          console.log(res)
          wx.setStorageSync('token', res.data.access_token)
        }
      })
      // token 存储到缓存中同时跳转到上一页
      // wx.setStorageSync('token', access_token)
      wx.navigateBack({
        detail: 1
      })
    } catch (error) {
      console.log(error)
    }
  },
  onLoad: function (options) {

  }
})