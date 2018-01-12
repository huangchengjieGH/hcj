var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
  * 页面的初始数据
  */
  data: {
    userInfo: {},
    total_flag: true,
    done_flag: false,
    paying_flag: false,
    cancel_flag: false,
    login_flag: true,
    items: [
      { name: '老板', value: '0', checked: 'true' },
      { name: '经理', value: '1' },
      { name: '员工', value: '2' },
      { name: '顾客', value: '3' },
    ],
    Flag: '',
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    },    
    );
    this.setRole();
    this.getFlag();
  },
  onShow: function () {
    this.getFlag();
  },
setRole: function (e) {
    if (app.globalData.role == '0') {

      var temp = [
        { name: '老板', value: '0', checked: 'true' },
        { name: '经理', value: '1' },
        { name: '员工', value: '2' },
        { name: '顾客', value: '3' },
      ]
      this.setData({
        items: temp
      })

    } else if (app.globalData.role == '1') {
      var temp = [
        { name: '老板', value: '0' },
        { name: '经理', value: '1', checked: 'true' },
        { name: '员工', value: '2' },
        { name: '顾客', value: '3' },
      ]
      this.setData({
        items: temp
      })
    } else if (app.globalData.role == '2') {
      var temp = [
        { name: '老板', value: '0' },
        { name: '经理', value: '1' },
        { name: '员工', value: '2', checked: 'true' },
        { name: '顾客', value: '3' },
      ]
      this.setData({
        items: temp
      })
    } else if (app.globalData.role == '3') {
      var temp = [
        { name: '老板', value: '0' },
        { name: '经理', value: '1' },
        { name: '员工', value: '2' },
        { name: '顾客', value: '3', checked: 'true' },
      ]
      this.setData({
        items: temp
      })
    }
  },

getFlag: function (e) {
  var role = wx.getStorageSync('role');
  this.setData({
    role: role
  })
  if (this.data.role == '0') {
    this.setData({
      Flag: '报表'
    })

  } else if (this.data.role == '3') {

  } else {
    this.setData({
      Flag: '点餐'
    })


  }

},
  onLoginTap: function () {
    console.log("点击了登录");
    wx.navigateTo({
      url: '../register/register',
    })
  },
  /*点击了设置 */
  onsettingTap: function (event) {
    wx.navigateTo({
      url: '../settings/setting',
    })
  },

  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    app.globalData.role = e.detail.value;
    this.setRole();
    this.getFlag();

  },
  onOderManegeTap: function (e) {
    wx.redirectTo({
      url: '../ordermanager/ordermanager',
    })
  },
  onReportTap: function (e) {
    console.log("onReportTap");
    
    if (this.data.role == '0') {
      wx.redirectTo({
        url: '../report/report',
      })
    } else if (this.data.role == '1') {
      console.log("1");
      wx.redirectTo({
        url: '../staffsbooking/staffsbooking',
      })
    } else if (this.data.role == '2') {
      console.log("2");
      wx.redirectTo({
        url: '../staffsbooking/staffsbooking',
      })
    }
  }

})