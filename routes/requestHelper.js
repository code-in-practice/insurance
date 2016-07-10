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

/**
 * 登录页面
 * @param callback
 */
 exports.loginFormInfo = function (callback) {
  var url = 'http://travel.pipi88.cn/Rescue/Login.aspx';

  var options = {
    url: url,
    encoding: null,
    headers: {
      'User-Agent': userAgent
    }
  };

  request(options).on('response', function (res) {
    var bufferHelper = new BufferHelper();
    res.on('data', function (chunk) {
      bufferHelper.concat(chunk);
    }).on('end', function () {
      var result = iconv.decode(bufferHelper.toBuffer(), 'GBK');
      var loginFormInfo = {};
      var noUseParamNames = ['NewVerticalLoginTool1$btnDownload', 'NewVerticalLoginTool1$btnOpen', 'btnLogin'];
      jsdom.env({
        html: result,
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
          winston.debug('loginFormInfo', loginFormInfo);
          callback(loginFormInfo);
        }
      });
    });
  }).on('error', function (err) {
    winston.info(err);
  });

};

/**
 * 登录
 * @param formDataObj
 * @param callback
 */
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

/**
 * 用户中心
 * @param cookies
 * @param callback
 */
 exports.userInfo = function (cookies, callback) {
  var url = 'http://travel.pipi88.cn/Rescue/UserManager/AgentInfo.aspx';

  var cookieHeaders = [];
  for(var i=0; i<cookies.length; i++) {
    cookieHeaders.push(cookies[i].split(';')[0]);
  }
  var cookieStr = cookieHeaders.join(';');

  var options = {
    url: url,
    encoding: null,
    headers: {
      'Cookie': cookieStr,
      'User-Agent': userAgent
    }
  };

  request(options).on('response', function (res) {
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
  }).on('error', function (err) {
    winston.info(err);
  });
};

/**
 * 保单查询
 * @param cookies
 * @param callback
 */
 exports.historicalRecordsList = function (cookies, callback) {
  var url = 'http://travel.pipi88.cn/Rescue/Statistics/HistoricalRecords.aspx?MemberId=@MemberId';

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

  request(options).on('response', function (res) {
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
          var orderItems = [];
          window.$("table#MainIssues_grid tr").each(function (i, itemRow) {
            var orderItem = [];
            if(i == 0){
              $(itemRow).find('th').each(function (j, item) {
                if(j > 0){
                  orderItem.push($(item).text().trim())
                }
              })
            }else {
              $(itemRow).find('td').each(function (j, item) {
                if(j > 0){
                  orderItem.push($(item).text().trim())
                }
              })
            }
            orderItems.push(orderItem);
          });
          winston.debug('orderItems', orderItems);
          callback(orderItems);
        }
      });
    });
  }).on('error', function (err) {
    winston.info(err);
  });
};

/**
 * 保单录入页面
 * @param cookies
 * @param callback
 */
 exports.insurancePolicyInfoGet = function (cookies, callback) {
  var url = 'http://travel.pipi88.cn/Rescue/DocumentsManager/DocumentsInsert.aspx';

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

  request(options).on('response', function (res) {
    var bufferHelper = new BufferHelper();
    res.on('data', function (chunk) {
      bufferHelper.concat(chunk);
    }).on('end', function () {
      var result = iconv.decode(bufferHelper.toBuffer(), 'GBK');
      parseInsuranceFormInfo(result, function (err, insuranceFormInfo) {
        callback(err, insuranceFormInfo);
      })

    });
  }).on('error', function (err) {
    winston.info(err);
  });
};

exports.insurancePolicyInfoPost = function (cookies, insuranceFormInfoPost, callback) {
  var url = 'http://travel.pipi88.cn/Rescue/DocumentsManager/DocumentsInsert.aspx';
  winston.info('---------------post-------------------');

  var cookieHeaders = [];
  for(var i=0; i<cookies.length; i++) {
    cookieHeaders.push(cookies[i].split(';')[0]);
  }
  var cookieStr = cookieHeaders.join(';');

  var options = {
    url: url,
    encoding: null,
    headers: {
      'Cookie': cookieStr,
      'User-Agent': userAgent
    },
    formData: insuranceFormInfoPost
  };

  request.post(options).on('response', function (res) {
    var bufferHelper = new BufferHelper();
    res.on('data', function (chunk) {
      bufferHelper.concat(chunk);
    }).on('end', function () {
      var result = iconv.decode(bufferHelper.toBuffer(), 'GBK');
      parseInsuranceFormInfo(result, function (err, insuranceFormInfo) {
        callback(err, insuranceFormInfo);
      })

    });
  }).on('error', function (err) {
    winston.info(err);
  });
};

