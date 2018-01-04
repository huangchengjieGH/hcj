// pages/nearby/nearby.js
var cityData = require('../../utils/util.js');
//var postsdatabase = require('../../data/posts-data.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   shownavIndex:'',
   nearbyOpen:false,
   nearbyShow:true,
   totalOpen:false,
   totalShow:true,
   sortOpen:false,
   sortShow:true,
   filterOpen:false,
   filterShow:true,
   currentCity:{},
   cityright: {},
   showright:false,
   DishClass:{
     title:'全部菜系',
     Dish:['川湘菜','江浙菜','粤菜','东北菜','云贵菜','客家菜','其他'],
   },
   Sorting:{
     title:'智能排序',
     sorting:['距离最近','人气最高']
   },
   Filter:{
    title:'人均消费',
    filter:['￥100以下','￥100-200','￥200以上']
   }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.processNearbyData('NearbyData');
    this.getTargetCity();
  },
  /*Get the local datanase data and process the nearby data */
  processNearbyData: function (settedKey) {
    var resDataArray = [];
    var resData = {};
    resData = postsdatabase.postList;
     console.log(resData);
     for (var idx in resData) {
      var title = resData[idx].title;
      var temp = {
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
      resDataArray: resDataArray
    };
    this.setData(readyData);
  },
  /*获取当前定位城市，由于数据结构不适合，暂时先获取省份城市 */
   getTargetCity(event){
     var currentCity=this.data.cityleft.广东省;
     this.setData({
       currentCity: currentCity
     })
   },
  /*点击了附近 */
  OnlistNearby: function (event) {
    /*  var shownavIndex = event.currentTarget.dataset.nav;  */
    if (this.data.nearbyOpen) {
      this.setData({
        nearbyOpen: false,
        nearbyShow: true,
        totalOpen: false,
        totalShow: true,
        sortOpen: false,
        sortShow: true,
        filterOpen: false,
        filterShow: true,
        shownavIndex: 0
      })
    } else {
      this.setData({
        nearbyOpen: true,
        nearbyShow: false,
        totalOpen: false,
        totalShow: true,
        sortOpen: false,
        sortShow: true,
        filterOpen: false,
        filterShow: true,
        showright: false,
         shownavIndex: event.currentTarget.dataset.nav, 
        
      })
    }

  },
  /*点击了全部菜系 */
  OnlistTotal: function (event) {
    /*  var shownavIndex = event.currentTarget.dataset.nav;  */
    if (this.data.totalOpen) {
      this.setData({
        nearbyOpen: false,
        nearbyShow: true,
        totalOpen: false,
        totalShow: true,
        sortOpen: false,
        sortShow: true,
        filterOpen: false,
        filterShow: true,
        shownavIndex: 0
      })
    } else {
      this.setData({
        nearbyOpen: false,
        nearbyShow: true,
        totalOpen: true,
        totalShow: false,
        sortOpen: false,
        sortShow: true,
        filterOpen: false,
        filterShow: true,
        shownavIndex: event.currentTarget.dataset.nav,

      })
    }

  },
  /*点击了智能排序 */
  OnlistSorting: function (event) {
    /*  var shownavIndex = event.currentTarget.dataset.nav;  */
    if (this.data.sortOpen) {
      this.setData({
        nearbyOpen: false,
        nearbyShow: true,
        totalOpen: false,
        totalShow: true,
        sortOpen: false,
        sortShow: true,
        filterOpen: false,
        filterShow: true,
        shownavIndex: 0
      })
    } else {
      this.setData({
        nearbyOpen: false,
        nearbyShow: true,
        totalOpen: false,
        totalShow: true,
        sortOpen: true,
        sortShow: false,
        filterOpen: false,
        filterShow: true,
        shownavIndex: event.currentTarget.dataset.nav,

      })
    }

  },
  /*点击了筛选 */
  OnlistFilter: function (event) {
    /*  var shownavIndex = event.currentTarget.dataset.nav;  */
    if (this.data.filterOpen) {
      this.setData({
        nearbyOpen: false,
        nearbyShow: true,
        totalOpen: false,
        totalShow: true,
        sortOpen: false,
        sortShow: true,
        filterOpen: false,
        filterShow: true,
        shownavIndex: 0,
        select: '',
      })
    } else {
      this.setData({
        nearbyOpen: false,
        nearbyShow: true,
        totalOpen: false,
        totalShow: true,
        sortOpen: false,
        sortShow: true,
        filterOpen: true,
        filterShow: false,
        shownavIndex: event.currentTarget.dataset.nav,

      })
    }
  },
  /*选择商圈 */
  onselectleft:function(event){
    console.log(event.currentTarget.dataset.city);
    console.log(event.target.dataset.city);
    this.setData({
      cityright: this.data.currentCity[event.currentTarget.dataset.city],
      select: event.target.dataset.city,
      showright:true
    });
  },

  onselectright: function (event){
      var select= event.target.dataset.city;
  }

})