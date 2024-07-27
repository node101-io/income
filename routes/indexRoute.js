const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const errorGetController = require('../controllers/index/error/get');
const indexGetController = require('../controllers/index/index/get');
const loginGetController = require('../controllers/index/login/get');

const loginPostController = require('../controllers/index/login/post');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);
router.get(
  '/error',
    isLoggedIn,
    errorGetController
);
router.get(
  '/login',
    loginGetController
);

router.post(
  '/login',
    loginPostController
);

module.exports = router;
