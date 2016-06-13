/**
 * Created by zsj on 16-6-12.
 */

var request = require('request');

var jsdom = require('jsdom');
var fs = require('fs');
var jqueryFile = fs.readFileSync(__dirname + "/jquery.js", "utf-8");

exports.loginFormInfo = function (callback) {
    var url = 'http://travel.pipi88.cn/Rescue/Login.aspx';

    var loginFormInfo = {};
    var noneUseParamNames = ['NewVerticalLoginTool1$btnDownload', 'NewVerticalLoginTool1$btnOpen', 'btnLogin'];
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
                      
                      for(var i=0; i<noneUseParamNames.length; i++) {
                          delete loginFormInfo[noneUseParamNames[i]];
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

    console.log('================')
    console.log(formDataObj);
    var cookies = [];

    request.post(options, function (error, response, body) {
        //console.log(body);
        if(response.headers['set-cookie']) {
            response.headers['set-cookie'].forEach(function (item, i) {
                cookies.push(item);
                console.log(item, i);
            });
        }
        callback(cookies);
    });

};
