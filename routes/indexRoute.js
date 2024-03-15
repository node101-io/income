const express = require('express');

const router = express.Router();

const indexGetController = require("../controllers/index/get");
const errorGetController = require('../controllers/index/error/get');


router.get(
  '/',
    indexGetController
);

router.get(
  '/error',
    errorGetController
);

module.exports = router;
