const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const createChainGetController = require('../controllers/chain/create/get');
const updateChainGetController = require('../controllers/chain/update/get');
const walletsGetController = require('../controllers/chain/wallet/index/get');
const walletCreateGetController = require('../controllers/chain/wallet/create/get');
const walletUpdateGetController = require('../controllers/chain/wallet/edit/get');
const walletUpdateDeleteGetController = require('../controllers/chain/wallet/edit/delete/get')
const chainDeleteGetController = require('../controllers/chain/update/delete/get')

const updateChainPostController = require('../controllers/chain/update/post');
const createChainPostController = require('../controllers/chain/create/post');
const walletCreatePostController = require('../controllers/chain/wallet/create/post');
const walletUpdatePostController = require('../controllers/chain/wallet/edit/post');

router.get(
  '/create',
    isLoggedIn,
    createChainGetController
);

router.get(
  '/update',
    isLoggedIn,
    updateChainGetController
);

router.get(
  '/update/delete',
  isLoggedIn,
  chainDeleteGetController
);

router.get(
  '/wallet',
    isLoggedIn,
    walletsGetController
);

router.get(
  '/wallet/create',
    isLoggedIn,
    walletCreateGetController
);

router.get(
  '/wallet/edit',
    isLoggedIn,
    walletUpdateGetController
);

router.get(
  '/wallet/edit/delete',
    isLoggedIn,
    walletUpdateDeleteGetController
);

router.post(
  '/create',
    isLoggedIn,
    createChainPostController
);

router.post(
  '/update',
    isLoggedIn,
    updateChainPostController
);

router.post(
  '/wallet/create',
    isLoggedIn,
    walletCreatePostController
);

router.post(
  '/wallet/edit',
    isLoggedIn,
    walletUpdatePostController
);
module.exports = router;
