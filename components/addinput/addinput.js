// components/addInput/addinput.js
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    theme:{type:String},
    avatarUrl:{type:String}
  },

  /**
   * 组件的初始数据
   */
  data: {
    addValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeValue(e) {
      var value = e.detail.value;
      this.setData({
        addValue: value
      });
    },
    creatThing() {
      var _this = this;
      if (this.data.addValue == ''){
        wx.showToast({
          title: '添加内容不能为空！',
          icon: 'none',
          duration: 3000
        });
        return false;
      }
      db.collection('todolist').add({
        data: {
          userId: wx.getStorageSync('userInfo').userId,
          thingName: this.data.addValue,
          status: 0,
          create_at: this.setTime()

        },
        success: res => {
          wx.showToast({
            title: '添加成功！',
            icon: 'none',
            duration: 3000
          });
          _this.triggerEvent('add', true);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '添加失败！'
          });
        }
      })
    },
    photoclick(){
      this.triggerEvent('photoclick', true);
    },
    setTime() {
      var myTime = new Date();
      var Y = myTime.getFullYear();
      var M = (myTime.getMonth() + 1) > 10 ? (myTime.getMonth() + 1) : '0' + (myTime.getMonth() + 1);
      var D = myTime.getDate() > 10 ? myTime.getDate() : '0' + (myTime.getDate());
      var h = myTime.getHours() > 10 ? myTime.getHours() : '0' + (myTime.getHours());
      var m = myTime.getMinutes() > 10 ? myTime.getMinutes() : '0' + (myTime.getMinutes());
      var s = myTime.getSeconds() > 10 ? myTime.getSeconds() : '0' + (myTime.getSeconds());
      return (Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s);
    }
  }
})