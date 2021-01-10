// pages/cart/index.js
import {
  request
} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  requestPayment
} from '../../utils/asyncWx'
/**
 * 页面加载时，获取缓存中购物车数据，渲染到页面中
 */
// 微信支付
/**
 * 1 企业账号才可以实现微信支付
 * 2 企业账号的小程序后台中 必须给开发者 添加上白名单
 *   一个appid 可同时绑定多个开发者
 *   这些开发者可共用这个appid的权限
 * 需要步骤
 *  3 点击支付
 *    需要先获取用户token值，没有就跳转到授权页面获取token
 *    有 token.。。
 * 
 */
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  /**
   * 获取购物车数组
   * 遍历
   * 判断是否被选中
   * 总价格+=商品单价*商品数量
   * 总数量+=商品数量
   * 把计算后的价格和数量 设置回data中即可
   */

  // 支付(因为不是企业号，所以获取不到token值)
  async hanleOrderpay() {
    try {
      const token = wx.getStorageSync('token')
      if (!token) {
        // 没有token,跳转授权页面
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return
      }
      // 3 有token
      // 3.1 准备请求头参数
      /*  const header = {Authorization: token} */
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart
      let goods = []
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_numbder: v.num,
        goods_price: v.price
      }))
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      // 3.3准备发送请求，创建订单，获取订单编号
      const {
        order_number
      } = await request({
        url: "/my/orders/create",
        mehtod: "POST",
        data: orderParams
      })
      // 3.4发起 预支付接口
      const {
        pay
      } = await request({
        url: "my/orders/req_unifiedorder",
        mehtod: "POST",
        data: order_number
      })
      // 3.5微信支付
      await requestPayment(pay)
      // 3.6查询后台订单状态
      const res = await request({
        url: "/my/orders/chkOrder",
        mehtod: "POST",
        data: {
          order_number
        }
      })
      wx.showToast({
        title: '支付成功',
      })
      // 支付成功后删除缓存中已经购买的商品,再把删除后的数据重新填充到缓存中再跳转页面
      // 3.7 手动删除缓存中已经支付的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCatr)
    } catch (error) {
      wx.showToast({
        title: '支付失败',
      })
    }
  },
  onShow: function () {
    const address = wx.getStorageSync('address')
    let cart = wx.getStorageSync('cart') || []
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked === true)
    // 计算全选
    //every数组方法,遍历,接受一个回调函数，如果每一个回调返回值为true那么every的返回值为true
    //只要有一个返回false，不再执行,直接返回fales
    //空数组调用every返回值true
    /* const allChecked = cart.length ? cart.every(v => v.checked) : false */
    //总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num
      totalNum += v.num
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  onLoad(options) {}
})