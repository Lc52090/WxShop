// pages/goods_detail/index.js
import {
  request
} from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    goodsObj: [],
    isCollect: false
  },
  // 商品收藏
  /**
   * 页面onshow时加载缓存中商品收藏的数据
   * 判断当前页面是否被收藏
   * 是 改变页面图标
   * 不是 ···
   * 点击商品收藏按钮
   *  判断该商品是否存在于缓存数组中
   *  已经存在 删除商品
   *  不存在 把商品添加到缓存数组中，存入到缓存中即可
   */
  // 商品点击事件
  handleCollect(){
    let isCollect = false
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect')||[]
    // 判断是否被收藏过
    let index =collect.findIndex(v=>v.goods_id===this.goodsinfo.goods_id)
    // 当index！==-1 已经收藏过
    if (index!==-1) {
      collect.splice(index,1)
      isCollect = false
      wx.showToast({
        title: '取消成功',
      })
    }else{
      collect.push(this.goodsinfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
      })
    }
    // 把数组存到缓存中
    wx.setStorageSync('collect', collect)
    // 修改data中的属性
    this.setData({
      isCollect
    })
  },
  // 商品对象
  goodsinfo: {},
  onShow() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1]
    let options = currentPage.options
    const goods_id = options.goods_id
    this.getGoodsDetail(goods_id)
  },
  // 获取数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })
    // 商品对象
    this.goodsinfo = goodsObj
    // 获取缓存中获取收藏的数组
    let collect = wx.getStorageSync('collect') || []
    // 判断当前数组是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.goodsinfo.goods_id)

    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphoe 部分手机不识别webp图片格式
        // 临时自己改 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },

  // 点击轮播图放大预览
  handleImg(e) {
    const urls = this.goodsinfo.pics.map(v => v.pics_mid)
    console.log(urls)
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    })
  },

  /**
   * 点击加入购物车
   * 获取缓存中购物车数据
   * 判断当前商品是否已经加入购物车
   * 已存在 修改商品数据 购物车数量++ 重新把购物车数组 填充回缓存中
   * 不存在 直接给购物车数组添加一个新元素 带上购买数量属性 num
   */
  // 加入购物车
  handleAddShopcar() {
    // 获取缓存中购物车 数组
    let cart = wx.getStorageSync("cart") || []
    // 判断商品是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.goodsinfo.goods_id)
    if (index === -1) {
      // 不存在 第一次添加
      this.goodsinfo.num = 1
      this.goodsinfo.checked = true
      cart.push(this.goodsinfo)
    } else {
      //已经存在
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户手抖一直点击
      mask: true
    })
  }
})