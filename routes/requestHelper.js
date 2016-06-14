/**
 * Created by zsj on 16-6-12.
 */

var request = require('request');
var jsdom = require('jsdom');
var fs = require('fs');
var jqueryFile = fs.readFileSync(__dirname + "/jquery.js", "utf-8");
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

var winston = require('winston');
winston.level = 'debug';

var userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36';

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
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': userAgent
        },
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

    var cookieHeaders = [];
    for(var i=0; i<cookies.length; i++) {
        cookieHeaders.push(cookies[i].split(';')[0]);
    }
    var cookieStr = cookieHeaders.join(';');
    winston.debug('cookieStr', cookieStr);

    var options = {
        url: url,
        encoding: null,
        headers: {
            'Cookie': cookieStr,
            'User-Agent': userAgent
        }
    };

    var req = request(options);
    req.on('error', function (err) {
        console.log(err);
    });
    
    req.on('response', function (res) {
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            var result = iconv.decode(bufferHelper.toBuffer(), 'GBK');
            jsdom.env({
                          html: result,
                          src: [jqueryFile],
                          done: function (err, window) {
                              var $ = window.$;
                              var userItems = [];
                              window.$("table.writetbl tr").each(function () {
                                  var userItem = {};
                                  userItem.desc = $(this).find('th').text().trim();
                                  userItem.val = $(this).find('td').text().trim();
                                  //winston.debug('item.desc', userItem.desc);
                                  //winston.debug('item.val', userItem.val);
                                  userItems.push(userItem);
                              });
                              winston.debug('userItems', userItems);
                              callback(userItems);
                          }
                      });
        });
    });


};
