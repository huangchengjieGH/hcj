var util = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /*记录分类点菜数量 */
    class_Dish: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    classify: null,
    /*每道菜下单数目 */
    Order_num: 0,
    /*记录点的菜数目 */
    totalCount: 0,
    totalnum: 0,
    /*总价格 */
    totalprice: 0,
    /*点击购物车显示菜单列表 */
    showcartList: false,
    /*记录用户动作状态 */
    actionflag: '请点餐',
    open_res_Id: null,
    tableNum: null,
    customerNum: null,
    orderId: '',
    showModalStatus: false,
    orderStatus: '0',
    orderMsg: '',
    cashPay: true,
    detailDish: {},
    popFlag: 1,
    tasteList:[
      "微辣",
      "辣",
      "不辣"
    ],
    taste:''
  },
  GetQueryString: function (url, key) {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.split("?")[1];
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest[key];
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    //  console.log(app.globalData.domain);
    //   console.log(app.globalData.shopId);
    /****获取二维码信息 */
    // var scene = decodeURIComponent(options.scene);
    //   console.log(options);
    /*  var tableNum = options.tableNum;
     this.setData(
       {
         tableNum: tableNum
       }
     ) */
    //   console.log(this.data.tableNum)
    //  console.log("qrcode id : " +  id)
    /*    var scene = options.scene */
    /****获取二维码信息 */
    console.log(options);
    var url = decodeURIComponent(options.q);
    console.log(url);
    var tableNum = this.GetQueryString(url, 'tableNum');
    //测试屏蔽扫码，给定默认座位号10
    this.setData({
      tableNum: 15
    })
    console.log("this.data.tableNum:" + this.data.tableNum);
    var open_res_Id = app.globalData.resId;
    this.setData({ 'open_res_Id': open_res_Id });
    var Detail = {};
    var goods = {};
    this.GetData();
  },

  onShow: function () {
    console.log("onshow");
    var open_res_Id = app.globalData.resId;
    this.setData({ 'open_res_Id': open_res_Id });

  },
  /*Get data */
  GetData: function (event) {
    var that = this;
    var res_msg = {};
    var goods_msg = {};
    var DetailData = {};
    var order_num = 0;
    var ServiceGoodsMsg = {};
    var resMsg = {};

    /*获取商品信息 */
    util.requestByLogin({
      url: app.globalData.domain + '/wx/goods',
      method: 'GET',
      data: {
        sellerId: app.globalData.shopId,
      },
      header: {
        'content-type': 'application/xml'
      },
    }, function (res) {
      console.log(res);
      ServiceGoodsMsg = res;
      that.setData({
        goods_msg: ServiceGoodsMsg,
        resMsg: ServiceGoodsMsg.extra
      })
      // that.processGoodsMsgData(ServiceGoodsMsg);
      that.processGoodsData(that.data.goods_msg.data[0]);
      that.processOrderList(that.data.goods_msg);
      that.setData({ classify: ServiceGoodsMsg.data[0].classifyname });
      //console.log(res.extra.seller.payType);
      if (res.extra.seller.payType == 3) {
        that.setData({
          cashPay: true
        })
      } else {
        /****测试线下结帐效果 */
        that.setData({
          cashPay: true
        })
      }

    }, function () {
      console.log("Error:function GetData")
      wx.hideToast();
    }
    );

  },
  /**
   * 获取不同类型菜品
  */
  processGoodsData: function (goodsList) {
    var temp = {};
    var order_num = 0;
    var Goods = [];
    var goodLists = [];
    console.log(goodsList.classifyName);
    var classifyName = goodsList.classifyName;
    for (var idx in goodsList.goods) {
      var goods = goodsList.goods;
      temp = {
        id: goods[idx].id,
        name: goods[idx].name,
        brief: goods[idx].brief,
        price: goods[idx].price,
        sales: goods[idx].sales,
        imgUrl: app.globalData.imgDomain+goods[idx].imgUrl,
        status: goods[idx].status,
        soldout: goods[idx].soldout,
        classifyId: goods[idx].classifyId
      }

      Goods.push(temp);
    }
    temp = {
      classifyName: classifyName,
      goodLists: Goods
    }
    goodLists.push(temp);
    this.setData(
      {
        Goods: goodLists
      }
    )
  },
  /*获取已点菜单 */
  processOrderList: function (goods_msg) {
    var temp = {};
    var orderList = [];
    for (var idx in goods_msg.data) {
      var subject = goods_msg.data[idx];
      for (var idx2 in subject.goods) {
        var subject2 = subject.goods[idx2]
        if (subject2.order_num > 0) {
          temp = {
            id: subject2.id,
            name: subject2.name,
            price: subject2.price,
            order_num: subject2.order_num
          }
          orderList.push(temp);
          temp = {};
        }
      }
    }
    this.setData({
      orderList: orderList
    })
  },

  /*****点菜或者退菜
   * style:  0 加菜   1 退菜
   * dishId: 菜品id
   */
  processServiceOrder(style, goodId) {
    var that = this;
    var good = [];
    var goodsArray = [];
    if (style == 0) {
      /***加菜 */
      wx.showLoading(
        {
          title: "处理中"
        }
      )
      good = [
        {
          goodsId: goodId,
          count: 1,
        }
      ]
      /******添加处理icon */
      util.requestByLogin({
        url: app.globalData.domain + '/wx/order',
        method: 'POST',
        data: {
          tableNum: that.data.tableNum,
          customerNum: 0,
          goodsList: good
        },
      }, function (res) {
        // console.log(res);
        that.setData({
          orderLists: res.data,
          orderId: res.data.id
        })
        that.processGoodsListOrder(res.data);
        goodsArray = res.data.goodsList;
        that.getTotalCount(goodsArray);
        wx.hideToast();
      }, function () {
        console.log("Error: function onactionTap")
        wx.hideToast();
      }
      );
    } else if (style == 1) {
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
          id: that.data.orderId,
          goodsId: goodId
        },
      }, function (res) {
        console.log(res);
        that.setData({
          orderLists: res.data,
        })
        goodsArray = res.data.goodsList;
        that.getTotalCount(goodsArray);
        wx.hideToast();

      }, function () {
        console.log("Error: function onDeleteDishTap")
        wx.hideToast();
      }
      );
    }


  },
  processGoodsListOrder(data) {
    var goodsList = [];
    var orderPrice = 0.0;
    for (var idx in data.goodsList){
      if (data.goodsList[idx].commited == 0){
        goodsList.push(data.goodsList[idx]);
        orderPrice += data.goodsList[idx].price * data.goodsList[idx].count
      }
    }
    this.setData({
      goodsList: goodsList,
      orderPrice: orderPrice
    })
  },
  getTotalCount: function (goodsArray) {
    var totalCount = 0;
    if (goodsArray.length > 0) {
      for (var idx in goodsArray) {
        if (goodsArray[idx].commited ==0){
          totalCount += goodsArray[idx].count
          console.log(goodsArray[idx].count);
        }
        
      }
      this.setData({
        totalCount: totalCount
      })
    } else {
      this.setData({
        totalCount: 0
      })
    }

    /*改变状态*/
    if (this.data.totalCount == 0) {
      this.setData({ 'actionflag': '请点餐' })
    } else {
      this.setData({ 'actionflag': '选好了' })
    }
  },
  /*click the classify button */
  onclassiTap: function (event) {
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    console.log("buttonId:" + name);
    console.log("buttonId:" + id);
    this.setData({ 'classify': name }),
      this.processGoodsData(this.data.goods_msg.data[id]);


  },
  /*click the button to del the ordered dish */
  DelDishTap: function (event) {
    var that = this;
    var deldishId = event.currentTarget.dataset.deldishid;
    var param = {};
    var param1 = {};
    var totalnum = 0;
    var totalPrice = 0;
    /****识别菜所在位置 */
    var flag = false;
    var goodsMsg = this.data.goods_msg.data;
    if (this.data.orderStatus == '0') {
      for (var idx in goodsMsg) {
        var subject = goodsMsg[idx];
        var classIndex = idx;
        for (var idx2 in subject.goods) {
          var num = idx2
          var subject2 = subject.goods[idx2]
          if (deldishId == subject2.id) {
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }
      /****退菜 */
      that.processServiceOrder(1, deldishId);
      /*同步菜单列表 */
      //   this.processOrderList(this.data.goods_msg);
      /*改变状态*/
      if (this.data.totalCount == 0) {
        this.setData({
          'actionflag': '请点餐',
          'showcartList': false
        })
      } else {
        this.setData({ 'actionflag': '选好了' })
      }
    }
  },

  /*click the button to add the  dish */
  AddDishTap: function (event) {
    var that = this;
    var adddishId = event.currentTarget.dataset.adddishid;
    console.log(adddishId);
    this.showInputSeat('close');
    var flag = false;
    if (this.data.orderStatus == '0') {
      var goodsMsg = this.data.goods_msg.data;
      //识别菜品位置
      for (var idx in goodsMsg) {
        var subject = goodsMsg[idx];
        var classIndex = idx;
        for (var idx2 in subject.goods) {
          var num = idx2
          var subject2 = subject.goods[idx2]
          if (adddishId == subject2.id) {
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }
     if (this.data.tableNum != null && this.data.tableNum != '') {
        console.log("已经扫码");
        /***点菜 */
         that.processServiceOrder(0, adddishId);
        var class_param = {};
        var class_string = "class_Dish[" + classIndex + "]";
        class_param[class_string] = this.data.class_Dish[classIndex] + 1;
        this.setData(class_param); 
      }else{
        wx.showToast({
          title: '请扫买再点餐',
        })
      }
   

    }
  },
  /*点击购物车显示菜单列表 */
  oncartTap: function (event) {
    showcartList: true,
      this.setData({ 'showcartList': !this.data.showcartList })
    /* console.log('点击购物车显示菜单列表'); */
  },
  /*点击已选菜单其他地方隐藏已选菜单 */
  onclicktop: function (event) {
    this.setData({ 'showcartList': false })
  },
  onclickmiddle: function (event) {
    this.setData({ 'showcartList': false })
  },
  onclicksubject: function (event) {
    this.setData({ 'showcartList': false })
  },
  /*用户动作状态记录：请点餐，选好了，结账 */
  onactionTap: function (event) {
    var that = this;
    var actionId = event.currentTarget.dataset.actionid;
    var paymsg = {};
    console.log(actionId);
    if (actionId == '请点餐') {
      null;
    }
    else if (actionId == '选好了') {
      console.log(that.data.tableNum);
      this.setData({
        popFlag: '1'
      })
      this.showInputSeat('open');

    }
    else if (actionId == '结账') {

    }
  },

  getPaymentMsg: function (event) {
    var temp = {
      name: this.data.resMsg.seller.name,
      imgUrl: this.data.resMsg.seller.imgUrl,
      customerNum: this.data.customerNum,
      orderList: this.data.orderLists,
      cashPay: this.data.cashPay
    }
    //console.log(temp);
    return temp;
  },
  /*点击了清空，清空购物车 */
  clearUpCart: function (event) {
    var that = this;
    wx.showModal({
      title: '清空购物车',
      content: '确定清空购物车?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          util.requestByLogin({
            url: app.globalData.domain + '/ordermanage/delorder',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              orderId: that.data.orderId,
            },
          }, function (res) {
            // console.log(res);
            that.setData({
              totalCount: 0,
              orderLists: {},
              showcartList: false,
              class_Dish: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              actionflag: '请点餐',
            })
            wx.hideToast();
          }, function () {
            console.log("Error: function onactionTap")
            wx.hideToast();
          }
          );

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /*呼叫服务员 */
  callingService: function (event) {
    wx.showToast(
      {
        title: "正火速赶来...",
        duration: 1200,
        icon: 'loading',
      }
    )
  },
  onResTap: function (event) {
    /*  console.log(app.globalData.resId) */
    var shopmsg = {
      imgUrl: this.data.resMsg.seller.imgUrl,
      name: this.data.resMsg.seller.name,
      score: '5.0',
      phone: this.data.resMsg.seller.phone,
      address: this.data.resMsg.seller.address,
      worktime: '11:00-14:30 17:00-22:00'
    }
    let str = JSON.stringify(shopmsg);
    console.log(shopmsg);
    wx.navigateTo({
      url: '../shopmsg/shopmsg?str=' + str,
    })
  },
  seatInput: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value != '') {
      that.setData({
        tableNum: e.detail.value,
      })

    }
  },
  costomerNumInput: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value != '') {
      that.setData({
        customerNum: e.detail.value,
      })

    }
  },

  onImgTap: function (e) {
    var imgId = e.currentTarget.dataset.imgid;
    var soldout = e.currentTarget.dataset.soldout;
    if (soldout == 0){
    this.setData({
      popFlag: 0
    })
    var temp = {};
    for (var idx in this.data.Goods[0].goodLists) {
      if (this.data.Goods[0].goodLists[idx].id == imgId) {
        temp = {
          id: imgId,
          name: this.data.Goods[0].goodLists[idx].name,
          sales: this.data.Goods[0].goodLists[idx].sales,
          price: this.data.Goods[0].goodLists[idx].price,
          imgUrl: this.data.Goods[0].goodLists[idx].imgUrl
        }
        this.setData({
          detailDish: temp
        })
        break;
      }
    }
    this.showInputSeat('open')
    }
  },
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
  onCancelTap: function (e) {
    console.log('点击了取消');
    this.showInputSeat('close')
  },

  onConfirmTap: function (e) {
    console.log('点击了确定');
    var that = this;
    var paymsg = {};
    this.showInputSeat('close')
    //正常场景
    if (that.data.tableNum != null && that.data.tableNum != '' && that.data.customerNum != '') {

      this.setData({
        orderStatus: '1'
      })
      wx.showLoading(
        {
          title: "处理中"
        }
      )

      /******添加处理icon */
      util.requestByLogin({
        url: app.globalData.domain + '/ordermanage/submit',
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

        /**订单提交后转到订单页面 */
        paymsg = that.getPaymentMsg();
        let str = JSON.stringify(paymsg);
        that.setData({
          orderStatus: '0',
        })
        /*全局变量统计点菜数量，清0 */
        app.globalData.totalnum = 0;
        that.setData({
          totalCount: 0,
          orderLists: {},
          showcartList: false,
          class_Dish: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          actionflag: '请点餐',
        })
        /*改变状态*/
        if (that.data.totalCount == 0) {
          that.setData({ 'actionflag': '请点餐' })
        } else {
          that.setData({ 'actionflag': '选好了' })
        }
        //console.log(paymsg);
        wx.navigateTo({
          url: '../pay/pay?str=' + str
        })

      }, function () {
        console.log("Error: function onactionTap")
        // wx.hideToast();
      }
      );
    }
    else {
      console.log("seat is null");
      wx.showToast({
        title: '请到店内扫码就餐',
      })
    }
    //屏蔽结帐功能场景
    if (that.data.tableNum != null && that.data.tableNum != '' && that.data.cashPay && that.data.customerNum != '' && 1 == 0) {
      that.setData({
        orderStatus: '1'
      })
      //  that.getGoodsList(that.data.orderList);
      //  let Test = that.data.GoodsList;
      wx.showLoading(
        {
          title: "处理中"
        }
      )

      /******添加处理icon */
      util.requestByLogin({
        url: app.globalData.domain + '/wx/order',
        method: 'POST',
        data: {
          tableNum: that.data.tableNum,
          customerNum: that.data.customerNum,
          goodsList: Test
        },
      }, function (res) {
        console.log(res);
        /* orderId = data.id; */
        wx.hideToast();
        that.setData({
          orderId: res.data.id,
          orderMsg: res.data
        });
        /**订单提交后转到订单页面 */
        paymsg = that.getPaymentMsg();
        let str = JSON.stringify(paymsg);
        that.setData({
          orderStatus: '0',
        })
        /*订单提交后清空列表 */
        //   that.clearUpCart(that.data.goods_msg, that.data.Goods);
        /*全局变量统计点菜数量，清0 */
        app.globalData.totalnum = 0;
        that.setData({
          orderLists: [],
          totalnum: 0,
          totalprice: 0,
          showcartList: false,
          class_Dish: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        })
        /*改变状态*/
        if (that.data.totalnum == 0) {
          that.setData({ 'actionflag': '请点餐' })
        } else {
          that.setData({ 'actionflag': '选好了' })
        }
        //console.log(paymsg);
        wx.navigateTo({
          url: '../pay/pay?str=' + str
        })
      }, function () {
        console.log("Error: function onactionTap")
        wx.hideToast();
      }
      );

    }
  },

  onTasteTap:function(e){
    var taste = e.currentTarget.dataset.taste;
    this.setData({
      taste: taste
    })
  }

})