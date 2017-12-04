// pages/ordermanager/ordermanager.js
var app = getApp();
Page({

  /**
  * 页面的初始数据
  */
  data: {
    content: ['全部', '使用中', '空闲'],
    openList: true,
    showList: true,
    numValue: '全部',
    order: '',
    Flag:'',
    seat:[
      {
        seatNum:'1',
        status:'0',
        orderId:6
      },
      {
        seatNum: '2',
        status: '1',
        orderId: 10
      },
      {
        seatNum: '3',
        status: '0',
        orderId: 11
      },
      {
        seatNum: '4',
        status: '0',
        orderId: 12
      },
      {
        seatNum: '5',
        status: '1',
        orderId: 13
      },
      {
        seatNum: '6',
        status: '1',
        orderId: 14
      },
      {
        seatNum: '7',
        status: '0',
        orderId: 14
      },
      {
        seatNum: '8',
        status: '0',
        orderId: 14
      },
    ]

  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getFlag();
    this.getSeatGourp(this.data.seat);
  },
  getSeatGourp: function (seat){
    var seatArray = [];
    var temp = {};
    var seatGroup = [];
    var i = 0;
    for (var idx in seat){ 
      if (this.data.numValue == '全部'){
        seatArray[i] = {   status:seat[idx].status,
                         orderId: seat[idx].orderId,
                         seatNum: seat[idx].seatNum
                         };
          
        ++i;
        if ((idx + 1) % 3 == 0) {
          seatArray[idx] = {
            status: seat[idx].status,
            orderId: seat[idx].orderId,
            seatNum: seat[idx].seatNum
          };
          temp = {
            one: seatArray[0],
            two: seatArray[1],
            three: seatArray[2],
          }
          seatGroup.push(temp);
          temp = '';
          i = 0;
          seatArray = [];
        } 

      } else if (this.data.numValue == '使用中'){
        if (seat[idx].status == '0'){
          seatArray[i] = {
            status: seat[idx].status,
            orderId: seat[idx].orderId,
            seatNum: seat[idx].seatNum
          }

          ++i;
          if ( i % 3 == 0) {
            seatArray[idx] = {
              status: seat[idx].status,
              orderId: seat[idx].orderId,
              seatNum: seat[idx].seatNum
            };
            temp = {
              one: seatArray[0],
              two: seatArray[1],
              three: seatArray[2],
            }
            seatGroup.push(temp);
            temp = '';
            i = 0;
            seatArray = [];
          }

        }

      } else if (this.data.numValue == '空闲'){
        if (seat[idx].status == '1') {
          seatArray[i] = {
            status: seat[idx].status,
            orderId: seat[idx].orderId,
            seatNum: seat[idx].seatNum
          }

          ++i;
          if (i % 3 == 0) {
            seatArray[idx] = {
              status: seat[idx].status,
              orderId: seat[idx].orderId,
              seatNum: seat[idx].seatNum
            };
            temp = {
              one: seatArray[0],
              two: seatArray[1],
              three: seatArray[2],
            }
            seatGroup.push(temp);
            temp = '';
            i = 0;
            seatArray = [];
          }
        }
      }
           
    }
    console.log(seatArray);
    console.log(seatArray.length);
    if (seatArray.length>0){
        temp = {
          one: seatArray[0],
          two: seatArray[1],
          three: seatArray[2],
        }
        seatGroup.push(temp);
        temp = '';    
    }
    this.setData({
      seatGroup: seatGroup
    })
  },
onSeatTap: function (event) {
  var orderId = event.currentTarget.dataset.orderid;
    var status = event.currentTarget.dataset.status;
    var seatNum = event.currentTarget.dataset.seatnum;
    console.log(orderId);
    console.log(status);
    console.log(seatNum);
    if (status==0){
      wx.navigateTo({
        url: '../checkorder/checkorder?orderId=' + orderId
      })
    }

    if (status==1){

      wx.navigateTo({
        url: '../staffbooking/staffbooking?seatNum=' + seatNum
      })
    }
    
  },
  /*选择就餐人数 */
  onNumTap: function (event) {
    var onnumId = event.currentTarget.dataset.numid;
    this.setData({
      'numValue': onnumId,
      openList: true,
      showList: true,
    });
    console.log(onnumId);
    this.getSeatGourp(this.data.seat);
  },
  per_list: function (event) {
    if (this.data.openList) {
      this.setData({
        openList: false,
        showList: false,

      })
    } else {
      this.setData({
        openList: true,
        showList: true,
      })
    }
  },
  onReportTap: function (e) {
    console.log(app.globalData.role);
  if (app.globalData.role == '0'){
      wx.redirectTo({
        url: '../report/report',
      })
  } else if (app.globalData.role == '1'){
    wx.redirectTo({
      url: '../staffbooking/staffbooking',
    })
  } else if (app.globalData.role == '2'){
    wx.redirectTo({
      url: '../staffbooking/staffbooking',
    })
  }

  },
  onMyTap: function (e) {
    wx.redirectTo({
      url: '../my/my',
    })
  },
  getFlag: function (e) {
    if (app.globalData.role == '0') {
      this.setData({
        Flag: '报表'
      })
    } else {
      this.setData({
        Flag: '点餐'
      })
    }

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