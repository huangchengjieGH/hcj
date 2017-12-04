var app = getApp();
Page({

  /**
  * 页面的初始数据
  */
  data: {

    tableOrder: [
      { name: '菜名', goodsId: '1', price: '价格', count: '数量', totalPrice: '总额', time: '下单时间' },
      { name: '猪肝饭', goodsId: '2', price: '25', count: '1', totalPrice: '25', time: '2017/11/18 12:00' },
      { name: '卤肉饭', goodsId: '5', price: '18', count: '1', totalPrice: '18', time: '2017/11/18 12:00' },
      { name: '鱿鱼饭', goodsId: '1', price: '19', count: '1', totalPrice: '19', time: '2017/11/18 12:00' },
    ],
    items: [
      { name: '现金', value: '现金', checked: 'true' },
      { name: '支付宝', value: '支付宝' },
      { name: '微信', value: '微信' },
      { name: '银联', value: '银联' },
      { name: '其他', value: '其他' },
    ],
    cancelFlag: false,
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
    var delDishArray = this.data.cancelDish;
    if (this.data.cancelFlag) {
      for (var idx in delDishArray) {
        wx.showLoading(
          {
            title: "处理中"
          }
        )
        /******添加处理icon */
        util.requestByLogin({
          url: app.globalData.domain + '/ordermanage/deldish',
          method: 'POST',
          data: {
            orderId: that.data.orderId,
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
    }
  },
  onCheckOutTap: function (event) {
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
      url: app.globalData.domain + '/ordermanage/deldish',
      method: 'POST',
      data: {
        orderId: that.data.orderId,
        seatId: that.data.seatNum,
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