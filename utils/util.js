var setting = require('../setting/setting.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*******************
 name: convertToStarsArray
parameter:stars  : 35 45 50
function: change the stars values into array
 *****************************************/
function convertToStarsArray(stars) {

  var num = stars.toString().substring(0, 1);
  var num_2 = stars.toString().substring(2);
/*  console.log(num);
  console.log(num_2);*/

  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      if (num_2 != 0)
      {
        array.push(2);
        num_2 = 0;
      }
      else{
        array.push(0);
      }
      
    }

  }
  return array;

}

function requestByLogin(request, callback, errCallback) {
  var _self = this;
  var token = wx.getStorageSync('token');
  var flag = '?';
  if (request.url.indexOf('?') !== -1) {
    flag = '&';
  }
  if (token.length > 0) {
  wx.request({
    url: request.url + flag + "token=" + token,
    data: request.data,
    header: request.header,
    method: request.method,
    dataType: request.dataType,
    success: function (res) {
      if (res.data.status == 1) {
        callback(res.data);
      } else {
        errCallback(res.data);
      }
    },
    fail: function (res) { },
    complete: function (res) { },
  })
  return;
  } else{
    console.log("token.length=0")
    _self.login(function (token) {
      wx.request({
        url: request.url + "?token=" + token,
        data: request.data,
        header: request.header,
        method: request.method,
        dataType: request.dataType,
        success: function (res) {
          if (res.data.status == 1) {
            callback(res.data.data);
          } else {
            console.log(res.data);
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
  }
}
function login(callback) {
  wx.login({
     async: false,  
    success: function (res) {
      console.log(res);
      wx.request({
          async: false,  
        url: setting.domain + '/wx/user/login?code=' + res.code + '&sellerId=' + setting.shopId,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          // success
          console.log(res);
          wx.setStorageSync('token', res.data.data);
          callback(res.data.data);
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
  
  
}
function uploadUserInfo() {
  var _self = this;
  wx.getUserInfo({
    success: function (res) {
      // success
      // console.log(res.userInfo);
      // console.log("requestByLogin begin");
      _self.requestByLogin({
        url: 'https://restaurant.wegtech.cn/wx/user',
        method: 'POST',
        data: res.userInfo,
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded'
        // }
      }, function (data) {
        // console.log(data);
        },  function () {
          console.log("error")
        }
      );
    },
    fail: function () {
      // fail
    },
    complete: function () {
    }
  });
}
module.exports = {
  formatTime: formatTime,
  convertToStarsArray : convertToStarsArray,
  requestByLogin: requestByLogin,
  login: login,
  uploadUserInfo:uploadUserInfo,
}
