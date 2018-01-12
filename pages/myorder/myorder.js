// pages/myorder/myorder.js
var app = getApp();
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    total_flag:true,
    done_flag:false,
    paying_flag:false,
    cancel_flag:false,
    login_flag:true,
    orderList:[],
    orderData:[],
    shopMsg:{},
    cashPay:true,
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
    }
    );
   // this.getOrderList();
   /*  this.getOrderState(); */
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderList();
    this.getShopList();
  },
  /**获取订单列表 */
  getOrderList: function () {
    var that = this;
    util.requestByLogin({
      url: app.globalData.domain + '/wx/order',
      method: 'GET',
    }, function (res) {
      console.log(res); 
       that.processOrderData(res.data);  
   /*     that.setData({
        orderList:data
      })  */
    }, function (res) {
      console.log("Error: function getOrderList");
      console.log(res);
    }
    );
  },
  /*获取商家信息 */
  getShopList: function () {
    var that = this;
    var paymsg = {};
    util.requestByLogin({
      url: app.globalData.domain + '/wx/goods',
      method: 'GET',
      data: {
        sellerId: app.globalData.shopId,
      },
    }, function (res) {
      console.log(res);
      that.setData({
         shopMsg:res.extra.seller,
      })
      paymsg = that.getPaymentMsg(res);
      if (res.extra.seller.payType == 3) {
        that.setData({
          cashPay: true
        })
      } else {
        /****测试线下结帐效果 */
        that.setData({
          cashPay: false
        })
      }
    }, function (res) {
      console.log("Error: function getShopList");
      console.log(res);
    }
    );
  },
  /**获取订单状态啊 */
  getOrderState: function (data) {
     console.log(data[0].lastOrderStream.status); 
     var temp={};
     temp={

     }

  },
  /*** */
  processOrderData: function (data) {
    var temp = {};
    var orderList = [];
    for (var idx in data) {
      var time = util.formatTime(new Date(data[idx].lastOrderStream.updatedAt));
      switch (data[idx].lastOrderStream.type) {
        case 0:
          temp = {
            id: data[idx].id,
            num: data[idx].num,
            orderPrice: data[idx].orderPrice,
            tableNum: data[idx].tableNum,
            orderState: '订单已完成',  
            orderFunc: '开发票',
            time: time,
            goodsList: data[idx].goodsList,
            lastOrderStream:data[idx].lastOrderStream,
          }
          break;
        case 1:
          temp = {
            id: data[idx].id,
            num: data[idx].num,
            orderPrice: data[idx].orderPrice,
            tableNum: data[idx].tableNum,
            orderState: '未支付',
            orderFunc: '支付',
            time: time,
            status: data[idx].status,
            goodsList: data[idx].goodsList,
            lastOrderStream:data[idx].lastOrderStream,
          }
          break;
        case 2:
          temp = {
            id: data[idx].id,
            num: data[idx].num,
            orderPrice: data[idx].orderPrice,
            tableNum: data[idx].tableNum,
            orderState: '点餐中',
            orderFunc: '点餐中',
            time: time,
            status: data[idx].status,
            goodsList: data[idx].goodsList,
            lastOrderStream:data[idx].lastOrderStream,
          }
          break;
        case 3:
          temp = {
            id: data[idx].id,
            num: data[idx].num,
            orderPrice: data[idx].orderPrice,
            tableNum: data[idx].tableNum,
            orderState: '订单已取消',
            orderFunc: '再来一单',
            time: time,
            status: data[idx].status,
            goodsList: data[idx].goodsList,
            lastOrderStream:data[idx].lastOrderStream,
          }
          break;
        case 4:
          temp = {
            id: data[idx].id,
            num: data[idx].num,
            orderPrice: data[idx].orderPrice,
            tableNum: data[idx].tableNum,
            orderState: '线下支付',
            orderFunc: '再来一单',
            time: time,
            status: data[idx].status,
            goodsList: data[idx].goodsList,
            lastOrderStream: data[idx].lastOrderStream,
          }
          break;
        default:
          temp = data[idx];
      }
      orderList.push(temp);
      temp = {};
    }
       this.setData({
        orderList: orderList,
        orderData: orderList
      }) 
  },
  getOrderData: function (data, id) {
    var temp = {};
    var orderData = [];
    for (var idx in data) {
      if (data[idx].lastOrderStream.type == id) {
        temp = data[idx];
        orderData.push(temp);
        temp = {};
      }
    }
       this.setData({
         orderData: orderData
      }) 
  },
  onLoginTap:function(){
    console.log("点击了登录");
    wx.navigateTo({
      url: '../register/register',
    })
  },
