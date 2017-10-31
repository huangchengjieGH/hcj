// pages/pay/pay.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ['1', '2', '3', '4','5','6','7','8','9','10'],
    openList: true,
    showList: true,
    numValue:1,
    order:'',
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var orderId=options.id;
      var that = this;
      console.log(orderId);
      util.requestByLogin({
        url: app.globalData.domain + '/wx/order/' + orderId,
        method: 'GET',
      }, function (res) {
        console.log(res);
        that.setData({
          order: res.data
        })
      }
      );
  },
  /*****测试付款函数 */
  pay: function (id, callback) {
    console.log("id=" + id);
    var _self = this;
    util.requestByLogin({
      url: app.globalData.domain + '/wx/pay',
      method: 'POST',
      data:{
        orderId:id
      },
      header:{
        'content-type':'application/x-www-form-urlencoded'
      }
    }, function (res) {
      console.log("res=" + res)
      wx.requestPayment({
        timeStamp: res.data.timestamp,
        nonceStr: res.data.nonceStr,
        package: 'prepay_id=' + res.data.prepay_id,
        signType: 'MD5',
        paySign: res.data.paySign,
        success: function (res) {
          callback(res);
        },
        fail: function (res) {
          callback(res);
        },
        complete: function (res) {
          callback(res);
        }
      })
    },function(){
      console.log("error")
    }
    )
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
    }},
    /*选择就餐人数 */
   onNumTap:function(event){
     var onnumId = event.currentTarget.dataset.numid;
     this.setData({ 
       'numValue': onnumId,
       openList: true,
       showList: true,});
     console.log(onnumId);
   },
   /*付款 */
  onPaytap:function(event){
    console.log('点击了付款按钮');
       this.pay(this.data.order.id, function (res) {
        console.log("res="+res);
        // if (res.errMsg == "requestPayment:ok") {
        //   console.log("success");
        // }
      })

  
  }
})