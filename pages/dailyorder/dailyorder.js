Page({

  /**
  * 页面的初始数据
  */
  data: {
    content: ['全部', '支付宝', '微信', '银联','现金','其他'],
    openList: true,
    showList: true,
    numValue: '全部',
    order: '',
    beginDate:'',
    dailyOrder: [
      { id:'-1',num: '订单号', orderPrice: '金额', customerNum: '用餐人数', payType: '支付方式', operator: '收银员' },
      { id: '2',num: '10011711132010030409', orderPrice: '320', customerNum: '6', payType: '支付宝', operator: '小白' },
      { id: '2',num: '10011711132010030408', orderPrice: '230', customerNum: '4', payType: '支付宝', operator: '小白' },
      { id: '2',num: '10011711132010030407', orderPrice: '220', customerNum: '5', payType: '支付宝', operator: '小白' },
      { id: '2',num: '10011711132010030405', orderPrice: '222', customerNum: '4', payType: '支付宝', operator: '小白' },
      { id: '2',num: '10011711132010030404', orderPrice: '231', customerNum: '3', payType: '微信', operator: '小白' },
      { id: '2',num: '10011711132010030402', orderPrice: '222', customerNum: '4', payType: '微信', operator: '小白' },
      { id: '2',num: '10011711132010030406', orderPrice: '333', customerNum: '5', payType: '支付宝', operator: '小白' },
      { id: '2',num: '10011711132010030401', orderPrice: '323', customerNum: '6', payType: '现金', operator: '小白' },
      { id: '2',num: '10011711132010030489', orderPrice: '222', customerNum: '4', payType: '现金', operator: '小白' },
      { id: '2',num: '10011711132010030459', orderPrice: '210', customerNum: '3', payType: '银联', operator: '小白' },
      { id: '2',num: '10011711132010030459', orderPrice: '210', customerNum: '3', payType: '银联', operator: '小白' },
      { id: '2',num: '10011711132010030439', orderPrice: '230', customerNum: '4', payType: '银联', operator: '小白' },
    ]
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
  },

  getServiceDailkyOrderData: function (e) {
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
      data: {
        begindate: that.data.beginDate,
        paytype: that.data.numValue
      },
    }, function (res) {
      console.log(res);
      wx.hideToast();

    }, function () {
      console.log("Error: function onactionTap")
      wx.hideToast();
    }
    );
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
    //this.getServiceDailkyOrderData();
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