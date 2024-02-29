const express = require('express');

const router = express.Router();

const indexGetController = require("../controllers/index/get")

router.get(
  '/',
    indexGetController
);
// router.post
module.exports = router;
