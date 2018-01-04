var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
  * 页面的初始数据
  */
  data: {
    content: ['全部', '支付宝', '微信', '银联','现金','挂帐','其他'],
    openList: true,
    showList: true,
    numValue: '全部',
    order: '',
    beginDate:'',
    dailyOrder: []
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var timeId = options.timeId;
    console.log(timeId);
    this.setData({
      beginDate: timeId
    })
    this.getServiceDailyOrderData();
  },

  getServiceDailyOrderData: function (e) {
    var that = this;
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/report/dailyorder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        begindate: that.data.beginDate,
        paytype: that.data.numValue
      },
    }, function (res) {
      console.log(res);
      that.processDailyOrderData(res.data);
      wx.hideToast();

    }, function () {
      console.log("Error: function onactionTap")
      wx.hideToast();
    }
    );
  },
  processDailyOrderData:function(data){
    var temp = {};
    var totalPrice = 0.0;
    var dailyOrder = [];
    var count = 0;
    temp = {
      id: '-1',
      num: '订单号', 
      orderPrice: '金额', 
      customerNum: '用餐人数', 
      payType: '支付方式', 
      operator: '收银员'
    }
    dailyOrder.push(temp);
    for (var idx in data){
      if (data[idx].customerNum == "")
        data[idx].customerNum = null;
      if (data[idx].payType == "")
        data[idx].payType = null;
      if (data[idx].operator == "")
        data[idx].operator = null;
      temp = {
        id : data[idx].id,
        num:data[idx].num,
        orderPrice: data[idx].orderPrice,
        customerNum: data[idx].customerNum,
        payType:data[idx].payType,
        operator: data[idx].operator
      }
      ++count;
      dailyOrder.push(temp);
      totalPrice += data[idx].orderPrice;
    }
    this.setData({
      dailyOrder: dailyOrder,
      totalPrice: totalPrice,
      count: count
    })
  },
  formatDate: function (event) {
    const date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var beginDate = "";

    beginDate = year + '-' + month + '-' + day;
    this.setData({
      "beginDate": beginDate,
      "endDate": beginDate
    });
    /* console.log(start_date); */
  },
  onBeginDateTap: function (e) {
    var dates = e.detail.value;
    // dates = dates.toString().substring(5);
    dates = dates.toString();
    this.setData({
      beginDate: dates,
    })
  },
  onNumTap: function (event) {
    var onnumId = event.currentTarget.dataset.numid;
    this.setData({
      'numValue': onnumId,
      openList: true,
      showList: true,
    });
    console.log(onnumId);
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
  onOrderTap: function (event) {
    var orderId = event.currentTarget.dataset.id;
    console.log(orderId);
    if (orderId != '-1')
      wx.navigateTo({
        url: '../bosscheck/bosscheck?orderId=' + orderId,
      })
  },
  onSearchTap:function(e){
    console.log('click search');
    this.getServiceDailyOrderData();
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