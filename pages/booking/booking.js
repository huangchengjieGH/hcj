// pages/booking/booking.js
var postsdatabase = require('../../data/posts-data.js');
var resdatabase = require('../../data/data.js');
var goodsdatabase = require('../../data/goods.js');
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
    /*总价格 */
    totalprice: 0,
    /*点击购物车显示菜单列表 */
    showcartList: false,
    /*记录用户动作状态 */
    actionflag: '请点餐',
    open_res_Id: null,
    tableNum:null,
    customerNum: null,
    orderId:'',
    showModalStatus: false,
    orderStatus:'0',
    orderMsg:'',
    cashPay:false,
    detailDish:{},
    popFlag: 1,
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
      this.setData({
      tableNum: tableNum
    })  
     console.log("this.data.tableNum:" + this.data.tableNum);
    var open_res_Id = app.globalData.resId;
    this.setData({ 'open_res_Id': open_res_Id });
    var Detail = {};
    var goods = {};
    this.GetData();
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
    
   
    /*获取商家信息 */
    res_msg = resdatabase.Data_List[0];
    /*获取商品信息 */
    util.requestByLogin({
      url: app.globalData.domain + '/wx/goods',
      method: 'GET',
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
      that.processGoodsMsgData(ServiceGoodsMsg);
      /* goods = this.data.goods_msg.data[0].goods; */
      // console.log(that.data.goods_msg.data[0].goods);
      that.processGoodsData(that.data.goods_msg.data[0].goods);
      that.processOrderList(that.data.goods_msg);
      that.setData({ classify: ServiceGoodsMsg.data[0].classifyName });
      //console.log('hahaha');
      console.log(res.extra.seller.payType);
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

    }, function () {
      console.log("Error:function GetData")
      wx.hideToast();
    }
    );


    this.setData(
      {
        res_msg: res_msg,
      },
    );
    this.setData(
      {
        stars: util.convertToStarsArray(this.data.res_msg.message.score),
        score: this.data.res_msg.message.score
      })
  /*从服务器获取数据 结构一致，到时可以直接替换goods_msg*/
   /*   wx.request({
      url: "http://restaurant.wegtech.cn/wx/goods?token=1234567",
      method: 'GET',
      header: {
        'content-type': 'application/xml'
      },
      success: function (res) {
      //   console.log(res.data) 
         ServiceGoodsMsg = res.data;
         that.setData({
          ServiceGoodsMsg: ServiceGoodsMsg
        })
      }
    });  */
  /*   util.requestByLogin({
      url: app.globalData.domain + '/wx/goods',
      method: 'GET',
      header: {
        'content-type': 'application/xml'
      },
    }, function (res) {
    //   console.log("res")
    //  console.log(res); 
      ServiceGoodsMsg = res;
      that.setData({
        ServiceGoodsMsg: ServiceGoodsMsg
      })
    }, function () {
      console.log("error")
      wx.hideToast();
    }
    ); */
  },
  /* */
  processGoodsData: function (goods) {
    var temp = {};
    var order_num = 0;
    var Goods = [];
    for (var idx in goods) {
      temp = {
        id: goods[idx].id,
      /*   classifyName: goods[idx].classifyName, */
        name: goods[idx].name,
        isHot: goods[idx].isHot,
        seq: goods[idx].seq,
        brief: goods[idx].brief,
        price: goods[idx].price,
        sales: goods[idx].sales,
        imgUrl: goods[idx].imgUrl,
        status: goods[idx].status,
        taste: goods[idx].taste,
        order_num: goods[idx].order_num,
      }
      Goods.push(temp);
    }
    this.setData(
      {
        Goods: Goods
      }
    )
  },
  /* goodsmsg添加order_num字段*/
  processGoodsMsgData: function (goods_msg) {
    var temp = {};
    var order_num = 0;
    var data = [];
    var goods = [];
    var order_num = 0;
    var status = goods_msg.status;
    var msg = goods_msg.msg;
    var extra = goods_msg.extra;
    for (var idx in goods_msg.data) {
      var subject = goods_msg.data[idx];
      var classifyName = goods_msg.data[idx].classifyName;
      for (var idx2 in goods_msg.data[idx].goods) {
        var subject2 = goods_msg.data[idx].goods[idx2]
        temp = {
          classifyName: classifyName,
          id: subject2.id,
          name: subject2.name,
          isHot: subject2.isHot,
          seq: subject2.seq,
          brief: subject2.brief,
          price: subject2.price,
          sales: subject2.sales,
          imgUrl: subject2.imgUrl,
          status: subject2.status,
          taste: subject2.taste,
          order_num: order_num,
        }
        goods.push(temp);

      }
      temp = {};
      var temp2 = {
        classifyName: classifyName,
        goods: goods,
      }
      data.push(temp2);
      //清空 
      temp2 = {};
      goods = [];
    }
    var readyData = {
      status: status,
      msg: msg,
      data: data,
      extra: extra,
    };
    //清空
    data = [];
    this.setData({
      goods_msg: readyData
    })
  },
  /*获取已点菜单 */
  processOrderList: function (goods_msg){
    var temp={};
    var orderList= [];
    for (var idx in goods_msg.data) {
      var subject = goods_msg.data[idx];
      for (var idx2 in subject.goods) {
        var subject2 = subject.goods[idx2]
        if (subject2.order_num>0)
        {
           temp = {
             id: subject2.id,
             name:subject2.name,
             price: subject2.price,   
             order_num: subject2.order_num
           }
           orderList.push(temp);
           temp={};
        }
      }
    }
     this.setData({
       orderList: orderList
     })
  },
  /*清空购物车 */
  clearUpCart: function (goods_msg,Goods) {
    /*  var that = this;   */
    var structureString = '';
    var structureString2 = '';
    var param = {};
    var param2 = {};
    for (var idx in goods_msg.data) {
      for (var idx2 in goods_msg.data[idx].goods) {
        if (goods_msg.data[idx].goods[idx2].order_num > 0) {
          structureString = "goods_msg.data[" + idx + "].goods[" + idx2 + "].order_num";
          param[structureString] = 0;
          this.setData(param);
        }
      }
    }
    for (var idx3 in Goods){
      console.log("Test");
      if (Goods[idx3].order_num>0){
        console.log(Goods[idx3].order_num);
        structureString2 = "Goods["+idx3+"].order_num";
        console.log(structureString2);
        param2[structureString2] = 0;
        this.setData(param2);
      }
    }
  },
