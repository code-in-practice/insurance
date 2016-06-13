/**
 * Created by zsj on 16-6-12.
 */

var request = require('request');
var jsdom = require('jsdom');
var fs = require('fs');
var jqueryFile = fs.readFileSync(__dirname + "/jquery.js", "utf-8");
var winston = require('winston');
winston.level = 'debug';

exports.loginFormInfo = function (callback) {
    var url = 'http://travel.pipi88.cn/Rescue/Login.aspx';

    var loginFormInfo = {};
    var noUseParamNames = ['NewVerticalLoginTool1$btnDownload', 'NewVerticalLoginTool1$btnOpen', 'btnLogin'];
    jsdom.env({
                  url: url,
                  src: [jqueryFile],
                  done: function (err, window) {
                      var $ = window.$;
                      window.$("form input").each(function () {
                          var value = $(this).attr('value');
                          if(value == undefined || value == 'undefined'){
                              value = '';
                          }
                          loginFormInfo[$(this).attr('name')] = value;
                      });
                      window.$("select").each(function () {
                          loginFormInfo[$(this).attr('name')] = $($(this).find('option')[0]).attr('value');
                      });
                      
                      for(var i=0; i < noUseParamNames.length; i++) {
                          delete loginFormInfo[noUseParamNames[i]];
                      }
                      callback(loginFormInfo);
                  }
              });
};

exports.loginAction = function (formDataObj, callback) {
    var url = 'http://travel.pipi88.cn/Rescue/Login.aspx';
    var options = {
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        formData: formDataObj
    };

    //winston.debug(formDataObj);
    var cookies = [];

    request.post(options, function (error, response, body) {
        if(response.headers['set-cookie']) {
            response.headers['set-cookie'].forEach(function (item, i) {
                cookies.push(item);
                //winston.debug(item, i);
            });
        }
        callback(cookies);
    });
};


exports.userInfo = function (cookies, callback) {
    var url = 'http://travel.pipi88.cn/Rescue/UserManager/AgentInfo.aspx';

    var userInfo = {};
    var cookieHeaders = [];
    for(var i=0; i<cookies.length; i++) {
        cookieHeaders.push(cookies[i].split(';')[0]);
    }
    var cookieStr = cookieHeaders.join(';');
    winston.debug('cookieStr', cookieStr);

    var options = {
        url: url,
        headers: {
            'Cookie': cookieStr,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36'
        }
    };

    request.get(options, function (error, response, body) {
        console.log(body);
        callback({});
    });

    // jsdom.env({
    //               url: url,
    //               src: [jqueryFile],
    //               cookie: cookieStr,
    //               done: function (err, window) {
    //                   var $ = window.$;
    //                   winston.debug('body', window.$("body"));
    //                   callback(userInfo);
    //               }
    //           });
};
