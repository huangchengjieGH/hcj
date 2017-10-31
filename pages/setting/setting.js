// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  /*点击了加盟合作 */
  oncooperationTap:function(event){
    wx.navigateTo({
      url: '../cooperation/cooperation',
    })
  },
  oncacheTap:function(event){
    wx.clearStorage();
    wx.showToast(
      {
        title: "清除缓存成功",
        duration: 800,
        icon: "success"
      }
    )

  }

})