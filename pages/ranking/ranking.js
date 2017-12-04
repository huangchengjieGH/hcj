Page({

  /**
  * 页面的初始数据
  */
  data: {
    goodsClassify: [
      { id:-1,name:'全部'},
      { id:1,name:'厨师长推荐'},
      { id: 2, name: '本店招牌'}
      ],
    rankValue: ['前10名', '后10名'],
    openList01: true,
    showList01: true,
    openList02: true,
    showList02: true,
    numValue01: '全部',
    numValue02: '前10名',
    order: '0',
    classifyid:'-1',
    tableOrder: [
      { one: '4', two: '5', three: '3' },
      { one: '8', two: '9', three: '3' },
      { one: '8', two: '9', three: '3' },
      { one: '8', two: '9', three: '3' },
      { one: '118', two: '9', three: '3' },
      { one: '118', two: '9', three: '3' },
      { one: '118', two: '9', three: '3' },
      { one: '118', two: '9', three: '3' },
      { one: '118', two: '9', three: '3' },
      { one: '6', two: '9', three: '3' },
    ],
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.formatDate();
  },
  getServiceRankingData: function (e) {
    var that = this;
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/report/ranking',
      method: 'POST',
      data: {
        begindate: that.data.beginDate,
        enddate: that.data.endDate,
        classifyid: that.data.classifyid,
        order: that.data.order,
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
  getServiceGoodsClassifyData: function (e) {
    var that = this;
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /******添加处理icon */
    util.requestByLogin({
      url: app.globalData.domain + '/ordermanage/classify',
      method: 'GET',
      header: {
        'content-type': 'application/xml'
      }
    }, function (res) {
      console.log(res);
      wx.hideToast();
    }, function () {
      console.log("Error: function onactionTap")
      wx.hideToast();
    }
    );
  },
  onNumTap01: function (event) {
    var that = this;
    var onnumId = event.currentTarget.dataset.numid;
    var classify = '';
    var goodsClassify = that.data.goodsClassify;
    for (var idx in goodsClassify){
      if (goodsClassify[idx].id == onnumId){
        //console.log(goodsClassify[idx].name);
        classify = goodsClassify[idx].name;
        break;
      }
    }
    this.setData({
      'numValue01': classify,
      classifyid: onnumId,
      openList01: true,
      showList01: true,
    });
    console.log(onnumId);
  },
  onNumTap02: function (event) {
    var onnumId = event.currentTarget.dataset.numid;
    var order = '';
    if (onnumId == '后10名'){
      order = '1';
    } else{
      order = '0';
    }
    this.setData({
      'numValue02': onnumId,
      order:order,
      openList02: true,
      showList02: true,
    });
    console.log(onnumId);
  },
  perList01: function (event) {
    if (this.data.openList01) {
      this.setData({
        openList01: false,
        showList01: false,
        openList02: true,
        showList02: true,
      })
    } else {
      this.setData({
        openList01: true,
        showList01: true,
        openList02: true,
        showList02: true,
      })
    }
  },
  perList02: function (event) {
    if (this.data.openList02) {
      this.setData({
        openList02: false,
        showList02: false,
        openList01: true,
        showList01: true,
      })
    } else {
      this.setData({
        openList02: true,
        showList02: true,
        openList01: true,
        showList01: true,
      })
    }
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