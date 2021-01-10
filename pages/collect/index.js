// pages/collect/index.js
Page({
  data: {
    tabs: [{
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览器足迹",
        isActive: false
      }
    ],
  },
  collect:[],
  // 点击切换
  tabsItemChange(e) {
    const {
      index
    } = e.detail
    const tabs = this.data.tabs
    tabs.forEach((v, i) => index === i ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  onShow(){
    let collect = wx.getStorageSync('collect')
    this.setData({
      collect
    })
  }
})