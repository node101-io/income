const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Chain = require('../chain/Chain');

const getWallet = require('./functions/getWallet');
const getUpdatedWalletValues = require('./functions/getUpdateWalletValues');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e3;
const MAX_QUERY_COUNT = 1e2;
const TYPE_LIST = ['normal', 'validator'];
const VALUE_UPDATE_INTERVAL = 1 * 60 * 1e3;

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  public_key: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  name: {
    type: String,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  chain_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  type: {
    type: String,
    required: true,
    default: 'normal',
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  reward_commission: {
    type: Number,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  self_stake_value: {
    type: Number,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  stake_value: {
    type: Number,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  available_balance: {
    type: Number,
    default: 0,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  last_value_update_time: {
    type: Number,
    required: true
  }
});

WalletSchema.statics.findWalletById = function (id, callback) {
  const Wallet = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Wallet.findById(id, (err, wallet) => {
    if (err) return callback('database_error');
    if (!wallet) return callback('document_not_found');

    return callback(null, wallet)
  });
};

WalletSchema.statics.findWalletByIdAndFormat = function (id, callback) {
  const Wallet = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

    Wallet.findWalletById(id, (err, wallet) => {
      if (err) return callback(err);

      getWallet(wallet, (err, wallet) => {
        if (err) return callback(err);

        return callback(null, wallet);
      });
    });
};

WalletSchema.statics.createWallet = function (data, callback) {
  const Wallet = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');
  if (!data.public_key || typeof data.public_key != 'string' || !data.public_key.trim().length || data.public_key.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');
  if (!data.chain_id || !validator.isMongoId(data.chain_id.toString()) || !data.chain_id.trim().length || data.chain_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if(data.name && (typeof data.name != 'string' || !data.name.trim().length || data.name.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH))
  return callback('bad_request');

  const newWallet = new Wallet({
    public_key: data.public_key.trim(),
    name: data.name.trim(),
    chain_id: data.chain_id.trim(),
    type: data.type,
    reward_commission: data.reward_commission,
    self_stake_value: data.self_stake_value,
    stake_value: data.stake_value,
    available_balance: data.available_balance,
    last_value_update_time: Date.now()
  });

  newWallet.save((err, wallet) => {
    console.log(err);
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    return callback(null, wallet);
  });
};

WalletSchema.statics.findWalletByIdAndUpdate = function (id, data, callback) {
  const Wallet = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');
  if (!data || typeof data != 'object')
    return callback('bad_request');
  // if (!data.type || typeof data.type != 'string' || !data.type.trim().length || data.type.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
  //   return callback('bad_request');

  Wallet.findByIdAndUpdate(id, { $set: {
    name: data.name,
    type: data.type,
    reward_commission: data.reward_commission,
    self_stake_value: data.self_stake_value,
    stake_value: data.stake_value,
    available_balance: data.available_balance
  }}, { new: true }, (err, wallet) => {
    if (err) return callback('database_error');
    if (!wallet) return callback('document_not_found');

    getWallet(wallet, (err, wallet) => {
      if (err) return callback(err);

      return callback(null, wallet);
    });
  });
};

WalletSchema.statics.findWalletsByFilters = function (data, callback) {
  const Wallet = this;

  const filters = {};
  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (data.chain_id && validator.isMongoId(data.chain_id.toString()))
    filters.chain_id = data.chain_id.toString();

    if (data.search && typeof data.search == 'string' && data.search.trim().length && data.search.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH){
    filters.$or = [
      { public_key: { $regex: data.search.trim()}}
    ];
  }
  Wallet.find(filters)
    .exec((err, wallets) => {
      if (err) {
        return callback('database_error');
      }
      return callback(null, wallets);
    });
};

WalletSchema.statics.findWalletByIdAndDelete = function (id, callback) {
  const Wallet = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Wallet.findOneAndDelete({ _id: id }, (err, wallet) => {
    if (err) return callback('database_error');
    if (!wallet) return callback('document_not_found');

    return callback(null);
  })
};

WalletSchema.statics.findChainByIdAndDelete = function (chain_id, callback) {
  const Wallet = this;

  Wallet.findWalletsByFilters({
    chain_id: chain_id
  }, (err, wallets) => {
    if (err) return callback(err);
    if (!wallets) return callback('document_not_found');

    async.timesSeries(
      wallets.length,
      (time, next) => Wallet.findWalletByIdAndDelete(wallets[time]._id, err => {
        if (err) return callback(err);

        return callback(null);
      }),
      err => {
        if (err) return callback(err);

        Chain._findChainByIdAndDelete(chain_id, err => {
          if (err) return callback(err);

          return callback(null);
        })
      }
    );
  });
};

WalletSchema.statics._updateWalletValues = function (callback) {
  const Wallet = this;

  Wallet.findWalletsByFilters({}, (err, wallets) => {
    if (err) return callback('bad_request');
    if (!wallets || wallets.length === 0) return callback('document_not_found');

    async.timesSeries(
      wallets.length,
      (index, next) => {
        const wallet = wallets[index];

        const walletUpdatedValues = {
          reward_commission: getUpdatedWalletValues.calculateRewardCommission(wallet),
          self_stake_value: getUpdatedWalletValues.calculateSelfStakeValue(wallet),
          stake_value: getUpdatedWalletValues.calculateStakeValue(wallet),
          available_balance: getUpdatedWalletValues.calculateAvailableBalance(wallet)
        };

        const walletUpdatedTotalValue = {
          total_value : getUpdatedWalletValues.calculateTotalValue(wallet)
        }

        Wallet.findWalletByIdAndUpdate(wallet._id, walletUpdatedValues, (err, updatedWallet) => {
          if (err) return callback('bad_request');

          next(err, updatedWallet);
        });
        Chain._findChainByIdAndIncreaseTotalValue(wallet.chain_id, walletUpdatedTotalValue, (err, updatedChainTotalValue) => {
          if (err) return callback('bad_request');

          return callback(null);
        })
      },
      (err, updatedWallets) => callback(err, updatedWallets)
    );
  });
};

// WalletSchema.statics._updateWalletValues = function (callback) { // Private fonksiyon, cron job çağıracak her sn. async lib'i ile teker teker update atmalısın
// //bütün walletları alacaksın bunun için filter methodunu kullanabilirsin
// //walletların hepsini alınca wallet in wallets çağırıp async bir şekilde her birinin available balance'ını updateleyeceksin

//   const Wallet = this;
//   Wallet.findWalletsByFilters({}, (err, wallets)=>{
//     if (err) return callback('bad_request');
//     if (!wallets) return callback('document_not_found');

//     async.timesSeries(
//       wallets.length,
//       (time, next) => Wallet.findWalletByIdAndUpdate(wallets[time]._id, , (err, wallet) => next(err, wallet)),
//       (err, wallets) => callback(err, wallets)
//     );
//   })
// };

module.exports = mongoose.model('Wallet', WalletSchema);
