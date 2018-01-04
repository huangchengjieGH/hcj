// pages/ordermanager/ordermanager.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
  * 页面的初始数据
  */
  data: {
    content: ['全部', '使用中', '空闲'],
    openList: true,
    showList: true,
    numValue: '全部',
    order: '',
    Flag:'',
    seat:[],
    tableList:[],
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getFlag();
   // this.getSeatGourp();
    this.getServiceSeatData();
  },
  onReady: function () {
   
  },
  getServiceSeatData:function(){ 
   // console.log("test");  
    var that = this;
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/ordermanage/seat',
      method: 'GET',
    }, function (res) {
      console.log(res.data);
      that.setData({
        seat:res.data
      })
      that.getSeatGourp(res.data);
    }, function () {
      console.log("Error: function getServiceSeatData")
    }
    );
  },
  getSeatGourp: function (seat){
    var seat = this.data.seat;
    var seatArray = [];
    var temp = {};
    var seatGroup = [];
    var tableList = [];
    var i = 0;
    for (var idx in seat){ 
      if (this.data.numValue == '全部'){
        tableList = seat;
        break;

      } else if (this.data.numValue == '使用中'){
        if (seat[idx].status == '1'){
          tableList.push(seat[idx]);
        }

      } else if (this.data.numValue == '空闲'){
        if (seat[idx].status == '0') {
          tableList.push(seat[idx]);
        }
      }
           
    }
    this.setData({
      tableList: tableList
    })
  },
onSeatTap: function (event) {
  var orderId = event.currentTarget.dataset.orderid;
    var status = event.currentTarget.dataset.status;
    var seatNum = event.currentTarget.dataset.seatnum;
    console.log(orderId);
    console.log(status);
    console.log(seatNum);
    if (status==1){
      wx.navigateTo({
        url: '../checkorder/checkorder?orderId=' + orderId
      })
    }

    if (status == 0 || status == 2){

      wx.navigateTo({
        url: '../staffsbooking/staffsbooking?seatNum=' + seatNum
      })
    }
    
  },
  /*选择就餐人数 */
  onNumTap: function (event) {
    var onnumId = event.currentTarget.dataset.numid;
    this.setData({
      'numValue': onnumId,
      openList: true,
      showList: true,
    });
    console.log(onnumId);
    this.getSeatGourp(this.data.seat);
  },
  per_list: function (event) {
    if (this.data.openList) {
      this.setData({
        openList: false,
        showList: false,

      })
    } else {
      this.setData({
        openList: true,
        showList: true,
      })
    }
  },
  onReportTap: function (e) {
    console.log(app.globalData.role);
  if (app.globalData.role == '0'){
      wx.redirectTo({
        url: '../report/report',
      })
  } else if (app.globalData.role == '1'){
    wx.redirectTo({
      url: '../staffsbooking/staffsbooking',
    })
  } else if (app.globalData.role == '2'){
    wx.redirectTo({
      url: '../staffsbooking/staffsbooking',
    })
  }

  },
  onMyTap: function (e) {
    wx.redirectTo({
      url: '../my/my',
    })
  },
  getFlag: function (e) {
    if (app.globalData.role == '0') {
      this.setData({
        Flag: '报表'
      })
    } else {
      this.setData({
        Flag: '点餐'
      })
    }

  },


  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var that = this;
    this.interval = setInterval(this.getServiceSeatData, 5000);
  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
  },

  /**
  * 生命周期函数--监听页面卸载
  */
  //页面卸载，清除画布绘制计时器
  onUnload: function () {
    clearInterval(this.interval)
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