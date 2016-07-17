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
  var username = req.body.username;
  var password = req.body.password;
  var captcha = req.body.captcha;
  var captchaCookie = req.session.captcha || '';
  if(!captcha || captchaCookie != captcha){
    res.send({code:-1, message: "验证码不正确"});
  }else{
    requestHelper.loginFormInfo(function (loginFormInfo) {
      loginFormInfo['NewVerticalLoginTool1$txtUserName'] = username;
      loginFormInfo['NewVerticalLoginTool1$txtPassword'] = password;
      
      requestHelper.loginAction(loginFormInfo, function (err, cookies) {
        winston.debug('err', err);
        winston.debug('cookies', cookies);
        if(err){
          res.send({code:-1, message: err});
        }else{
          req.session.asp = cookies;
          winston.debug("cookies: ", cookies);
          res.send({code:0, message: 'success', cookies: cookies});
        }
      });
    })
  }
});


router.get('/png', function (req, res, next) {
  var width=!isNaN(parseInt(req.query.width))?parseInt(req.query.width):108;
  var height=!isNaN(parseInt(req.query.height))?parseInt(req.query.height):44;

  var code = parseInt(Math.random()*9000+1000);
  var codeStr = code + '';
  codeStr = codeStr.replace(/1/g, 2);
  codeStr = codeStr.replace(/7/g, 8);
  //req.session.checkcode = code;

  var p = new captchapng(width,height, parseInt(codeStr));
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);

  var img = p.getBase64();
  var imgbase64 = new Buffer(img,'base64');

  req.session.captcha = codeStr;
  res.writeHead(200, {
    'Content-Type': 'image/png'
  });
  res.end(imgbase64);
  
});

module.exports = router;
