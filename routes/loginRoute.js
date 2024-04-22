const express = require('express');

const router = express.Router();

const indexLoginGetController = require('../controllers/index/login/get');

const indexLoginPostController = require('../controllers/index/login/post');

router.get(
  '/',
    indexLoginGetController
);

router.post(
  '/',
    indexLoginPostController
);

module.exports = router;