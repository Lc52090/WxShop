Page({
  data: {
    tabs: [{
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品，商家投诉",
        isActive: false
      }
    ],
    // 被选中图片路径数组
    chooseimgs: [],
    // 文本域内容
    textVal: ""
  },

  // 外网图片的数组
  uploadImg: [],
  // 导航切换
  tabsItemChange(e) {
    const {
      index
    } = e.detail
    const {
      tabs
    } = this.data
    tabs.forEach((v, i) => index === i ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 点击 "+"号出发tap事件
  /**
   * 调用小程序内置api
   * 获取图片路径 存数组
   * 图片路径 存到data中
   * 页面根据图片路径循环显示 自定义组件
   */
  handleChooseImg() {
    // 小程序内置选择图片API
    wx.chooseImage({
      // 同时选中图片数量
      count: 9,
      // 图片格式 原图  压缩
      sizeType: ['original', 'compressed'],
      // 图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          chooseimgs: [...this.data.chooseimgs, ...res.tempFilePaths]
        })
      }
    })
  },
  // 点击自定义图片
  handleRemove(e) {
    // 获取被点击图片的索引
    const {
      index
    } = e.currentTarget
    // 获取原图片数组
    const {
      chooseimgs
    } = this.data
    chooseimgs.splice(index, 1)
    this.setData({
      chooseimgs
    })
  },
  // 提交意见
  /**
   * 获取文本域的内容 对内容进行合法性验证
   * 验证通过 用户选择的图片上传到专门的图片服务器 返回图片外网的链接
   * 文本域 和外网的图片路径一起提交到服务器 (前端模拟，不会发送请求到后台)
   * 清空当前页面
   * 返回上一页
   */
  // 文本域的输入事件
  handleTextinput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮点击事件
  handleSubmit() {
    const {
      textVal,
      chooseimgs
    } = this.data
    // 合法性验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入内容不能为空',
        icon: "none",
        mask: true
      })
      return
    }

    // 如果有图片
    if (chooseimgs.length !== 0) {
      // 上传图片到专门图片服务器
      // 不支持多个文件上传 遍历数组挨个上传
      chooseimgs.forEach((v, i) => {
        wx.uploadFile({
          // 被上传的文件路径
          filePath: v,
          // 上传的文件名称
          name: 'myPhoto',
          // 图片上传到哪里
          url: 'http://my.zol.com.cn/index.php?c=Ajax_User&a=uploadImg',
          success: (res) => {
            let url = res.data.url
            console.log(url)
            this.uploadImg.push(url)
            // 所有图片上传完毕后
            if (i === chooseimgs.length - 1) {
              this.setData({
                textVal: "",
                chooseimgs: []
              })
            }
            wx.navigateBack({
              delta: 1
            })
          }
        })
      })
    } else {
      // 只是提交文本 没有图片
      wx.hideLoading()
      wx.navigateBack({
        delta: 1
      })
    }
  }

})