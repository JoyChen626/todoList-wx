// components/leftNav/leftnav.js
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: { type: Boolean },
    theme: { type: String },
    avatarUrl: { type: String },
    userName: { type: String }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userId: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 触摸开始事件
    touchStart: function (e) {
      time = 0;
      touchDotX = e.touches[0].pageX; // 获取触摸时的原点
      touchDotY = e.touches[0].pageY;
      // 使用js计时器记录时间    
      interval = setInterval(function () {
        time++;
      }, 100);
    },
    // 触摸结束事件
    touchEnd: function (e) {
      let touchMoveX = e.changedTouches[0].pageX;
      let touchMoveY = e.changedTouches[0].pageY;
      let tmX = touchMoveX - touchDotX;
      let tmY = touchMoveY - touchDotY;
      if (time < 20 && time > 0) {
        let absX = Math.abs(tmX);
        let absY = Math.abs(tmY);
        if (absX > 2 * absY) {
          if (tmX < 0) {
            this.setData({ show: false });
          }
        }
      }
      clearInterval(interval); // 清除setInterval
    },
    showColorPicker() {
      this.triggerEvent('show_color', true);
    },
    login_out() {
      wx.clearStorageSync();
      wx.redirectTo({
        url: '../login/login'
      })
    },
    // 上传图片
    doUpload: function () {
      var id = '';
      var userInfo = '';
      if (wx.getStorageSync('userInfo')) {
        userInfo = wx.getStorageSync('userInfo');
        this.setData({ userId: userInfo.userId });
        id = userInfo._id;
      }
      var _this = this;
      // 选择图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.showLoading({
            title: '上传中',
          })
          const filePath = res.tempFilePaths[0]
          // 上传图片
          var userId = _this.data.userId;
          const cloudPath = 'userPhoto/' + userId + '/' + userId + filePath.match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              var newPhoto = res.fileID;
              db.collection('user').doc(id).update({
                data: {
                  userPhoto: newPhoto,
                },
                success: result => {
                  wx.showToast({
                    title: '更新成功！',
                    icon: 'none',
                    duration: 3000
                  });
                  userInfo.userPhoto = newPhoto;
                  wx.setStorageSync('userInfo', userInfo);
                  _this.triggerEvent('change_photo', newPhoto);
                },
                fail: err => {
                  wx.showToast({
                    title: '操作失败！',
                    icon: 'none',
                    duration: 3000
                  });
                }
              })
              app.globalData.fileID = res.fileID;
              app.globalData.cloudPath = cloudPath;
              app.globalData.imagePath = filePath;
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        },
        fail: e => {
          console.error(e)
        }
      })
    }
  }
})
