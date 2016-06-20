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
    requestHelper.insurancePolicyInfo(cookies, function (insuranceFormInfo) {
      res.render('order', {title: "保单录入", insuranceFormInfo: insuranceFormInfo});
    });
  }else {
    res.redirect('/login');
  }

});

module.exports = router;
