// pages/setting/setting.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '老板', value: '0' },
      { name: '经理', value: '1' },
      { name: '员工', value: '2' },
      { name: '顾客', value: '3' }, 
    ],
    Flag: '',
    /* staffManage: [
      {
        id: '0',
        position: '老板',
        num: '100',
        password: '100'
      },
      {
        id: '1',
        position: '经理',
        num: '101',
        password: '101'
      },
      {
        id: '2',
        position: '员工',
        num: '102',
        password: '102'
      },
      {
        id: '3',
        position: '员工',
        num: '103',
        password: '103'
      },
    ] */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setRole();
    this.getFlag();
    this.getStaffManage();
  },
  getStaffManage: function (event) {
    var that = this;
    wx.showLoading(
      {
        title: "处理中"
      }
    )
    /*获取商品信息 */
    util.requestByLogin({
      url: app.globalData.domain + '/seller/staffmsg',
      method: 'GET',
      header: {
        'content-type': 'application/xml'
      },
    }, function (res) {
      console.log("staffmanage");
      console.log(res);  
      that.setData({
        staffManage:res.data
      })
      wx.hideToast(); 
    }, function () {
      console.log("Error:function GetData")
      wx.hideToast();
    }
    );
  },
  setRole: function (e) {
    var role = wx.getStorageSync('role');
    this.setData({
      role: role
    })
    if (role == '0') {

      var temp = [
        { name: '老板', value: '0', checked: 'true' },
        { name: '经理', value: '1' },
        { name: '员工', value: '2' },
        { name: '顾客', value: '3' },
      ]
      this.setData({
        items: temp
      })

    } else if (role == '1') {
      var temp = [
        { name: '老板', value: '0' },
        { name: '经理', value: '1', checked: 'true' },
        { name: '员工', value: '2' },
        { name: '顾客', value: '3' }, 
      ]
      this.setData({
        items: temp
      })
    } else if (role == '2') {
      var temp = [
        { name: '老板', value: '0' },
        { name: '经理', value: '1' },
        { name: '员工', value: '2', checked: 'true' },
         { name: '顾客', value: '3' }, 
      ]
      this.setData({
        items: temp
      })
    } else if (role == '3') {
      var temp = [
        { name: '老板', value: '0' },
        { name: '经理', value: '1' },
        { name: '员工', value: '2' },
         { name: '顾客', value: '3', checked: 'true' }, 
      ]
      this.setData({
        items: temp
      })
    }
  },

  getFlag: function (e) {
    if (this.data.role == '0') {
      this.setData({
        Flag: '报表'
      })

    } else if (this.data.role == '3') {

    } else {
      this.setData({
        Flag: '点餐'
      })


    }

  },
  /*点击了加盟合作 */
  oncooperationTap: function (event) {
    wx.navigateTo({
      url: '../cooperation/cooperation',
    })
  },
  oncacheTap: function (event) {
    wx.clearStorage();
    wx.showToast(
      {
        title: "清除缓存成功",
        duration: 800,
        icon: "success"
      }
    )

  },
  oncontactTap: function (event) {
    wx.makePhoneCall({
      phoneNumber: '15999902125' //仅为示例，并非真实的电话号码
    })
  },
  test: function (e) {

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var staff = e.detail.value;
    this.setData({
      staff: staff
    })
    if (staff == '3'){
      wx.setStorageSync('role', staff);
      wx.switchTab({
        url: '../customerbooking/customerbooking'
      })
    }else{
      this.setRole();
      this.getFlag();
      var role = this.data.role;
      if (role.length > 0) {
        if (role == staff) {
          this.switchPage(staff);
        } else {
          this.showInputSeat('open');
        }
      } else {
        this.showInputSeat('open');
      }
    }
    

  },
  login: function (e, callback) {
    var staffManage = this.data.staffManage;
    var temp = {};
    for (var idx in staffManage) {
      console.log(staffManage[idx].jobNumber);
      if (staffManage[idx].jobNumber == e) {
        temp = staffManage[idx];
        break;
      }
    }
     console.log("temp");
     console.log(temp);
    if (temp.jobNumber == this.data.jobNumber && temp.password == this.data.password) {
      wx.setStorageSync('role', temp.id);
      wx.showToast({
        title: '登录成功！',
      })
      callback('sucess');
    } else {
      wx.showToast({
        title: '账号或密码不对,请重新输入！',
      })
      callback('fail');
    }
  },
  switchPage: function (e) {
    if (e == '0') {
      wx.redirectTo({
        url: '../ordermanager/ordermanager',
      })
    } else if (e == '3') {
      wx.switchTab({
        url: '../customerbooking/customerbooking'
      })
    } else {
      wx.redirectTo({
        url: '../ordermanager/ordermanager',
      })
    }
  },
  onCancelTap: function (e) {
    console.log('点击了取消');
    this.showInputSeat('close');
  },
  onConfirmTap: function (e) {
    console.log('点击了确定');
    var that = this;
    this.login(this.data.jobNumber,
      function (res) {
        console.log(res);
        if (res == "sucess") {
          wx.setStorageSync('role', that.data.staff);
          that.switchPage(that.data.staff);
          that.showInputSeat('close');
        }
      });
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
  numberInput: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value != '') {
      that.setData({
        jobNumber: e.detail.value,
      })

    }
  },
  passwordInput: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value != '') {
      that.setData({
        password: e.detail.value,
      })

    }
  },

})