//app.js
App({
  globalData: {
    userInfo: {},
    isIPX: false
  },
  onLaunch: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var model = res.model;
        var ipxFlag = false;
        if (model.indexOf('iPhone X') >= 0) {
          ipxFlag = true;
        } else {
          ipxFlag = false;
        }
        that.globalData.isIPX = ipxFlag;
      },
    })

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }
  },
  // 设置监听器
  watch: function (ctx, obj) {
    Object.keys(obj).forEach(key => {
      this.observer(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  },
  // 监听属性，并执行监听函数
  observer: function (data, key, val, fn) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return val
      },
      set: function (newVal) {
        if (newVal === val) return
        fn && fn(newVal)
        val = newVal
      },
    })
  }
})
