// pages/order/index.js
import {
  request
} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    tabs: [{
        id: 0,
        value: "全部订单",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
    orders: []
  },
  onShow: function () {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return
    }
    // 获取当前小程序页面栈-数组，长度最大是10页面
    let pages = getCurrentPages();
    // 索引最大的页面就是当前页面
    let currentPages = pages[pages.length - 1]
    const {
      type
    } = currentPages.options
    this.handleChangeIndex(type - 1)
    this.getOrders(type)
  },
  // 获取订单列表方法
  async getOrders(type) {
    const res = await request({
      url: "/my/orders/all",
      data: {
        type
      }
    })
    console.log(res)
  },
  // tab导航栏切换
  handleChangeIndex(index) {
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => index === i ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  tabsItemChange(e) {
    const {
      index
    } = e.detail
    this.handleChangeIndex(index)
  }
})