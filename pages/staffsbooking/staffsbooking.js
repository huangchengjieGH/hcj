// pages/booking/booking.js
//var postsdatabase = require('../../data/posts-data.js');
//var resdatabase = require('../../data/data.js');
//var goodsdatabase = require('../../data/goods.js');
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
    totalnum: 0,
    totalCount: 0,
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
    popFlag: 0,
    funcFlag: '点餐',
    tasteList: [
      "微辣",
      "辣",
      "不辣"
    ],
    taste: ''
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
    /****订单管理页面传过来的座位号 */
    if (options.seatNum != null && options.seatNum != ''){
      var seatNum = options.seatNum;
      this.setData({
        tableNum: seatNum
      })
    }    
  if (options.str != null && options.str != ''){
      console.log(options.str);
    var str = JSON.parse(options.str);
     this.setData({
       tableNum: str.tableNum,
       customerNum: str.customerNum
       
    }) 
    }
     
    /***订单页面传过来加菜信息 */

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
      //tableNum: 8
    })
    console.log("this.data.tableNum:" + this.data.tableNum);
    var open_res_Id = app.globalData.resId;
    this.setData({ 'open_res_Id': open_res_Id });
    var Detail = {};
    var goods = {};
    this.GetData();
    this.getFlag();
    /* goods = this.data.goods_msg.data[0].goods;
    this.processGoodsData(goods); */
    /*  this.processOrderList(this.data.goods_msg);  */
    /* this.setData({ goods: goods });  */
  },

  onShow: function () {
    console.log("onshow");
    var open_res_Id = app.globalData.resId;
    this.setData({ 'open_res_Id': open_res_Id });

  },
  /*Get local database */
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
  processGoodsData: function (goodsList) {
    var temp = {};
    var order_num = 0;
    var Goods = [];
    var goodLists = [];
    var specsList = [];
    console.log(goodsList.classifyName);
    var classifyName = goodsList.classifyname;
    var name = '';
    var totalname = '';
    for (var idx in goodsList.goods) {
      var goods = goodsList.goods;
      specsList = goods[idx].specs;
      for (var index in specsList) {
        totalname = goods[idx].name + '(' + specsList[index].name + ')';
        if (totalname.length > 8) {
          name = totalname.substring(0, 7);
          name = name + '..'
        } else {
          name = totalname;
        }
        temp = {
          id: goods[idx].id,
          name: name,
          totalname: totalname,
          brief: goods[idx].brief,
          classifyId: goods[idx].classifyId,
          imgUrl: app.globalData.imgDomain + goods[idx].imgUrl,
          status: goods[idx].status,
          specId: specsList[index].id,
          specName: specsList[index].name,
          price: specsList[index].price,
          vipPrice: specsList[index].vipPrice,
          sales: specsList[index].sales,
          soldout: specsList[index].soldout,
        }
        Goods.push(temp);
      }
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
  processServiceOrder(style, goodId, specId) {
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
          specId: specId,
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
          goodsId: goodId,
          specId: specId
        },
      }, function (res) {
        console.log(res);
        that.setData({
          orderLists: res.data,
        })
        that.processGoodsListOrder(res.data);
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
    for (var idx in data.goodsList) {
      if (data.goodsList[idx].commited == 0) {
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
    var that = this;
    console.log("goodsArray");
    console.log(goodsArray);
    if (goodsArray.length > 0) {
      for (var idx in goodsArray) {
        if (goodsArray[idx].commited == 0) {
          totalCount += goodsArray[idx].count
          console.log("totalCount");
          console.log(goodsArray[idx].count);
        }

      }
      that.setData({
        totalCount: totalCount
      })
    } else {
      that.setData({
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
    var specId = event.currentTarget.dataset.specid;
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
      //   console.log("afternum:" + num);
      //   console.log("afterclassIndex:" + classIndex)

      // var string = "Goods[0].goodLists[" + num + "].order_num";
      // var string = "Goods[" + num + "].order_num";
      /*  param[string] = this.data.Goods[0].goodLists[num].order_num - 1;
       this.setData(param); */
      /*获取用户点的菜数目 */
      /*   app.globalData.totalnum = app.globalData.totalnum - 1;
        totalnum = app.globalData.totalnum;
        this.setData({ 'totalnum': totalnum }); */

      /*获取分类点菜数目 */
      /* var class_param = {};
       var class_string = "class_Dish[" + classIndex + "]";
       class_param[class_string] = this.data.class_Dish[classIndex] - 1;
       this.setData(class_param);
       var string1 = "goods_msg.data[" + classIndex + "].goods[" + num + "].order_num"
       param1[string1] = this.data.goods_msg.data[classIndex].goods[num].order_num - 1;
       totalPrice = this.data.totalprice - this.data.goods_msg.data[classIndex].goods[num].price
       this.setData(param1);*/
      /*   this.setData({
           totalprice: totalPrice
         })*/
      var class_param = {};
      var class_string = "class_Dish[" + classIndex + "]";
      class_param[class_string] = this.data.class_Dish[classIndex] - 1;
      this.setData(class_param);
      /****退菜 */
      that.processServiceOrder(1, deldishId, specId);
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
    var specId = event.currentTarget.dataset.specid;
    console.log(adddishId);
    this.showInputSeat('close');
    var param = {};
    var param1 = {};
    var totalnum = 0;
    var totalPrice = 0;
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
      //var string = "Goods[0].goodLists[" + num + "].order_num";
      /*获取每道菜下单数目 */
      /*  param[string] = this.data.Goods[0].goodLists[num].order_num + 1;
        this.setData(param);
        var string1 = "goods_msg.data[" + classIndex + "].goods[" + num + "].order_num";
        console.log(string1);
        param1[string1] = this.data.goods_msg.data[classIndex].goods[num].order_num + 1;
        totalPrice = this.data.totalprice + this.data.goods_msg.data[classIndex].goods[num].price;
        this.setData(param1);*/
      //   this.setData({
      //     totalprice: totalPrice
      //   })
      /***点菜 */
      that.processServiceOrder(0, adddishId, specId);
      /*同步菜单列表 */
      //  this.processOrderList(this.data.goods_msg);
      /*获取用户点的菜数目 */
      // app.globalData.totalnum = app.globalData.totalnum + 1;
      //  totalnum = app.globalData.totalnum;
      //   this.setData({ 'totalnum': totalnum });
      /*获取分类点菜数目 */
      var class_param = {};
      var class_string = "class_Dish[" + classIndex + "]";
      class_param[class_string] = this.data.class_Dish[classIndex] + 1;
      this.setData(class_param);

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
 
onImgTap: function (e) {
    var imgId = e.currentTarget.dataset.imgid;
    var soldout = e.currentTarget.dataset.soldout;
    var specId = e.currentTarget.dataset.specid;
    console.log("specId");
    console.log(specId);
    if (soldout == 0) {
      this.setData({
        popFlag: 0
      })
      var temp = {};
      for (var idx in this.data.Goods[0].goodLists) {
        if (this.data.Goods[0].goodLists[idx].id == imgId && this.data.Goods[0].goodLists[idx].specId == specId) {
          temp = {
            id: imgId,
            specId: this.data.Goods[0].goodLists[idx].specId,
            name: this.data.Goods[0].goodLists[idx].name,
            totalname: this.data.Goods[0].goodLists[idx].totalname,
            sales: this.data.Goods[0].goodLists[idx].sales,
            price: this.data.Goods[0].goodLists[idx].price,
            vipPrice: this.data.Goods[0].goodLists[idx].vipPrice,
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
      duration: 25, //动画时长 
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

  onOderManegeTap: function (e) {
    wx.redirectTo({
      url: '../ordermanager/ordermanager',
    })
  },
  onMyTap: function (e) {
    wx.redirectTo({
      url: '../my/my',
    })
  },
  getFlag: function (e) {
    var role = wx.getStorageSync('role');
    if (role == '0') {
      this.setData({
        funcFlag: '报表'
      })
    } else {
      this.setData({
        funcFlag: '点餐'
      })
    }
  },
  /****input */
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  hideInput: function () {
    console.log("hideInput");
    this.setData({
      inputShowed: false,
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var goodsId = e.detail.value;
    var that = this;
    this.setData({
      inputVal: goodsId,
    })
    if (goodsId != null && goodsId != '') {
      that.findByIdOrcode(goodsId);//
    }
    this.setData({ 
       inputShowed: false,
       inputVal: "",
      })
  },
  onChangeShowState: function () {
    console.log("onChangeShowState");
    var that = this;
    that.setData({
      showCategory: (!that.data.showCategory),
    })
  },
  showInput: function () {
    console.log("onChangeShowState");
    this.setData({
      inputShowed: true
    });
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
      // this.getGoodsList(this.data.orderList);
      // let Test = this.data.GoodsList;
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
        /* that.setData({
          orderId: res.data.id,
          orderMsg: res.data
        }); */

        /**订单提交后转到订单页面 */
        paymsg = that.getPaymentMsg();
        let str = JSON.stringify(paymsg);
        that.setData({
          orderStatus: '0',
        })
        /*订单提交后清空列表 */
        //  that.clearUpCart(that.data.goods_msg, that.data.Goods);
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
  findByIdOrcode: function (goodsId) {
    console.log("goodsId=" + goodsId);
    var imgId = goodsId;
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
    console.log(temp);
    this.showInputSeat('open')
  },
})