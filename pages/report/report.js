let wxCharts = require('../../libs/wxcharts/wxcharts.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '0',
    tableOrder: [
      { one: '2017/11/01', two: '5000' },
      { one: '2017/11/02', two: '9000' },
      { one: '2017/11/04', two: '9666' },
      { one: '2017/11/05', two: '9577' },
      { one: '2017/11/06', two: '9777' },
      { one: '2017/11/07', two: '9899' },
      { one: '2017/11/08', two: '9999' },
      { one: '2017/11/09', two: '9777' },
      { one: '2017/11/10', two: '9444' },
      { one: '总计', two: '91139' },
    ],
    chartData: ['2012/09', '2013/09', '2014/09', '2015/09', '2016/09', '2017/09', '2018/09', '2019/09'],
    chartValue: [15, 20, 45, 37, 4, 80, 78, 90],
    turnOverData: [
      {
        "date": "2017-09-28",
        "turnover": 34
      },
      {
        "date": "2017-10-09",
        "turnover": 568
      },
      {
        "date": "2017-10-10",
        "turnover": 1480
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.formatDate();
   // this.getServiceTurnOverData();
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
      data: {
        begindate: that.data.beginDate,
        enddate: that.data.endDate
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
    })
  },
  onRankTap: function (event) {
    wx.navigateTo({
      url: '../ranking/ranking',
    })
  },
  weCharts: function (event) {
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
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
          return val + '万';
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

    beginDate = year + '-' + month + '-' + day;
    this.setData({
      "beginDate": beginDate,
      "endDate": beginDate
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
  },
  onChartTap: function (e) {
    var currentStatu = e.currentTarget.dataset.id;
    this.showInputSeat(currentStatu);
    this.weCharts();
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


})