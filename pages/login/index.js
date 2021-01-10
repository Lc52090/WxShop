// pages/login/index.js
Page({
  data: {

  },
  handleGetuserinfo(e) {
    const {
      userInfo
    } = e.detail
    wx.setStorageSync('userinfo', userInfo)
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {

  }
})