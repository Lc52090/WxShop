// components/tabs/tabs.js
Component({
  properties: {
    tabs: {
      type: Array,
      value: ""
    }
  },
  data: {

  },
  methods: {
    handleItemTap(e) {
      const {index} = e.currentTarget.dataset
      //2 触发父组件的事件 自定义
      this.triggerEvent("tabsItemChange",{index})
    },
  }
})