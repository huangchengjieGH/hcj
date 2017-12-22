var Data_List = [
  {
    "status": 1,
    "msg": "请求成功",
    /*以下是新增餐厅信息 */
    title: "附近热门",  
    message: {
      resId: 0,
      "isHot": 1,   //是否是热门餐厅
      name: "外婆家",
      imgUrl: "/images/image/aizhimian.jpg",
      score: "5.0",
      category: "江浙菜",
      perConsume: "100",
      distance: "100",   /*这个餐厅距离是服务器统计还是前端统计 */
      discount: "会员享受8折优惠",
      describe: "鸡公煲是重庆烧鸡公和重庆干锅鸡在外...",
      classification: [
        '厨师长推荐',
        '本店招牌',
        '新品上架',
        '特色小炒',
        '开胃小菜',
        '凉拌系列',
        '酒水系列',
        '饮料系列',
      ],
    },
    /*新增餐厅信息 */
    "extra": {}
  },
  {
    "status": 1,
    "msg": "请求成功",
    /*以下是新增餐厅信息 */
    title: "附近热门",
    message: {
      resId: 1,
      "isHot": 0,   //是否是热门餐厅
      name: "丹桂轩",
      imgUrl: "/images/image/aizhimian.jpg",
      score: "5.0",
      category: "江浙菜",
      perConsume: "100",
      distance: "100",   /*这个餐厅距离是服务器统计还是前端统计 */
      discount: "会员享受8折优惠",
      describe: "鸡公煲是重庆烧鸡公和重庆干锅鸡在外...",
      classification: [
        '厨师长推荐',
        '本店招牌',
        '新品上架',
        '特色小炒',
        '开胃小菜',
        '凉拌系列',
        '酒水系列',
        '饮料系列',
      ],
    },
    /*新增餐厅信息 */
    "extra": {}
  },

]

 module.exports = {
  Data_List: Data_List
} 