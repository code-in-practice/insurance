var express = require('express');
var router = express.Router();

var requestHelper = require('./requestHelper');

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
    var serviceId = req.query.serviceId;
    var productId = req.query.productId;
    var insuranceFormInfoPost = req.session.insuranceFormInfo;
    if(serviceId && productId && insuranceFormInfoPost){
      insuranceFormInfoPost['ctl00$TopIssues$ServiceId'] = serviceId;
      insuranceFormInfoPost['ctl00$TopIssues$ProductId'] = productId;
      insuranceFormInfoPost['__EVENTTARGET'] = 'ctl00$TopIssues$ServiceId';
      delete insuranceFormInfoPost['ctl00$BottomIssues$btnSave'];
      delete insuranceFormInfoPost['ctl00$BottomIssues$btnReset'];
      requestHelper.insurancePolicyInfoPost(cookies, insuranceFormInfoPost, function (err, insuranceFormInfo) {
        req.session.insuranceFormInfo = insuranceFormInfo;
        res.render('order', {title: "保单录入", insuranceFormInfoDefault: insuranceFormInfo.default, insuranceFormInfoSelect: insuranceFormInfo.select});
      });
    }else {
      requestHelper.insurancePolicyInfoGet(cookies, function (err, insuranceFormInfo) {
        req.session.insuranceFormInfo = insuranceFormInfo;
        res.render('order', {title: "保单录入", insuranceFormInfoDefault: insuranceFormInfo.default, insuranceFormInfoSelect: insuranceFormInfo.select});
      });
    }
  }else {
    res.redirect('/login');
  }
});

module.exports = router;
