Page({
  data: {
    showModalStatus: false,
    inputShowed: false,
    inputVal: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  hideInput: function () {
    console.log("hideInput");
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  inputTyping: function (e) {
    console.log("inputTyping");
    var queryString = e.detail.value;
    this.setData({
      inputVal: queryString,
    });
  },
  onChangeShowState: function () {
    console.log("onChangeShowState");
    var that = this;
    that.setData({
      showCategory: (!that.data.showCategory),
    })
  },
  showInput: function () {
    console.log("onChangeShowState");
    this.setData({
      inputShowed: true
    });
  },
})