var express = require('express');
var router = express.Router();

var captchapng = require('captchapng');

router.get('/', function(req, res, next) {
  res.render('login', {});
});

router.get('/png', function (req, res, next) {
  var width=!isNaN(parseInt(req.query.width))?parseInt(req.query.width):100;
  var height=!isNaN(parseInt(req.query.height))?parseInt(req.query.height):30;

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
