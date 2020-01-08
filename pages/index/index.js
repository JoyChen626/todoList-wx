//index.js
const app = getApp();
const db = wx.cloud.database();
//import { onAdd } from '../../utils/api/sql_db/sql_db.js';

Page({
  data: {
    avatarUrl: '',
    userName: '',
    userId: '',
    lists1: [],
    lists2: [],
    lists3: [],
    theme: '#000000',
    themeList: [],
    show_leftnav: false,
    showColorPicker: false,
    ipx: app.globalData.isIPX
  },

  onLoad: function () {
    var loginFlag = wx.getStorageSync('loginFlag');
    if (!loginFlag) {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userId: wx.getStorageSync('userInfo').userId,
        avatarUrl: wx.getStorageSync('userInfo').userPhoto,
        userName: wx.getStorageSync('userInfo').userName
      })
      if (wx.getStorageSync('userInfo').color) {
        this.setData({
          theme: wx.getStorageSync('userInfo').color
        })
      } else {
        this.setData({ theme: '#000000' })
      }
    }
    if (this.data.themeList.length == 0) {
      this.getTheme();
    }
    this.getList();
    if (wx.getStorageSync('theme')) {
      var theme = wx.getStorageSync('theme');
      this.setData({ theme: theme });
    } else {
      wx.setStorageSync('theme', this.data.theme);
    }
    wx.setNavigationBarTitle({
      title: '首页',
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.theme
    })
    app.watch(this, {
      theme: (val) => {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: val
        })
      }
    })
  },
  getTheme() {
    db.collection('theme').get({
      success: res => {
        this.setData({ themeList: res.data });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '网络错误！'
        });
      }
    })
  },
  getList() {
    db.collection('todolist').where({
      userId: this.data.userId
    }).orderBy('create_at', 'desc').get({
      success: res => {
        var list1 = [];
        var list2 = [];
        var list3 = [];
        for (var i in res.data) {
          res.data[i].scrollLeft = 0;
          res.data[i].open = 0;
          if (res.data[i].status == 0) {
            list1.push(res.data[i]);
          } else if (res.data[i].status == 1) {
            list2.push(res.data[i]);
          } else if (res.data[i].status == 2) {
            list3.push(res.data[i]);
          }
        }
        this.setData({ lists1: list1, lists2: list2, lists3: list3 });
      },
      fail: err => {
        wx.showToast({ icon: 'none', title: '查询失败！' });
      }
    })
  },
  addThing() {
    this.getList();
  },
  changeThing() {
    this.getList();
  },
  show_left() {
    this.setData({ show_leftnav: true });
  },
  show_color_picker() {
    this.setData({ showColorPicker: true });
  },
  changeTheme(val) {
    var newTheme = val.detail;
    this.setData({ theme: newTheme });
  },
  removeThing() {
    this.getList();
  },
  changePhoto(val) {
    var newPhoto = val.detail;
    this.setData({ avatarUrl: '' });
    this.setData({ avatarUrl: newPhoto });
  }
})
