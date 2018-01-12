var WXBizDataCrypt = require('../../libs/WXBizDataCrypt/WXBizDataCrypt.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    getCodeFlag:false,
  },

  
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
    var phoneLength = this.data.phone.toString().length;
    if (phoneLength==11){
       this.setData({
         getCodeFlag:true
       })
  }else{
      this.setData({
        getCodeFlag: false
      })
  }
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  submit(){
    wx.switchTab({
      url: '../myorder/myorder'
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var sessionKey = 'sw2IFQscaHyEQqh3iwr+KA==';
    var appId = 'wx8f6bfc2c9922c895';
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    /* var pc = new WXBizDataCrypt(appId, sessionKey);
    var data = pc.decryptData(encryptedData, iv);
    console.log(data); */
   
    /*获取商品信息 */
    util.requestByLogin({
      url: app.globalData.domain + '/wx/user/userphone',
      method: 'POST',
      data: {
        encryptedData: encryptedData,
        iv: iv,
        session_key: session_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    }, function (res) {
      console.log(res);
      wx.hideToast();
    }, function () {
      console.log("Error:function GetData")
      wx.hideToast();
    }
    );


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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