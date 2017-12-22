var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
  * 页面的初始数据
  */
  data: {
    items: [
      { name: '现金', value: '现金', checked: 'true' },
      { name: '支付宝', value: '支付宝' },
      { name: '微信', value: '微信' },
      { name: '银联', value: '银联' },
      { name: '其他', value: '其他' },
    ],
    cancelFlag: false,
    popType:'1',
    payType:'现金'
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var orderId = options.orderId;
    var that = this; 
    console.log(orderId);
    this.setData({
      orderId: orderId
    });
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    },
    );
    this.getServiceOneOrderData();
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
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId: that.data.orderId,
      },
    }, function (res) {
      console.log(res.data);
      that.processOneOrderData(res.data)
      wx.hideToast();

    }, function () {
      console.log("Error: function onactionTap")
      wx.hideToast();
    }
    );
  },
  processOneOrderData:function(data){
     var that = this;
     var temp = {};
     var tableOrder = [];
     var count = 0;
     var price = 0.0;
     var time = '',
     temp = {
       name: '菜名', 
       goodsId: '1', 
       price: '价格', 
       count: '数量', 
       totalPrice: '总额',
       time: '下单时间' 
     }
     tableOrder.push(temp);
     for(var idx in data){
       time = util.formatTime(new Date(data[idx].time));
       temp = {
         name:data[idx].name,
         goodsId: data[idx].goodsId,
         price: data[idx].price,
         count: data[idx].count,
         totalPrice: data[idx].totalPrice,
          time:time
       }
       count += data[idx].count;
       price += data[idx].totalPrice;
       tableOrder.push(temp);
     }
    that.setData({
      tableOrder: tableOrder,
      count: count,
      price: price,
      customerNum: data[0].customerNum,
      tableNum: data[0].tableNum,
      num: data[0].num,
      orderId: data[0].id,

    })
  },
  checkboxChange: function (e) {
    var cancelDish = [];
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    cancelDish = e.detail.value;
    if (cancelDish.length != 0) {
      this.setData({
        cancelFlag: true,
        cancelDish: cancelDish
      })
    } else {
      this.setData({
        cancelFlag: false,
        cancelDish: cancelDish
      })
    }
  },
  onDeleteDishTap: function (event) {
    console.log("delete");
    var that = this;
    this.deleteDishes();
  },
  deleteDishes:function(e){
    var cancelDish = this.data.cancelDish;
    var orderId = this.data.orderId;
    for (var idx in cancelDish){
      wx.showLoading(
        {
          title: "处理中"
        }
      )
      /******添加处理icon */
      util.requestByLogin({
        url: app.globalData.domain + '/ordermanage/deldish',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          id: orderId,
          goodsId: cancelDish[idx]
        },
      }, function (res) {
        console.log(res);
        wx.hideToast();

      }, function () {
        console.log("Error: function onDeleteDishTap")
        wx.hideToast();
      }
      );

    }
    this.setData({
      cancelDish:[],
      cancelFlag:false
    })
    this.getServiceOneOrderData();
  },
  onCheckOutTap: function (event) {
    this.setData({
      popType:'0'
    })
    this.showInputSeat('open');
  },
  onCancelTap: function (e) {
    console.log('点击了取消');
    this.showInputSeat('close')
  },
  onConfirmTap: function (e) {
    console.log('点击了确定');
    var that = this;
    this.showInputSeat('close');
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/ordermanage/checkout',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId: that.data.orderId,
        seatId: that.data.tableNum,
        payType: that.data.payType,
        operator: that.data.userInfo.nickName
      },
    }, function (res) {
      console.log(res);
      wx.hideToast();

      wx.redirectTo({
        url: '../ordermanager/ordermanager'
      })

    }, function () {
      console.log("Error: function radioChange")
      wx.hideToast();
    }
    );
  },
  /*弹窗 */
  powerDrawer: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.showInputSeat(currentStatu);
  },
  //控制输入弹窗
  showInputSeat: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 150, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
  if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var payType = e.detail.value;
    this.setData({
      payType:payType
    })

  },
  onModifyTap:function(){
    this.setData({
      popType:'1'
    })
    this.showInputSeat('open');
  },
  tableNumInput: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value != '') {
      that.setData({
        tableNum: e.detail.value,
      })
    }
    //修改用餐人数接口
  },
  costomerNumInput: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value != '') {
      that.setData({
        customerNum: e.detail.value,
      })
    }
    //修改用餐人数接口
  },
  onCustomerNumTap:function(e){
    var that = this;
    this.showInputSeat('close');
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/ordermanage/modify',
      method: 'PUT',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId: that.data.orderId,
        tableNum: that.data.tableNum,
        customerNum: that.data.customerNum,
      },
    }, function (res) {
      console.log(res);
      wx.hideToast();

    }, function () {
      console.log("Error: function radioChange")
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