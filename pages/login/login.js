// miniprogram/pages/login/login.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    password: '',
    loginType: 0,
    userInfo: '',
    avatarUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setId()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (e) {
    console.log(2)
    if (e.detail.userInfo) {
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      });
      if (e.currentTarget.dataset.type == 'login') {
        this.login();
      } else {
        this.weiChatLogin();
      }
    }
  },
  getInputVal(e) {
    if (e.target.dataset.type == 'username') {
      this.setData({ userName: e.detail.value })
    } else {
      this.setData({ password: e.detail.value })
    }
  },
  changeType() {
    var newType = this.data.loginType === 0 ? 1 : 0;
    this.setData({ loginType: newType });
  },
  login() {
    if (this.data.userName === '') {
      wx.showToast({ title: '用户名不能为空！', icon: 'none' });
      return false;
    } else if (this.data.password === '') {
      wx.showToast({ title: '密码不能为空！', icon: 'none' });
      return false;
    }
    if (this.data.loginType === 0) {
      this.onLogin();
    } else {
      this.onAdd();
    }
  },
  onAdd() {
    var userId = this.setId();
    db.collection('user').where({
      userName: this.data.userName
    }).get().then(result => {
      if (result.data.length > 0) {
        wx.showToast({ title: '[新增失败]此用户已存在', icon: 'none' })
      } else {
        db.collection('user').add({
          data: {
            userId: userId,
            userName: this.data.userName,
            password: this.data.password,
            userPhoto: this.data.avatarUrl
          },
          success: res => {
            wx.showToast({ title: '注册成功,3秒后自动跳转到首页！', icon: 'none', duration: 3000 });
            setTimeout(() => {
              wx.setStorageSync('loginFlag', 1);
              var ress = {};
              ress._id = res._id;
              ress.userName = this.data.userName;
              ress.userId = userId;
              ress.userPhoto = this.data.avatarUrl;
              ress.color = "#000000";
              wx.setStorageSync('userInfo', ress);
              wx.navigateTo({
                url: '../index/index',
              });
            }, 3000);
          },
          fail: err => {
            wx.showToast({ icon: 'none', title: '注册失败' });
          }
        })
      }
    })
  },
  onLogin() {
    db.collection('user').where({
      userName: this.data.userName
    }).get().then(result => {
      if (result.data.length > 0) {
        if (result.data[0].password == this.data.password) {
          wx.setStorageSync('loginFlag', 1);
          var res = {};
          res._id = result.data[0]._id;
          res.userName = result.data[0].userName;
          res.userId = result.data[0].userId;
          res.userPhoto = result.data[0].userPhoto;
          res.color = result.data[0].color;
          wx.setStorageSync('userInfo', res);
          wx.navigateTo({
            url: '../index/index',
          });
        } else {
          wx.showToast({ title: '密码错误！', icon: 'none' })
        }
      } else {
        wx.showToast({ title: '[新增失败]此用户不存在', icon: 'none' })
      }
    })
  },
  weiChatLogin() {
    var _this = this;
    // 获取用户信息
    wx.getSetting({
      success: res1 => {
        if (res1.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res2 => {
              _this.setData({
                userInfo: res2.userInfo
              });
              db.collection('user').where({
                userName: res2.userInfo.nickName
              }).get().then(result => {
                if (result.data.length > 0) {
                  wx.showToast({ title: '登录成功，3秒后自动跳转到首页！', icon: 'none', duration: 3000 });
                  setTimeout(() => {
                    wx.setStorageSync('loginFlag', 1);
                    var res = {};
                    res._id = result.data[0]._id;
                    res.userName = result.data[0].userName;
                    res.userId = result.data[0].userId;
                    res.userPhoto = result.data[0].userPhoto;
                    res.color = result.data[0].color;
                    wx.setStorageSync('userInfo', res);
                    wx.navigateTo({
                      url: '../index/index',
                    });
                  }, 3000);
                } else {
                  db.collection('user').add({
                    data: {
                      userId: _this.setId(),
                      userName: res2.userInfo.nickName,
                      password: '123456',
                      userPhoto: res2.userInfo.avatarUrl
                    },
                    success: res3 => {
                      console.log(res3);
                      setTimeout(() => {
                        wx.setStorageSync('loginFlag', 1);
                        var ress = {};
                        ress._id = res3._id;
                        ress.userName = res2.userInfo.nickName;
                        ress.userId = _this.setId();
                        ress.userPhoto = res2.userInfo.avatarUrl;
                        ress.color = '#000000';
                        wx.setStorageSync('userInfo', ress);
                        wx.navigateTo({
                          url: '../index/index',
                        });
                      }, 3000);
                      wx.showToast({ title: '已为您自动注册，初始密码为123456，3秒后自动跳转到首页，登录后请修改密码！', icon: 'none', duration: 3000 });
                    },
                    fail: (error) => {
                      console.log(error)
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  setId() {
    var guid = "";
    var val1 = (((1 + Math.random()) * 0x10000) | 0);
    var val2 = (((2 + Math.random()) * 0x10000) | 0);
    guid = '' + val1 + val2;
    return guid;
  },
})