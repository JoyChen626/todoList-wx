// components/list/list.js
const App = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lists: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    btnWidth: 0,
    windowWidth: 0,
    thingList: []
  },
  lifetimes: {
    attached: function() {
      var _this = this;
      App.watch(this, {
        lists: function(newVal) {
          _this.getInfo(newVal);
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getInfo(newVal) {
      var _this = this;
      var thingList = newVal;
      for (let i = 0; i < thingList.length; i++) {
        _this.createSelectorQuery().select(".list" + i + ' .box').boundingClientRect(res => {
          if (res.height > 0) {
            thingList[i].height = Number(res.height);
          }
        }).exec();
      }
      _this.setData({
        thingList: thingList
      })
      if (this.data.thingList.length > 0) {
        wx.getSystemInfo({
          success: function(res) {
            var width = Number(res.windowWidth);
            _this.createSelectorQuery().select('.scroll-right .btn').boundingClientRect(res => {
              if (res.width > 0) {
                var btnWidth = Number(res.width);
                _this.setData({
                  btnWidth: btnWidth,
                  windowWidth: width
                })
              }
            }).exec();
          }
        })
      }
    },
    showDetail(e) {
      var id = e.currentTarget.id;
      var thingList = this.data.thingList;
      for (var i in thingList) {
        if (id == thingList[i]._id) {
          if (thingList[i].scrollLeft !== 0) {
            thingList[i].scrollLeft = 0;
          } else {
            thingList[i].open = thingList[i].open == 0 ? 1 : 0;
          }
        } else {
          thingList[i].open = 0;
        }
      }
      this.setData({
        thingList: thingList
      })
    },
    scroll(e) {
      var id = e.currentTarget.id;
      var thingList = this.data.thingList;
      for (var i in thingList) {
        if (id == thingList[i]._id) {
          thingList[i].scrollLeft = e.detail.scrollLeft;
          if (thingList[i].open) {
            thingList[i].open = 0
          }
        } else {
          thingList[i].scrollLeft = 0;
        }
      }
      this.setData({
        thingList: thingList
      })
    },
    changeStatus(e) {
      var _this = this;
      var to_type = e.currentTarget.dataset.type;
      var id = e.currentTarget.id;
      var list = this.data.thingList;
      db.collection('todolist').doc(id).update({
        data: {
          status: to_type,
          todo_at: this.setTime(),
          setout_at: this.setTime()
        },
        success: res => {
          console.log(res)
          if (res.stats.updated == 1){
            wx.showToast({
              title: '更新成功！',
              icon: 'none',
              duration: 3000
            });
            _this.triggerEvent('change', true);
          } else{
            wx.showToast({
              title: '操作失败！',
              icon: 'none',
              duration: 3000
            });
          }
        },
        fail: err => {
          wx.showToast({
            title: '操作失败！',
            icon: 'none',
            duration: 3000
          });
        }
      })
    },
    deleteData(e) {
      var _this = this;
      var id = e.currentTarget.id;
      var list = this.data.thingList;
      db.collection('todolist').doc(id).remove({
        success: res => {
          wx.showToast({
            title: '删除成功！',
            icon: 'none',
            duration: 3000
          });
          _this.triggerEvent('remove', true);
        },
        fail: err => {
          wx.showToast({
            title: '操作失败！',
            icon: 'none',
            duration: 3000
          });
        }
      })
    },
    setTime() {
      var myTime = new Date();
      var Y = myTime.getFullYear();
      var M = (myTime.getMonth() + 1) >= 10 ? (myTime.getMonth() + 1) : '0' + (myTime.getMonth() + 1);
      var D = myTime.getDate() >= 10 ? myTime.getDate() : '0' + (myTime.getDate());
      var h = myTime.getHours() >= 10 ? myTime.getHours() : '0' + (myTime.getHours());
      var m = myTime.getMinutes() >= 10 ? myTime.getMinutes() : '0' + (myTime.getMinutes());
      var s = myTime.getSeconds() >= 10 ? myTime.getSeconds() : '0' + (myTime.getSeconds());
      return (Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s);
    }
  }
})