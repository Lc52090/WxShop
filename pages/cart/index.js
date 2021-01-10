// pages/cart/index.js
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  // 点击获取收货地址
  handlegetAddress() {
    // 获取权限状态
    wx.chooseAddress({
      success: (res) => {
        res.all = res.provinceName + res.cityName + res.countyName + res.detailInfo
        const address = res
        // 获取到的收货地址存入本地
        wx.setStorageSync('address', address)
      },
    })
  },

  // 商品的选中和取消
  handleItemChange(e) {
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let {
      cart
    } = this.data 
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 选中状态取反
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },

  // 全选和反选
  handleItemAllchange() {
    // 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data
    // 修改值
    allChecked = !allChecked
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked)
    this.setCart(cart)
  },
  // 商品数量++--
  handleItemedit(e) {
    const {
      operation,
      id
    } = e.currentTarget.dataset
    // 获取购物车数组
    let cart = this.data.cart
    // 找到需要修改商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      wx.showModal({
        title: '提示',
        cancelColor: '您是否要删除',
        success: res => {
          if (res.confirm) {
            // 确定删除
            cart.splice(index, 1)
            this.setCart(cart)
          } else if (res.cancel) {
            // 取消删除
          }
        }
      })
    }
    // 进行修改数量
    cart[index].num += operation
    this.setCart(cart)
  },
  // 点击结算功能
  handlePay() {
    // 判断收货地址
    let {
      totalNum,
      address
    } = this.data
    if (!address.userName) {
      wx.showToast({
        title: '您还没有填写收货地址',
      })
      return
    }
    // 判断是否有商品
    if (totalNum === 0) {
      wx.showToast({
        title: '您还没有选购商品',
      })
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  },
  // 设置购物车状态
  setCart(cart) {
    let allChecked = true
    //总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num
        totalNum += v.num
      } else {
        allChecked = false
      }
    });
    allChecked = cart.length !== 0 ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  },

  // 页面加载完毕 获取本地存储中的数据 把数据设置给data
  // 获取缓存中的数据
  // 全选的实现
  // 总价格和总数量
  /**
   * 获取购物车数组
   * 遍历
   * 判断是否被选中
   * 总价格+=商品单价*商品数量
   * 总数量+=商品数量
   * 把计算后的价格和数量 设置回data中即可
   */

  onShow: function () {
    const address = wx.getStorageSync('address')
    const cart = wx.getStorageSync('cart') || []
    // 计算全选
    //every数组方法,遍历,接受一个回调函数，如果每一个回调返回值为true那么every的返回值为true
    //只要有一个返回false，不再执行,直接返回fales
    //空数组调用every返回值true
    /* const allChecked = cart.length ? cart.every(v => v.checked) : false */
    this.setCart(cart)
    this.setData({
      address
    })
  },
  onLoad(options) {}
})