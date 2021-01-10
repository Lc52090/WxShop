import {
  request
} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    goods: [],
    isFocus:false
  },
  Timeid: -1,
  // 点击切换
  handleInput(e) {
    let {
      value
    } = e.detail
    // 检查合法性
    if (!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false,
        isValue:""
      })
      return
    }
    // 按钮显示
    this.setData({
      isFocus:true
    })
    // 防抖
    clearTimeout(this.Timeid)
    // 准备发送请求数据
    this.Timeid = setTimeout(() => {
      this.getSearchList(value)
    }, 1000)
  },
  // 准备发送请求获取数据
  /**
   * 防抖 定时器  节流
   * 防抖  一般输入框中防止重复输入 重复发送请求
   * 节流  一般做页面的下拉，上拉
   * 定义全局定时器
   * */
  async getSearchList(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query
      }
    })
    this.setData({
      goods: res
    })
  },
  // 点击按钮取消
  handleCancle(){
    this.setData({
      isValue:"",
      isFocus:false,
      goods:[]
    })
  }
})