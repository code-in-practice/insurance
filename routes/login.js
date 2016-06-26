var express = require('express');
var router = express.Router();

var winston = require('winston');
winston.level = 'debug';
var requestHelper = require('./requestHelper');

var captchapng = require('captchapng');

router.get('/', function(req, res, next) {
  res.render('login', {title: "登录"});
});

router.post('/', function(req, res, next) {
  var username = req.body.username || 'shunjiean01';
  var password = req.body.password || 4539;
  var captcha = req.body.captcha;

  requestHelper.loginFormInfo(function (loginFormInfo) {
    loginFormInfo['NewVerticalLoginTool1$txtUserName'] = username;
    loginFormInfo['NewVerticalLoginTool1$txtPassword'] = password;
    
    requestHelper.loginAction(loginFormInfo, function (cookies) {
      req.session.asp = cookies;
      winston.debug("cookies: ", cookies);
      res.send({code:0, cookies: cookies});
    });
  })
});


router.get('/png', function (req, res, next) {
  var width=!isNaN(parseInt(req.query.width))?parseInt(req.query.width):108;
  var height=!isNaN(parseInt(req.query.height))?parseInt(req.query.height):44;

  var code = parseInt(Math.random()*9000+1000);
  //req.session.checkcode = code;

  var p = new captchapng(width,height, code);
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);

  var img = p.getBase64();
  var imgbase64 = new Buffer(img,'base64');
  res.writeHead(200, {
    'Content-Type': 'image/png'
  });
  res.end(imgbase64);
});

module.exports = router;
