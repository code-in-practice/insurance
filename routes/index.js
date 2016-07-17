var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }, function(err, html){
  	if (err) {
  		res.send(err);
  	}else{
  		res.send(html);
  	}
  });
});

module.exports = router;
