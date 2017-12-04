// pages/homepage/homepage.js
var postsdatabase = require('../../data/posts-data.js');
var resdatabase = require('../../data/data.js');
var util = require('../../utils/util.js');
var bmap = require('../../libs/bmap-wx/bmap-wx.min.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    HotRes:{},
    kd:"n5YQsyVbgiAqumkwvfzybGj7DjKMstlQ",
   markers : [],
   longitude: '',   //经度  
   latitude: '',    //纬度  
   address: '',     //地址  
   cityInfo: {},     //城市信息  
   chooseCity:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      posts_key: postsdatabase.postList
    });
    /* this.processResData("HotRes","附近热门"); */
    this.getHotResData("hotRes");
    this.located();
    this.getServiceResData();
    console.log("onLoad")
  },
  /* get data from service */
  getHotResData: function (settedKey) {
    var hotRes = [];
    var resData = {};
    var tempResData = {};
    resData = resdatabase.Data_List;
    console.log("resData");
    console.log(resData);
    for (var idx in resData) {
      var subject = resData[idx];
      if (subject.message.isHot == 1) {
        var temp = {
          resId: subject.message.resId,
          isHot: subject.message.isHot,
          name: subject.message.name,
          imgUrl: subject.message.imgUrl,
          score: subject.message.score,
          category: subject.message.category,
          perConsume: subject.message.perConsume,
          distance: subject.message.distance,
          discount: subject.message.discount,
          describe: subject.message.describe,
          classification: subject.message.classification,
          stars: util.convertToStarsArray(subject.message.score),
        }
        var status = subject.status;
        var msg = subject.msg;
        var extra = subject.extra;
        tempResData = {
          status: status,
          msg: msg,
          message: temp,
          extra: extra,
        }
        hotRes.push(tempResData);
        tempResData = {};
      }
    }
    this.setData({ hotRes: hotRes });
  },
  getServiceResData: function (event) { 
    var that = this;
    /*获取商品信息 */
    util.requestByLogin({
      url: app.globalData.domain + '/wx/goods',
      method: 'GET',
      header: {
        'content-type': 'application/xml'
      },
    }, function (res) {
      console.log("Service data:")
      console.log(res);
      that.processServiceData(res.extra);
    }, function () {
      console.log("Error:function GetData")
    }
    );
  },

  processServiceData:function(res){
    var temp = {
      resId: res.seller.id,
      isHot: '1',
      name: res.seller.name,
      imgUrl: res.seller.imgUrl,
      score: '5',
      category: '粤菜',
      perConsume: res.seller.consumption,
      distance: '100',
      discount: '会员享受8折优惠',
      describe: '鸡公煲是重庆烧鸡公...',
      stars: util.convertToStarsArray('5'),
    }
    this.setData({ shotRes: temp });
  },
  /*Get the local database data and process the data */
  processResData: function (settedKey, categoryTitle) {
    var resDataArray = [];
    var resData={};
    resData = postsdatabase.postList;
   /* console.log(resData);*/
    for (var idx in resData){
      var title = resData[idx].title;
      var temp={
        PostId: resData[idx].message.PostId,
        name: resData[idx].message.name,
        res_image: resData[idx].message.res_image,
        score: resData[idx].message.score,
        category: resData[idx].message.category,
        per_consume: resData[idx].message.per_consume,
        distance: resData[idx].message.distance,
        describe: resData[idx].message.discount,
        stars: util.convertToStarsArray(resData[idx].message.score),
      }
      resDataArray.push(temp);
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      resDataArray: resDataArray
    };
    this.setData(readyData);
   /*  console.log(readyData); */
  },
  /* click search button*/
  bindFocus: function () {
    wx.navigateTo({
      url: './search/search'
    })
  },
  /* click the location buton */
  searchLocation: function () {
    /* console.log("点击了位置") */
    /* let str = JSON.stringify(this.data.markers); */
    wx.navigateTo({
      /* url: 'pages/booking/booking?id=' + resId  */
      /* url: '../choosecity/choosecity?id=' + this.data.cityInfo.city */
     url: '../choosecity/choosecity'

    })
  },
  //click the res img
  onResTap:function(event){
   var resId = event.currentTarget.dataset.resid;
   console.log("resId:"+resId)
    app.globalData.resId = resId;
    console.log("homapage:" + app.globalData.resId);  
   wx.switchTab ({
     url: '../booking/booking'

   })  
  },
  /**点击了扫一扫 */
  onScanCodeTap: function (event) {
    console.log("点击了扫码")
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res.path)
        this.setData({
          res: res.result
        })
      }
    })
  },
   /*  console.log("点击了排队取号"); */
  onlineupTap: function(event) {
    wx.navigateTo({
      /* url: 'pages/booking/booking?id=' + resId  */
      url: '../lineup/lineup'

    })
  },
  onreserveTap: function (event) {
   /*  console.log("点击了预约订座"); */
    wx.navigateTo({
      /* url: 'pages/booking/booking?id=' + resId  */
      url: '../reservation/reservation'

    }) 
  },
  /***定位函数 */
  located:function(){
    var that = this;
    var wxMarkerData = []; //定位成功回调对象
    /* var kd = "n5YQsyVbgiAqumkwvfzybGj7DjKMstlQ"; */
     /*** 定位*/
     var BMap = new bmap.BMapWX({
       ak: that.data.kd
     });
     var fail = function (data) {
       console.log(data);
     };
     var success = function (data) {
       /* console.log(data); */
       wxMarkerData = data.wxMarkerData; 
       that.setData({
         markers: wxMarkerData,
         latitude: wxMarkerData[0].latitude,
         longitude: wxMarkerData[0].longitude,
         address: wxMarkerData[0].address,
         cityInfo: data.originalData.result.addressComponent  
       })
       that.setData({
         chooseCity:that.data.cityInfo.city
       })
       app.globalData.city = that.data.cityInfo.city;
       app.globalData.locatedCity = that.data.cityInfo.city;
     }
     // 发起regeocoding检索请求   
     BMap.regeocoding({
       fail: fail,
       success: success
     }); 
  },
  onShow: function () {
    this.setData({
      chooseCity: app.globalData.city
    })
  },

})