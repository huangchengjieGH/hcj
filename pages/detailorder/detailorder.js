// pages/detailorder/detailorder.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    openList: true,
    showList: true,
    payWay:'微信支付',
    orderStatus:'订单已经完成'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ordermsg = JSON.parse(options.str);
    if (ordermsg.cashPay){
      this.setData({
        payWay:'线下支付',
        orderStatus:'线下支付'
      })
    } else{
      this.setData({
        payWay: '微信支付',
        orderStatus: ordermsg.orderMsg.orderState
      })
    }
    this.setData({
      ordermsg: ordermsg
    })
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