/*获取订单列表，反馈服务器 */
  getGoodsList: function (orderList){
    var temp = {};
    var temp2 = {};
    var goodsList = [];
    for (var idx in orderList) {
      var subject = orderList[idx]
      temp = {
        goodsId: subject.id,
        count: subject.order_num,
      }
      goodsList.push(temp);
      temp = {};
    }
   /*   temp2 = {
      tableNum: 'A40',
      goodsList: goodsList
    }  */
    this.setData({
      "GoodsList": goodsList
    })
  },
  /****getDishlocation */
  getDishlocation: function (goods_msg, adddishId){
    var flag = false;
    for (var idx in goods_msg.data) {
      var subject = goods_msg.data[idx];
      var classIndex2 = idx;
      for (var idx2 in goods_msg.data[idx].goods) {
        var num2 = idx2
        var subject2 = goods_msg.data[idx].goods[idx2]
        if (adddishId == subject2.id) {
          flag = true;
          break;
        }
      }
      if (flag){
        break;
      }
    }
    console.log("afternum:" + num2);
    console.log("afterclassIndex:" + classIndex2)
  },
  /*click the classify button */
  onclassiTap: function (event) {
    var buttonId = event.currentTarget.dataset.buttonid;
    console.log("buttonId:" + buttonId);
    var index;

    for (var idx in this.data.res_msg.message.classification) {
      if (this.data.goods_msg.data[idx].classifyName == buttonId) {
        index = idx;
        break;
      }
    };
    switch (index) {
      case "0":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[0].goods);
        /*   this.setData({
            'goods': this.data.goods_msg.data[0].goods
          }) */
        break;
      case "1":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[1].goods);
        /*  this.setData({
           'goods': this.processGoodsData(this.data.goods_msg.data[1].goods);
         }) */
        break;
      case "2":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[2].goods);
        /* this.setData({
          'goods': this.data.goods_msg.data[2].goods
        }) */
        break;
      case "3":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[3].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[3].goods
        }) */
        break;
      case "4":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[4].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[4].goods
        }) */
        break;
      case "5":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[5].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[5].goods
        }) */
        break;
      case "6":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[6].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[6].goods
        }) */
        break;
      case "7":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[7].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[7].goods
        }) */
        break;
      case "8":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[8].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[8].goods
        }) */
        break;
      case "9":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[9].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[9].goods
        }) */
        break;
      case "10":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[10].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[10].goods
        }) */
        break;
      case "11":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[11].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[11].goods
        }) */
        break;
      case "12":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[12].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[12].goods
        }) */
        break;
      case "13":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[13].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[13].goods
        }) */
        break;
      case "14":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[14].goods);
        /*  this.setData({
         'goods': this.data.goods_msg.data[14].goods
         }) */
        break;
      case "15":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[15].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[15].goods
        }) */
        break;
      case "16":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[16].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[16].goods
        }) */
        break;
      case "17":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[17].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[17].goods
        }) */
        break;
      case "18":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[18].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[18].goods
        }) */
        break;
      case "19":
        this.setData({ 'classify': buttonId }),
          this.processGoodsData(this.data.goods_msg.data[19].goods);
        /* this.setData({
        'goods': this.data.goods_msg.data[19].goods
        }) */
        break;
      default:
        break;
    };
  },
  /*click the button to del the ordered dish */
  DelDishTap: function (event) {
    var deldishId = event.currentTarget.dataset.deldishid;
  /*   console.log(deldishId); */
   /*  var num = deldishId.toString().substring(4);
    var classIndex = deldishId.toString().substring(0, 1); */
    var param = {};
    var param1 = {};
    var totalnum = 0;
    var totalPrice = 0;
/*     num = num - 1;
    classIndex = classIndex - 1; */
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
    console.log("afternum:" + num);
    console.log("afterclassIndex:" + classIndex)

    var string = "Goods[" + num + "].order_num";
    param[string] = this.data.Goods[num].order_num - 1;
    this.setData(param);
    /*获取用户点的菜数目 */
    app.globalData.totalnum = app.globalData.totalnum - 1;
    totalnum = app.globalData.totalnum;
    this.setData({ 'totalnum': totalnum });

    /*获取分类点菜数目 */
    var class_param = {};
    var class_string = "class_Dish[" + classIndex + "]";
    class_param[class_string] = this.data.class_Dish[classIndex] - 1;
    this.setData(class_param);
    var string1 = "goods_msg.data[" + classIndex + "].goods[" + num + "].order_num"
    param1[string1] = this.data.goods_msg.data[classIndex].goods[num].order_num - 1;
    totalPrice = this.data.totalprice - this.data.goods_msg.data[classIndex].goods[num].price
    this.setData(param1);;
    this.setData({
      totalprice: totalPrice
    })
    /*同步菜单列表 */
    this.processOrderList(this.data.goods_msg); 
    /*改变状态*/
    if (totalnum == 0) {
      this.setData({
         'actionflag': '请点餐',
         'showcartList': false})
    } else {
      this.setData({ 'actionflag': '选好了' })
    }
    }
  },

  /*click the button to add the  dish */
  AddDishTap: function (event) {
    var that = this;
    var adddishId = event.currentTarget.dataset.adddishid;
     /* var num = adddishId.toString().substring(4);
    var classIndex = adddishId.toString().substring(0, 1);  */
    var param = {};
    var param1 = {};
    var totalnum = 0;
    var totalPrice=0;
    /* num = num - 1;
    classIndex = classIndex - 1; */
     /* console.log("beforenum:" + num);
    console.log("beforeclassIndex:" + classIndex);  */
    /*****获取 num classIndex */
   /*  this.getDishlocation(this.data.goods_msg, adddishId); */
    var flag = false;
    if (this.data.orderStatus == '0') {
    var goodsMsg = this.data.goods_msg.data;
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
    //console.log("afternum:" + num);
    //console.log("afterclassIndex:" + classIndex)

    var string = "Goods[" + num + "].order_num";
    /* console.log(string); */
    /*获取每道菜下单数目 */
    param[string] = this.data.Goods[num].order_num + 1;
    this.setData(param);
    var string1 = "goods_msg.data[" + classIndex + "].goods[" + num + "].order_num"
    param1[string1] = this.data.goods_msg.data[classIndex].goods[num].order_num + 1;
    totalPrice = this.data.totalprice + this.data.goods_msg.data[classIndex].goods[num].price;
    this.setData(param1);
    this.setData({
      totalprice: totalPrice
    })
   /*同步菜单列表 */
     this.processOrderList(this.data.goods_msg); 
    /*获取用户点的菜数目 */
    app.globalData.totalnum = app.globalData.totalnum + 1;
    totalnum = app.globalData.totalnum;
    this.setData({ 'totalnum': totalnum });
    /*获取分类点菜数目 */
    var class_param = {};
    var class_string = "class_Dish[" + classIndex + "]";
    class_param[class_string] = this.data.class_Dish[classIndex] + 1;
    this.setData(class_param);

    /*改变状态*/
    if (totalnum == 0) {
      this.setData({ 'actionflag': '请点餐' })
    } else {
      this.setData({ 'actionflag': '选好了' })
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
      paymsg = this.getPaymentMsg();
      let str = JSON.stringify(paymsg);
      this.setData({
        orderStatus: '0',
      })
      wx.navigateTo({
        url: '../pay/pay?str=' + str
      })

      
    }
  },

  getPaymentMsg:function(event){
    var temp = {
      name:this.data.resMsg.seller.name,
      imgUrl:this.data.resMsg.seller.imgUrl,
      orderList:this.data.orderList,
      orderMsg:this.data.orderMsg,
      cashPay: this.data.cashPay
    }
    //console.log(temp);
    return temp;
  },
  /*点击了清空，清空购物车 */
  onOrderListTap:function(event){
    if (this.data.orderStatus == '0'){
      this.clearUpCart(this.data.goods_msg, this.data.Goods);
      /*全局变量统计点菜数量，清0 */
      app.globalData.totalnum = 0;
      this.setData({
        orderList: [],
        totalnum: 0,
        totalprice: 0,
        showcartList: false,
        class_Dish: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      })
   }
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
  onResTap:function(event){
   /*  console.log(app.globalData.resId) */
    var shopmsg={
     imgUrl:this.data.resMsg.seller.imgUrl,
     name:this.data.resMsg.seller.name,
     score:'5.0',
     phone: this.data.resMsg.seller.phone,
     address:this.data.resMsg.seller.address,
     worktime:'11:00-14:30 17:00-22:00'
   }
    let str = JSON.stringify(shopmsg);
   console.log(shopmsg);
    wx.navigateTo({
     url: '../shopmsg/shopmsg?str=' + str,
   }) 
  },
/*   seatInput: function (e) {
    var that = this;
    console.log(e.detail.value);
     if (e.detail.value != ''){
     that.setData({
       tableNum: e.detail.value,
    }) 

    } 
  }, */
  costomerNumInput: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value != '') {
      that.setData({
        tableNum: e.detail.value,
      })

    }
  },
  
  onImgTap:function(e){
    var imgId = e.currentTarget.dataset.imgid;
    var temp = {};
    console.log('点击了' + imgId);
    for(var idx in this.data.Goods){
      if (this.data.Goods[idx].id == imgId){
        temp={
          name: this.data.Goods[idx].name,
          sales:this.data.Goods[idx].sales,
          price:this.data.Goods[idx].price,
          imgUrl:this.data.Goods[idx].imgUrl
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
  powerDrawer: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.showInputSeat(currentStatu);
/*     if (this.data.tableNum != '' && this.data.tableNum != null){
      this.setData({
        orderStatus:'1'
      })

      this.setData({ 'actionflag': '结账' })
      this.getGoodsList(this.data.orderList);
      let Test = this.data.GoodsList;
      wx.showLoading(
        {
          title: "处理中"
        }
      )

      util.requestByLogin({
        url: app.globalData.domain + '/wx/order',
        method: 'POST',
        data: {
          tableNum: that.data.tableNum,
          goodsList: Test
        },
      }, function (res) {
        console.log(res);
        wx.hideToast();
        that.setData({ 
          orderId: res.data.id ,
          orderMsg: res.data});
      }, function () {
        console.log("Error: function:powerDrawer")
        wx.hideToast();
      }
      );
    } */
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
    if (that.data.tableNum != null && that.data.tableNum != '' && !this.data.cashPay && that.data.customerNum != '') {

      this.setData({
        'actionflag': '结账',
        orderStatus: '1'
      })
      this.getGoodsList(this.data.orderList);
      let Test = this.data.GoodsList;
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
      }, function () {
        console.log("Error: function onactionTap")
        wx.hideToast();
      }
      );
    }
    else {
      console.log("seat is null");
      /* if (that.data.totalnum > 0 && !that.data.cashPay) {
        that.showInputSeat('open')
      } */
    }
    //屏蔽结帐功能场景
    if (that.data.tableNum != null && that.data.tableNum != '' && that.data.cashPay && that.data.customerNum != '') {
      that.setData({
        orderStatus: '1'
      })
      that.getGoodsList(that.data.orderList);
      let Test = that.data.GoodsList;
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
        that.clearUpCart(that.data.goods_msg, that.data.Goods);
        /*全局变量统计点菜数量，清0 */
        app.globalData.totalnum = 0;
        that.setData({
          orderList: [],
          totalnum: 0,
          totalprice: 0,
          showcartList: false,
          class_Dish: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        })
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
  }

})