// pages/Onlinereservation/Onlinereservation.js
var postsdatabase = require('../../data/posts-data.js');
var resdatabase = require('../../data/data.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkBox:[
      {name:'男'},
      { name: '女'}
    ],
    dates:'更多',
    today:true,
    tomorrow:false,
    aftertomorrow:false,
    more:false,
    times: [
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
      '20.30',
      '21:00',
      '21:30',
    ],
    chooseTimes:'11:30',
    service_num: 4,
    reservestate:'立即预约',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.formatDate();
    var res_Id = options.id;
    var Res_msg = {}
    Res_msg = resdatabase.Data_List[res_Id].message;
    this.setData(
      { Res_msg: Res_msg },
    );
  },
  formatDate:function(event){
    const date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var start_date="";
    
    start_date = year + '-' + month+'-'+day;
    this.setData({ "start_date": start_date});
   /*  console.log(start_date); */
  },
  ontodayTap:function(event){
    this.setData({
      dates: '更多',
      today: true,
      tomorrow: false,
      aftertomorrow: false,
      more: false,
    })
  },
  ontomorrowTap: function (event) {
    this.setData({
      dates: '更多',
      today: false,
      tomorrow: true,
      aftertomorrow: false,
      more: false,
    })
  },
  onaftertomorrowTap: function (event) {
    this.setData({
      dates: '更多',
      today: false,
      tomorrow: false,
      aftertomorrow: true,
      more: false,
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    var dates = e.detail.value;
    dates = dates.toString().substring(5);
    /* console.log(dates) */
     this.setData({
       dates: dates, 
       today: false,
       tomorrow: false,
       aftertomorrow: false,
       more:true,
    }) 
  },
  /*选择预约时间 */
  ontimesTap:function(event){
    var chooseTimes = event.currentTarget.dataset.id;
    this.setData({
      "chooseTimes": chooseTimes,
    })
  },
  /*减少就餐人数 */
  ondecreaseTap:function(event){
    var service_num = this.data.service_num-1;
    if (service_num>=0){
      this.setData({
        "service_num": service_num,
      })
    }else{
      this.setData({
        "service_num": 0,
      })
    }
  },
   /*增加就餐人数 */
  onaddTap: function (event) {
    var service_num = this.data.service_num + 1;
    this.setData({
      "service_num": service_num,
    })
  },
  /*是否包房 */
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  /*预约顾客性别 */
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  /*获取顾客名字 */
  nameConfirm: function(event){
    console.log('获取顾客姓名，携带值为', e.detail.value)
  },
   /*获取手机号码 */
  phoneConfirm: function(event) {
    console.log('获取手机号，携带值为', e.detail.value)
  },
  /*获取备注 */
  remarksConfirm: function(event) {
    console.log('获取手机号，携带值为', e.detail.value)
  },

  /**立即预约 */
  onreserveTap:function(event){
    var reserve = event.currentTarget.dataset.id;
   /*  console.log(reserve); */
  }
})