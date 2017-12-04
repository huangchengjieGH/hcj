Page({

  /**
  * 页面的初始数据
  */
  data: {
    times: [
      '菜名',
      '价格',
      '数量',
      '总额',
      '折扣',
      '下单时间',
    ],
    tableOrder: [
      { name: '菜名', price: '价格', count: '数量', totalPrice: '总额', time: '下单时间' },
      { name: '猪肝饭', price: '25', count: '1', totalPrice: '25', time: '2017/11/18 12:00' },
      { name: '卤肉饭', price: '18', count: '1', totalPrice: '18', time: '2017/11/18 12:00' },
      { name: '鱿鱼饭', price: '19', count: '1', totalPrice: '19', time: '2017/11/18 12:00' },
    ],
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var orderId = options.orderId;
    this.setData({
      orderId: orderId
    })
    console.log(orderId);
    //this.getServiceOneOrderData();
  },
 
  getServiceOneOrderData: function (e) {
    var that = this;
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/report/oneorder',
      method: 'POST',
      data: {
        orderId: that.data.orderId,
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