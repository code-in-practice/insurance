var express = require('express');
var router = express.Router();

var requestHelper = require('./requestHelper');
var constant = require('./constant');

var winston = require('winston');
 winston.level = 'debug';

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return new Date();
      },
      formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ]
});

router.get('/history', function(req, res, next) {
  var cookies = req.session.asp;
  if(cookies) {
    requestHelper.historicalRecordsList(cookies, function (orderItems) {
      res.render('orderHistory', {title: "代理保单", orderItems: orderItems});
    });
  }else {
    res.redirect('/login');
  }

});


router.get('/', function(req, res, next) {
  var cookies = req.session.asp;
  if(cookies) {
    var formData = req.query;
    // console.log('formData', JSON.stringify(formData, null, '  '));
    if(formData['__EVENTTARGET'] == 'ctl00$TopIssues$ServiceId'){
      var insuranceFormInfoPost = req.session.insuranceFormInfoDefault;
      Object.keys(formData).forEach(function(key){
        //console.log('--------key---------', key, formData[key]);
        insuranceFormInfoPost[decodeURIComponent(key)] = decodeURIComponent(formData[key]);
      });
      // always delete this key
      delete insuranceFormInfoPost['ctl00$BottomIssues$btnReset'];
      delete insuranceFormInfoPost['ctl00$BottomIssues$btnSave'];

      // console.log('insuranceFormInfoPost: ', JSON.stringify(insuranceFormInfoPost, null, '  '));
      requestHelper.insurancePolicyInfoPost(cookies, insuranceFormInfoPost, function (err, insuranceFormInfo) {
        if(err){
          console.log('err', JSON.stringify(err, null, '  '));
          if(err.code == constant.errConst.errCode.nologin){
            res.redirect('/login');
          }
        }else{
          req.session.insuranceFormInfoDefault = insuranceFormInfo.default;
          res.render('order', {title: "保单录入", insuranceFormInfoDefault: insuranceFormInfo.default, insuranceFormInfoSelect: insuranceFormInfo.select});
        }
      });
    }else {
      requestHelper.insurancePolicyInfoGet(cookies, function (err, insuranceFormInfo) {
        if(err){
          console.log('err', JSON.stringify(err, null, '  '));
          if(err.code == constant.errConst.errCode.nologin){
            res.redirect('/login');
          }
        }else{
          req.session.insuranceFormInfoDefault = insuranceFormInfo.default;
          res.render('order', {title: "保单录入", insuranceFormInfoDefault: insuranceFormInfo.default, insuranceFormInfoSelect: insuranceFormInfo.select});
        }
      });
    }
  }else {
    res.redirect('/login');
  }
});

router.post('/', function(req, res, next) {
  winston.info('--------------------post');
  var cookies = req.session.asp;
  if(cookies) {
    var insuranceFormInfoPost = req.session.insuranceFormInfoDefault;
    var formData = req.body;
    winston.info('req.body: ', req.body);
    Object.keys(formData).forEach(function(key){
      winston.info(formData[key]);
      insuranceFormInfoPost[key] = formData[key];
    })
    // always delete this key
    delete insuranceFormInfoPost['ctl00$BottomIssues$btnReset'];

    if(formData['__EVENTTARGET'] == 'ctl00$BottomIssues$btnSave'){
      insuranceFormInfoPost['__EVENTTARGET'] = '';
      requestHelper.insurancePolicyInfoSubmit(cookies, insuranceFormInfoPost, function (err, result) {
        if(err){
          console.log('err', JSON.stringify(err, null, '  '));
          if(err.code == constant.errConst.errCode.nologin){
            res.redirect('/login');
          }
        }else{
          res.send(result);
          // req.session.insuranceFormInfoDefault = insuranceFormInfo.default;
          // res.render('order', {title: "保单录入", insuranceFormInfoDefault: insuranceFormInfo.default, insuranceFormInfoSelect: insuranceFormInfo.select});
        }
      });

    }else if(formData['__EVENTTARGET'] == 'ctl00$TopIssues$ServiceId'){
      res.send('hello');
    }
  }else {
    res.redirect('/login');
  }
});

module.exports = router;
