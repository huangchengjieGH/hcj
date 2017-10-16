// pages/shopmsg/shopmsg.js
var cityData = require('../../utils/util.js');
var resdatabase = require('../../data/data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   stars:[1,1,1,1,1],
   score:'5.0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var resId = options.id;
     this.GetData();
  },
  
  /*Get local database */
  GetData: function (event) {
    var res_msg = {};
    /*获取商家信息 */
    res_msg = resdatabase.Data_List[0];
    this.setData(
      {
        resMsg: res_msg.message,
      },
    );
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
  
  }
})