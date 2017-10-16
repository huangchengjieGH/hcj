// pages/homepage/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: {
      searchValue: '',
      showClearBtn: false
    },
    searchResult: [],
      historySearch: [
        '重庆鸡公煲',
        '小馋嘴',
        '鱼在江湖',
        '麻辣小龙虾'
      ],
     ClearhistorySearchBtn:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
/* get the input value */
  searchActiveChangeinput: function (e) {
    const val = e.detail.value;
    this.setData({
      'search.showClearBtn': val != '' ? true : false,
      'search.searchValue': val
    });
   },
/* clear the input message  */
  searchActiveChangeclear: function (e) {
    this.setData({
      'search.showClearBtn': false,
      'search.searchValue': ''
    })
  },

  /*when click*/ 
  focusSearch: function () {
    if (this.data.search.searchValue) {
      this.setData({
        'search.showClearBtn': true
      })
    }
  },
  
  //搜索提交
  searchSubmit: function () {
    const val = this.data.search.searchValue;
    console.log("searchSubmit");
    var historysearchlist = this.data.search.historySearch;
    historysearchlist.push(val);
    this.setData({historySearch:historysearchlist});


    if (val) {
      const that = this,
        app = getApp();
      wx.showToast({
        title: '搜索中',
        icon: 'loading'
      });
      wx.request({
        url: app.globalData.API_URL + 'searchTeam',
        data: {
          keywords: val,
          user_id: app.globalData.myInfo.user_id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          // success
          let searchResult = res.data.data;
          const len = searchResult.length;
          for (let i = 0; i < len; i++) {
            searchResult[i]['team_avator'] = app.globalData.STATIC_SOURCE + searchResult[i]['team_avator'];
          }
          that.setData({
            searchResult: searchResult,
            'search.showClearBtn': false,
          })
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
          wx.hideToast();
        }
      })
    }
  },
  /*cancel input */
  CancelSearch:function(){

    wx.switchTab(
       {
         url: '../../homepage/homepage'
       }
     )
   
   },
   /* clear history search */
  historysearchclear:function(){
    
  }
 
})