const express = require('express');

const { hashtagLike, homepageLike, activityLike, discoveryLike } = require('../controllers/robo.controller')

const router = express.Router();

/* GET users listing. */
router
  .get('/test', function(req, res, next) {
    res.send('hola robolike test is working');
  })
  .get('/hashtaglike', hashtagLike)
  .get('/homepagelike', homepageLike)
  .get('/activitylike', activityLike)
  .get('/discoverylike', discoveryLike)

module.exports = router;
