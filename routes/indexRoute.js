const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require("../controllers/index/get");
const errorGetController = require('../controllers/index/error/get');


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

module.exports = router;
