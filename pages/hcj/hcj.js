// page/hcj/hcj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBannerList: [
      { "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1507540733424_4f0691cfe48c8f74fe413c7b92391ff4.jpg" },
      {
        "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1507545709856_f8d8153fb4f29d3af15276db22435d48.jpg",
      },
      {
        "imgUrl": "/resources/Benefits-of-Lifting-Weights-4.jpg"
      }
    ],
    isHotList: [
      {
        "id": 155,
        "status": 1,
        "updatedAt": 1506743161000,
        "createdAt": 1506743161000,
        "name": "名片版小程序",
        "shopId": 10,
        "moduleType": 1,
        "relateType": 1,
        "relateId": 199,
        "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1506743160106_6832757f95ac840efc931232a17248e.jpg",
        "url": ""
      },
      {
        "id": 156,
        "status": 1,
        "updatedAt": 1506743161000,
        "createdAt": 1506743161000,
        "name": "展示版小程序",
        "shopId": 10,
        "moduleType": 1,
        "relateType": 2,
        "relateId": 67,
        "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1506743145967_7659118274c7a1afe2e0a67f86690a61.jpg",
        "url": ""
      },
      {
        "id": 157,
        "status": 1,
        "updatedAt": 1506743161000,
        "createdAt": 1506743161000,
        "name": "商城版小程序",
        "shopId": 10,
        "moduleType": 1,
        "relateType": 2,
        "relateId": 68,
        "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1506743151885_656c353701bcba7d045098b884f8d8f9.jpg",
        "url": ""
      }

    ],

    isClassifyList: [
      {
        "id": 160,
        "status": 1,
        "updatedAt": 1507540875000,
        "createdAt": 1507540875000,
        "name": "套餐对比",
        "shopId": 10,
        "moduleType": 4,
        "relateType": 1,
        "relateId": 202,
        "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1507540752899_e94cb34b8a13e0ca337a69ba60051f85.png",
        "url": ""
      },
      {
        "id": 161,
        "status": 1,
        "updatedAt": 1507540875000,
        "createdAt": 1507540875000,
        "name": "程序案例",
        "shopId": 10,
        "moduleType": 4,
        "relateType": 2,
        "relateId": 65,
        "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1507540788289_3b7635520c14a19ccc3dbb11f316d402.png",
        "url": ""
      },
      {
        "id": 162,
        "status": 1,
        "updatedAt": 1507540875000,
        "createdAt": 1507540875000,
        "name": "代理加盟",
        "shopId": 10,
        "moduleType": 4,
        "relateType": 1,
        "relateId": 204,
        "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1507545243129_c2936f19bf3907c3cad6b8fbd152cf34.png",
        "url": ""
      },
      {
        "id": 163,
        "status": 1,
        "updatedAt": 1507540875000,
        "createdAt": 1507540875000,
        "name": "关于我们",
        "shopId": 10,
        "moduleType": 4,
        "relateType": 1,
        "relateId": 203,
        "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/layout/1507540864315_39e7ea9b4349a05f067197b1f8ba1aaa.png",
        "url": ""
      }
    ],

    hotGoodsList: [{
      "classisfyName": "厨师长推荐",
      "wxListVOList": [
        {
          "goodsId": 195,
          "name": "猪肝饭",
          "minPrice": 4500,
          "maxPrice": 4500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/a9bde3103ce7cab54ecc9b9005427c9a106937.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "展示版小程序",
          "brief": ""
        },
        {
          "goodsId": 196,
          "name": "卤肉饭",
          "minPrice": 9500,
          "maxPrice": 9500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/ce1692b0d1aebb556a9b27101f49b1ca93804.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "商城版小程序",
          "brief": ""
        },
        {
          "goodsId": 197,
          "name": "鱿鱼饭",
          "minPrice": 9500,
          "maxPrice": 9500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/485f1fc026de04543bfdc05a494faa5784055.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "商城版小程序",
          "brief": ""
        },
        {
          "goodsId": 191,
          "name": "展示版样例：健身房",
          "minPrice": 4500,
          "maxPrice": 4500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://shopphoto.oss-cn-shenzhen.aliyuncs.com/image/goods/1506760522467_f3ccdd27d2000e3f9255a7e3e2c48800.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "展示版小程序",
          "brief": ""
        },
        {
          "goodsId": 195,
          "name": "猪肝饭",
          "minPrice": 4500,
          "maxPrice": 4500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/a9bde3103ce7cab54ecc9b9005427c9a106937.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "展示版小程序",
          "brief": ""
        },
        {
          "goodsId": 195,
          "name": "猪肝饭",
          "minPrice": 4500,
          "maxPrice": 4500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/a9bde3103ce7cab54ecc9b9005427c9a106937.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "展示版小程序",
          "brief": ""
        },
        {
          "goodsId": 195,
          "name": "猪肝饭",
          "minPrice": 4500,
          "maxPrice": 4500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/a9bde3103ce7cab54ecc9b9005427c9a106937.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "展示版小程序",
          "brief": ""
        },
        {
          "goodsId": 195,
          "name": "猪肝饭",
          "minPrice": 4500,
          "maxPrice": 4500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/a9bde3103ce7cab54ecc9b9005427c9a106937.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "展示版小程序",
          "brief": ""
        },
        {
          "goodsId": 195,
          "name": "猪肝饭",
          "minPrice": 4500,
          "maxPrice": 4500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/a9bde3103ce7cab54ecc9b9005427c9a106937.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "展示版小程序",
          "brief": ""
        },
        {
          "goodsId": 195,
          "name": "猪肝饭",
          "minPrice": 4500,
          "maxPrice": 4500,
          "stock": 9999,
          "sales": 0,
          "imgUrl": "http://p0.meituan.net/210.0/wmproduct/a9bde3103ce7cab54ecc9b9005427c9a106937.jpg",
          "type": 2,
          "classifyName": "小程序案例",
          "subClassifyName": "展示版小程序",
          "brief": ""
        },
      ]
    }
    ]



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