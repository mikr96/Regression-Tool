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
  const url = 'https://cors-anywhere.herokuapp.com/https://www.doconcall.com.my/health-centre/api-campaign/duduk-rumah'
  const data_await = await fetch(url);
  const data = await data_await.json();

  const finalize = [];
  data.campaignElement.forEach(e => {
      if(typeof e.campaignPromoTitle !== "undefined") {
          finalize.push({
              "campaignType": e.campaignType,
              "campaignPromoTitle": e.campaignPromoTitle
          })
      }
  })
  console.log(finalize)
  res.render('doctoroncall.ejs', {finalize: finalize});
});

module.exports = router;