var parseInsuranceFormInfo = function (html, callback) {
  var insuranceFormInfoDefault = {};
  var insuranceFormInfoSelect = {};
  var insuranceFormInfo = {};
  var TopIssues_ServiceId = {};
  var TopIssues_ProductId = {};
  var MainIssues_InsureIdType = {};
  var MainIssues_InsureDays = {};
  jsdom.env(
  {
    html: html,
    src: [jqueryFile],
    done: function (err, window) {
      var $ = window.$;
                // 找到所有input

                TopIssues_ServiceId.name = 'TopIssues_ServiceId';
                var options = [];
                window.$("select#TopIssues_ServiceId option").each(function () {
                  var option = {};
                  option.value = $(this).val();
                  option.text = $(this).text();
                  if($(this).attr('selected')){
                    option.selected = 'selected';
                  }
                  options.push(option);

                });
                TopIssues_ServiceId.options = options;
                //winston.debug('TopIssues_ServiceId: ', JSON.stringify(TopIssues_ServiceId, null, '  '));

                TopIssues_ProductId.name = 'TopIssues_ProductId';
                var options = [];
                window.$("select#TopIssues_ProductId option").each(function () {
                  var option = {};
                  option.value = $(this).val();
                  option.text = $(this).text();
                  if($(this).attr('selected')){
                    option.selected = 'selected';
                  }
                  options.push(option);

                });
                TopIssues_ProductId.options = options;
                // winston.debug('TopIssues_ProductId: ', JSON.stringify(TopIssues_ProductId, null, '  '));

                MainIssues_InsureIdType.name = '证件类型';
                var options = [];
                window.$("select#MainIssues_InsureIdType option").each(function () {
                  var option = {};
                  option.value = $(this).val();
                  option.text = $(this).text();
                  if($(this).attr('selected')){
                    option.selected = 'selected';
                  }
                  options.push(option);

                });
                MainIssues_InsureIdType.options = options;
                // winston.debug('MainIssues_InsureIdType: ', JSON.stringify(MainIssues_InsureIdType, null, '  '));

                MainIssues_InsureDays.name = '保险期限';
                var options = [];
                window.$("select#MainIssues_InsureDays option").each(function () {
                  var option = {};
                  option.value = $(this).val();
                  option.text = $(this).text();
                  if($(this).attr('selected')){
                    option.selected = 'selected';
                  }
                  options.push(option);

                });
                MainIssues_InsureDays.options = options;
                // winston.debug('MainIssues_InsureDays: ', JSON.stringify(MainIssues_InsureDays, null, '  '));

                window.$("form#form1 input, form#form1 select").each(function () {
                  var nodeName = $(this).prop('nodeName');
                  var name = $(this).attr('name');
                  var value = '';
                  var textOrSelect = true;
                  if(nodeName === 'INPUT'){
                    if($(this).attr('type') === 'checkbox'){
                      textOrSelect = false;
                      if($(this).attr('checked') === 'checked'){
                        value = 'on';
                        insuranceFormInfoDefault[name] = value;
                      }
                    }else if($(this).attr('type') === 'radio') {
                      textOrSelect = false;
                      value = window.$("input[name='"+name+"']:checked").val();
                      insuranceFormInfoDefault[name] = value;
                    }else {
                  // text or hidden
                  value = $(this).val();
                }
              }else if(nodeName = 'SELECT') {
                value = $($(this).find('option:selected')).val();
                // winston.debug('selected name: ', name, ': ', $($(this).find('option:selected')).text(), 'value: ', value);
              }else {
                //winston.debug('nodeName is :', nodeName);
              }
              if(textOrSelect){
                insuranceFormInfoDefault[name] = value;
              }
            });
                 insuranceFormInfoSelect.TopIssues_ServiceId = TopIssues_ServiceId;
                 insuranceFormInfoSelect.TopIssues_ProductId = TopIssues_ProductId;
                 insuranceFormInfoSelect.MainIssues_InsureIdType = MainIssues_InsureIdType;
                 insuranceFormInfoSelect.MainIssues_InsureDays = MainIssues_InsureDays;
                 insuranceFormInfo.default = insuranceFormInfoDefault;
                 insuranceFormInfo.select = insuranceFormInfoSelect;

      winston.debug('insuranceFormInfo', JSON.stringify(insuranceFormInfo, null, '  '));
      callback(null, insuranceFormInfo);
    }
  }
  );
};
