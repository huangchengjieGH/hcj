let wxCharts = require('../../libs/wxcharts/wxcharts.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '0',
    chartData: ['2012/09', '2013/09', '2014/09', '2015/09', '2016/09', '2017/09', '2018/09', '2019/09'],
    chartValue: [15, 20, 45, 37, 4, 80, 78, 90],
    totalPrice: '0',
    iconsShow: false,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.formatDate();
    this.getServiceTurnOverData();
    this.getTodaySituationData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getServiceTurnOverData: function (e) {
    var that = this;
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/report/turnover',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        begindate: that.data.beginDate,
        enddate: that.data.endDate,
        status: 0
      },
    }, function (res) {
      console.log(res.data);
    /*    that.setData({
        "turnOverData" : res.data
      })  */
      that.processTurnOverData(res.data)
      wx.hideToast();

    }, function () {
      console.log("Error: function onactionTap")
      wx.hideToast();
    }
    );
  },
  getTodaySituationData: function (e) {
    var that = this;
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/report/todaysituation',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        date: that.data.today,
      },
    }, function (res) {
      /* console.log("situation");
      console.log(res); */
  /*     that.setData({
        'todaySituation':res.data
      }) */
      that.processTodaySituationData(res.data);
      /*    that.setData({
          "turnOverData" : res.data
        })  */
      wx.hideToast();

    }, function () {
      console.log("Error: function getTodaySituationData")
      wx.hideToast();
    }
    );
  }, 
  processTurnOverData:function(data){
    var sum = 0.0;
    var chartData = [];
    var chartValue = [];
    var turnOverList = [];
    var temp={};
    var date;
    var count = 0;
    var time;
    for(var idx in data){
      //date = data[idx].date.toString().substring(5, 10);
      date = util.formatTime(new Date(data[idx].date)); 
      time = date.toString().substring(0, 10).split('/').join('-');  
      date = date.toString().substring(5, 10).split('/').join('-');
      temp = {
        id: data[idx].id,
        date:date,
        time: time,
        turnover: data[idx].turnover,
        orderNum: data[idx].orderNum,
        customerNum: data[idx].customerNum,
      }
      chartData.push(date);
      chartValue.push(data[idx].turnover);
      sum += data[idx].turnover;
      ++count;
      turnOverList.push(temp);
      temp = {};
    }
    this.setData({
      "totalPrice":sum,
      "chartData": chartData,
      "chartValue": chartValue,
      "count":count,
      "turnOverList": turnOverList,
    })
  },
  processTodaySituationData: function (data) {
    var donePrice = 0.0;
    var undonePrice = 0.0;
    var totalOrder = 0;
    var undoneOrder = 0;
    var totalCustomerNum = 0;
    var customerNuming = 0;
    var todaySituation = {};
    for (var idx in data){
      if (data[idx].status == 0){
        donePrice = data[idx].orderprice;
        totalCustomerNum += data[idx].customerNum;
        totalOrder += data[idx].orderNum;
      } 
      if (data[idx].status == 1){
        undonePrice = data[idx].orderprice;
        totalCustomerNum += data[idx].customerNum;
        undoneOrder += data[idx].orderNum;
        customerNuming = data[idx].customerNum;
      }
    }
    todaySituation = {
      'donePrice': donePrice,
      'undonePrice': undonePrice,
      'totalOrder': totalOrder,
      'undoneOrder': undoneOrder,
      'totalCustomerNum': totalCustomerNum,
      'customerNuming': customerNuming
    },
    this.setData({
      todaySituation: todaySituation
    })
  },
  powerConfirm: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.showInputSeat(currentStatu);
  },
  powerDrawer: function (e) {
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
  ontimeTap: function (event) {
    var timeId = event.currentTarget.dataset.id;
    console.log(timeId);
    wx.navigateTo({
       url: '../dailyorder/dailyorder?timeId=' + timeId, 
      //url: '../hcj/hcj?timeId=' + timeId,
    })
  },
  onRankTap: function (event) {
    var dateMsg = {};
    dateMsg = this.getDateMsg();
    let str = JSON.stringify(dateMsg);
    console.log(str);
    wx.navigateTo({
      url: '../ranking/ranking?str=' + str,
    })
  },
  getDateMsg: function (event) {
    var temp = {
      beginDate: this.data.beginDate,
      endDate: this.data.endDate
    }
    //console.log(temp);
    return temp;
  },
  weCharts: function (canvasId,chartType) {
    new wxCharts({
      canvasId: canvasId,
      type: chartType,
      categories: this.data.chartData,
      series: [{
        name: '营业额',
        data: this.data.chartValue
      }, /* {
name: '成交量2',
data: [70, 40, 65, 100, 34, 18,67,90]
} */],
      yAxis: {
        format: function (val) {
          return val;
        }
      },
      width: 320,
      height: 200
    });
  },
  formatDate: function (event) {
    const date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var beginDate = "";
    console.log(date.getDate());
    console.log(date.getMonth() + 1);
    if(month < 10){
      month = '0' + month;
    }
    if(day < 10){
      day = '0' +day;
    }
    beginDate = year + '-' + month + '-' + day;
    this.setData({
      "beginDate": beginDate,
      "endDate": beginDate,
      "today": beginDate
    });
    /* console.log(start_date); */
  },
  onBeginDateTap: function (e) {
    var dates = e.detail.value;
    // dates = dates.toString().substring(5);
    dates = dates.toString();
    console.log(dates)
    this.setData({
      beginDate: dates,
    })
  },
  onEndDateTap: function (e) {
    var dates = e.detail.value;
    // dates = dates.toString().substring(5);
    dates = dates.toString();
    console.log(dates)
    this.setData({
      endDate: dates,
    })
  },
  onSearchTap: function (event) {
    console.log('点击了查询');
    this.getServiceTurnOverData();
  },
  onColumnTap: function (e) {
    this.setData({
      canvas: 'columnCanvas'
    })
    var currentStatu = e.currentTarget.dataset.id;
    var length = this.data.turnOverList.length;
    this.showInputSeat(currentStatu);
    if (length>0){
      this.weCharts('columnCanvas', 'column');
    }
    
  },
  onLineTap: function (e) {
    this.setData({
      canvas: 'lineCanvas'
    })
    var currentStatu = e.currentTarget.dataset.id;
    var length = this.data.turnOverList.length;
    this.showInputSeat(currentStatu);
    if (length > 0) {
    this.weCharts('lineCanvas', 'line'); 
    }
  },
/*   onReportTap: function (e) {
    console.log('report')
    wx.redirectTo({
      url: '../report/report',
    })
  }, */
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
  onAddTap:function(e){
    var iconsShow = !this.data.iconsShow;
    this.setData({
      "iconsShow": iconsShow
    })
  }


})