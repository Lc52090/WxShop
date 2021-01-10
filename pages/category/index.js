// pages/category/index.js
import {
  request
} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    cates: [],
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightCotent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 获取分类页面数据
  async getCategoryList() {
    const res = await request({ url: '/categories' })
    this.cates = res
    // 把接口的数据存到本地存储中
    wx.setStorageSync('cates', { time: Date.now(), data: this.cates })
    let leftMenuList = this.cates.map(v => v.cat_name)
    let rightCotent = this.cates[0].children
    this.setData({
      leftMenuList: leftMenuList,
      rightCotent: rightCotent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    /**1.获取被点击标题的索引
     * 2.给 data中的curreindex赋值
     * 3.根据不同的索引渲染内容
     */
    const { index } = e.currentTarget.dataset
    let rightCotent = this.cates[index].children
    console.log(rightCotent)
    this.setData({
      currentIndex: index,
      rightCotent: rightCotent,
      // 重新设置右侧内容距离顶部的距离
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 判断本地存储中是否有旧的数据
     * { time:Date.now(),data:[...]}
     * 没有旧数据直接发送请求
     * 有旧数据同时 旧数据没有过期 就是用本地存储中的旧数据
     */
    // 1 获取本地存储的数据
    const cates = wx.getStorageSync('cates')
    // 2 判断
    if (!cates) {
      // 不存在 发送请求获取数据
      this.getCategoryList()
    } else {
      // 有旧数据 定义过期时间
      if (Date.now() - cates.time > 1000 * 60 * 4) {
        //重新发送请求
        this.getCategoryList()
      } else {
        // 可以使用旧数据
        this.cates = cates.data
        let leftMenuList = this.cates.map(v => v.cat_name)
        let rightCotent = this.cates[0].children
        this.setData({
          leftMenuList: leftMenuList,
          rightCotent: rightCotent
        })
      }
    }
  }
})