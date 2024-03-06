const express = require('express');

const router = express.Router();

const createChainGetController = require('../controllers/chain/create/get');
const updateChainGetController = require('../controllers/chain/update/get');
const WalletsGetController = require('../controllers/chain/wallet/index/get');
const WalletCreateGetController = require('../controllers/chain/wallet/create/get');
const WalletUpdateGetController = require('../controllers/chain/wallet/edit/get');
const walletUpdateDeleteGetController = require('../controllers/chain/wallet/edit/delete/get')
const chainDeleteGetController = require('../controllers/chain/update/delete/get')

const updateChainPostController = require('../controllers/chain/update/post');
const createChainPostController = require('../controllers/chain/create/post');
const WalletCreatePostController = require('../controllers/chain/wallet/create/post');
const WalletUpdatePostController = require('../controllers/chain/wallet/edit/post');

router.get(
  '/create',
    createChainGetController
);

router.get(
  '/update',
    updateChainGetController
);

router.get(
  '/update/delete',
    chainDeleteGetController
);

router.get(
  '/wallet',
    WalletsGetController
);

router.get(
  '/wallet/create',
    WalletCreateGetController
);

router.get(
  '/wallet/edit',
    WalletUpdateGetController
);

router.get(
  '/wallet/edit/delete',
    walletUpdateDeleteGetController
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
    WalletCreatePostController
);

router.post(
  '/wallet/edit',
    WalletUpdatePostController
);
module.exports = router;
