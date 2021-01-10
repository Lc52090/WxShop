// pages/goods_list/index.js
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  request
} from '../../request/index'
Page({
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodList: []
  },
  
  // 接口要的参数
  queryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid = options.cid || ""
    this.queryParams.query = options.query || ""
    this.getGoodsList()
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.queryParams
    })
    const total = res.total
    this.totalPages = Math.ceil(total / this.queryParams.pagesize)
    this.setData({
      goodList: [...this.data.goodList, ...res.goods]
    })
    // 关闭下拉刷新窗口
    wx.stopPullDownRefresh()
  },

  // tab点击切换
  handletabsItemChange(e) {
    // 获取被点击的标题索引
    const {
      index
    } = e.detail
    // 修改原数组
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值到data
    this.setData({
      tabs
    })
  },

  // 滚动条触底事件
  /**
   * 1.上滑页面 滚动条触底 开始加载下一页数据
   *  1）找到滚动条触底事件 微信小程序官方文档中有
   *  2）判断还有没有下一页数据
   *    1>获取到 总页数 总页数=Math.ceil(总条数/每页容量)
   *    2>获取到当前页码 pagenum
   *    3>判断当前的页码是否大于等于总页数
   *   3）假如没有下一页数据 弹出触底提示
   *   4）假如有下一页数据 加载下一页数据
   *    1>当前页码++
   *    2>重新发送请求 
   *    3>数据请求后对data中的数组进行拼接
   */
  onReachBottom() {
    // 判断是否还有下一页数据
    if (this.queryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '已经到底了'
      });
    } else {
      //有下一页数据
      this.queryParams.pagenum++
      this.getGoodsList()
    }
  },

  // 下拉刷新页面
  /* 
   2.下拉刷新页面
   *  1）触发下拉刷新事件 需要在页面的JSON文件中开启一个配置
   *  2）充值数据数组
   *  3）重置页码为1 
   *  4）重新发送请求
   *  5）数据请求回来手动关闭等待效果
  */
 onPullDownRefresh(){
   // 重置数组
   this.setData({
     goodList:[]
   })
   this.queryParams.pagenum = 1
   this.getGoodsList()
 }

})
