const express = require('express');

const router = express.Router();

const updateChainGetController = require('../controllers/chain/update/get');
const WalletsGetController = require('../controllers/chain/wallet/index/get')
const WalletUpdateGetController = require('../controllers/chain/wallet/update/get');

const updateChainPostController = require('../controllers/chain/update/post')
const createChainPostController = require('../controllers/chain/create/post');
const createWalletsChainPostController = require('../controllers/chain/wallet/create/post');
const WalletUpdatePostController = require('../controllers/chain/wallet/update/post');


router.get(
  '/update',
    updateChainGetController
);

router.get(
  '/wallet',
    WalletsGetController
);

router.get(
  '/wallet/update',
    WalletUpdateGetController
);

router.post(
  '/create',
    createChainPostController
);

router.post(
  '/update',
    updateChainPostController
);

router.post(
  '/wallet/create',
    createWalletsChainPostController
);

router.post(
  '/wallet/update',
    WalletUpdatePostController
);
module.exports = router;
