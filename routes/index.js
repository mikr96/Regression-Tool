var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage');
});

router.get('/TCP-S', function(req, res, next) {
  res.render('TCP');
});

router.get('/TCP-F', function(req, res, next) {
  res.render('TCPF');
});

router.get('/TCS', function(req, res, next) {
  res.render('TCS');
});

router.get('/Hybrid', function(req, res, next) {
  res.render('Hybrid');
});

router.get('/TCPH', function(req, res, next) {
  res.render('TCPH');
});

router.get('/result', function(req, res, next) {
  res.render('result');
});

router.get('/doctoroncall', function(req, res, next) {
  res.render('doctoroncall');
});

module.exports = router;
