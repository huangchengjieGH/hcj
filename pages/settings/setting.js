// pages/setting/setting.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.setRole();
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
    if (app.globalData.role == '0') {
      this.setData({
        Flag: '报表'
      })
    } else if (app.globalData.role == '3') {

    } else {

      this.setData({
        Flag: '点餐'
      })
    }

  },
  /*点击了加盟合作 */
  oncooperationTap:function(event){
    wx.navigateTo({
      url: '../cooperation/cooperation',
    })
  },
  oncacheTap:function(event){
    wx.clearStorage();
    wx.showToast(
      {
        title: "清除缓存成功",
        duration: 800,
        icon: "success"
      }
    )

  },
  oncontactTap:function(event){
    wx.makePhoneCall({
      phoneNumber: '15999902125' //仅为示例，并非真实的电话号码
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    app.globalData.role = e.detail.value;
    this.setRole();
    this.getFlag();
  }

})