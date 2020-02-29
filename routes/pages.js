const express = require('express')
const router = express.Router()

//Home Page
router.get('/homepage', (req,res) => {
  res.send('Homepage')
})

//Result Page
router.get('/result', (req,res) => {
  res.send('Result')
})

module.exports = router