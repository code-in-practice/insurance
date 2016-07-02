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
    var insuranceFormInfo = req.session.insuranceFormInfo;
    if(serviceId && productId && insuranceFormInfo){
      insuranceFormInfo['ctl00$TopIssues$ServiceId'] = serviceId;
      insuranceFormInfo['ctl00$TopIssues$ProductId'] = productId;
      insuranceFormInfo['__EVENTTARGET'] = 'ctl00$TopIssues$ServiceId';
      delete insuranceFormInfo['ctl00$BottomIssues$btnSave'];
      delete insuranceFormInfo['ctl00$BottomIssues$btnReset'];
      requestHelper.insurancePolicyInfoPost(cookies, insuranceFormInfo, function (err, insuranceFormInfo) {
        req.session.insuranceFormInfo = insuranceFormInfo;
        res.render('order', {title: "保单录入", insuranceFormInfo: insuranceFormInfo});
      });
    }else {
      requestHelper.insurancePolicyInfoGet(cookies, function (err, insuranceFormInfo) {
        req.session.insuranceFormInfo = insuranceFormInfo;
        res.render('order', {title: "保单录入", insuranceFormInfo: insuranceFormInfo});
      });
    }
  }else {
    res.redirect('/login');
  }
});

module.exports = router;
