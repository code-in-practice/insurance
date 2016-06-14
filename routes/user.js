var express = require('express');
var router = express.Router();

var requestHelper = require('./requestHelper');

router.get('/', function(req, res, next) {
  var cookies = req.session.asp;
  if(cookies) {
    requestHelper.userInfo(cookies, function (userItems) {
      res.render('user', {title: "用户中心", userItems: userItems});
    });
  }else {
    res.redirect('/login');
  }

});

module.exports = router;
