import {
  request
} from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    catesList: [],
    floorList: []
  },
  // 获取轮播图数据
  async getSwiperList() {
    const res = await request({
      url: '/home/swiperdata'
    })
    this.setData({
      swiperList: res
    })

  },
  // 获取导航数据
  async getCateList() {
    const res = await request({
      url: '/home/catitems'
    })
    this.setData({
      catesList: res
    })
  },
  // 获取楼层数据
  async getFloorList() {
    const res = await request({
      url: '/home/floordata'
    })
    for (let k = 0; k < res.length; k++) {
      res[k].product_list.forEach((v, i) => {
        res[k].product_list[i].navigator_url = v.navigator_url.replace('?query', '/index?cid=' + (i + 4))
      })
    }
    console.log(res)
    this.setData({
      floorList: res
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
})