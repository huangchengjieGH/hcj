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
    login_flag:false,
    orderList:[],
    orderData:[],
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
    this.getOrderList();
   /*  this.getOrderState(); */
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
    }, function () {
      console.log("error")
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
      switch (data[idx].lastOrderStream.status) {
        case 1:
          temp = {
            id: data[idx].id,
            num: data[idx].num,
            orderPrice: data[idx].orderPrice,
            tableNum: data[idx].tableNum,
            orderState: '订单已完成',
            orderFunc: '开发票',
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
            orderState: '待付款',
            orderFunc: '申请取消订单',
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
            orderState: '预约成功',
            orderFunc: '点餐',
            goodsList: data[idx].goodsList,
            lastOrderStream:data[idx].lastOrderStream,
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
      if (data[idx].lastOrderStream.status == id) {
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
    /*** */
    /* var temp = {};
    var orderData = [];
    var data = this.data.orderList;
    for (var idx in data) {
      if (data[idx].lastOrderStream.status == 1) {
        temp = data[idx];
      }
      orderData.push(temp);
      temp = {};
    }
  //  this.setData({
   //     orderList: orderList
   //   }) 
    console.log(orderData) */
    this.getOrderData(this.data.orderList,1);
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
    this.getOrderData(this.data.orderList,2);
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
    url: '../setting/setting',
  })
},
  onOrderTap:function(event){
    wx.switchTab({
      url: '../booking/booking'
    })  
  },

})