/*点击了全部 */
  ontotalTap:function(event){
    var tatalId = event.currentTarget.dataset.id;
    var orderData = [];
    console.log(tatalId);
    this.setData({
      total_flag: true,
      done_flag: false,
      paying_flag: false,
      cancel_flag: false,
    });
    orderData = this.data.orderList;
    this.setData({
      orderData: orderData
    })

  },
/*点击了已完成 */
  ondoneTap: function (event) {
    var doneId = event.currentTarget.dataset.id;
    console.log(doneId);
    this.setData({
      total_flag: false,
      done_flag: true,
      paying_flag: false,
      cancel_flag: false,
    })
    this.getOrderData(this.data.orderList,0);
  },
  /*点击了待付款 */
  onpayTap: function (event) {
    var payId = event.currentTarget.dataset.id;
    console.log(payId);
    this.setData({
      total_flag: false,
      done_flag: false,
      paying_flag: true,
      cancel_flag: false,
    });
    this.getOrderData(this.data.orderList,1);
  },
  /*点击了已取消 */
  oncancelTap: function (event) {
    var cancelId = event.currentTarget.dataset.id;
    console.log(cancelId);
    this.setData({
      total_flag: false,
      done_flag: false,
      paying_flag: false,
      cancel_flag: true,
      });
    this.getOrderData(this.data.orderList,3);
  },
/*点击了设置 */
onsettingTap:function(event){
  wx.navigateTo({
    url: '../settings/setting',
  })
},
onOrderTap:function(event){
  //  wx.switchTab({
     // url: '../booking/booking'
  //  })  
  var orderId = event.currentTarget.dataset.id;
  console.log(orderId);
  var detailMsg={};
  detailMsg = this.getPaymentMsg(this.data.orderData, orderId);
  let str = JSON.stringify(detailMsg);
  console.log(str);
  wx.navigateTo({
    url: '../detailorder/detailorder?str='+str,
  })
  },
getPaymentMsg: function (res,orderId) {
  var orderMsg = {};
  for (var idx in res){
    if (res[idx].id == orderId){
      orderMsg = res[idx];
      break;
    }
    
    }
  //console.log(orderMsg);
  var temp = {
    name: this.data.shopMsg.name,
    imgUrl: this.data.shopMsg.imgUrl,
   // orderList: this.data.orderList,
    orderMsg: orderMsg,
    cashPay: this.data.cashPay
  }
  //console.log(temp);
  return temp;
},
onActionTap:function(event){
  var id = event.currentTarget.dataset.id;
  var status = event.currentTarget.dataset.status;
  console.log(status);
  console.log(id);
  if (!this.data.cashPay && status==1){
  this.pay(id, function (res) {
    console.log("res=" + res);
  })
 }
  else{
    wx.switchTab({
      url: '../customerbooking/customerbooking'
    }) 
  }
},
/*****测试付款函数 */
pay: function (id, callback) {
  console.log("id=" + id);
  var _self = this;
  util.requestByLogin({
    url: app.globalData.domain + '/wx/pay',
    method: 'POST',
    data: {
      orderId: id
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
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
  }, function () {
    console.log("error")
  }
  )
}

})