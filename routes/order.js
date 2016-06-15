var express = require('express');
var router = express.Router();

var requestHelper = require('./requestHelper');

router.get('/', function(req, res, next) {
  var cookies = req.session.asp;
  if(cookies) {
    requestHelper.historicalRecordsList(cookies, function (orderItems) {
      res.render('order', {title: "代理保单", orderItems: orderItems});
    });
  }else {
    res.redirect('/login');
  }

});

module.exports = router;
