// pages/choosecity/choosecity.js
var locationData = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationData: locationData.getlocation(),
    locatedCity:'',
    hotCity:[
      "北京",
      "上海",
      "广州",
      "深圳",
      "杭州",
      "成都",
      "武汉",
      "南京",
      "天津",
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var city = options.id;
    /* this.setData({
    locatedCity:city
    })
     console.log(city)  */
  },

  onCityTap:function(event){
    var chooseCity = event.currentTarget.dataset.cityid;
    app.globalData.city = chooseCity;
    wx.switchTab({
      url: '../homepage/homepage',
    })
  },
  onInputcityTap:function(event){
    wx.navigateTo({
      url: './inputcity/inputcity'
    }) 
  } ,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     this.setData({
       locatedCity: app.globalData.locatedCity
     })
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

})