var express = require('express');
var router = express.Router();

const result = []

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage');
});

router.get('/result', function(req, res, next) {
  res.render('result');
});

router.get('/doctoroncall', async function(req, res, next) {
  res.render('doctoroncall.ejs', {finalize: finalize});
});

module.exports = router;
