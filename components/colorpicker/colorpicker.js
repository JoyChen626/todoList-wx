// components/mypicker/mypicker.js
const app = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showColorPicker:{type:Boolean},
    currentColor:{type:String},
    themeList:{type:Array}
  },

  /**
   * 组件的初始数据
   */
  data: {
    ipx: app.globalData.isIPX
    },


  /**
   * 组件的方法列表
   */
  methods: {
    closeColorPicker(){
      this.setData({showColorPicker: false})
    },
    changeTheme(e){
      var id = wx.getStorageSync('userInfo')._id;
      var color = e.currentTarget.dataset.color;
      this.setData({currentColor: color})
      wx.setStorageSync('theme', this.data.currentColor);
      this.triggerEvent('change_theme', this.data.currentColor);
      db.collection('user').doc(id).update({
        data: { color: this.data.currentColor},
        success: function(res){
          console.log('成功！')
        }
      })
    }
  }
})
