const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Chain = require('../chain/Chain');

const getWallet = require('./functions/getWallet');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e3;
const MAX_QUERY_COUNT = 1e2;
const TYPE_LIST = ['normal', 'validator']; // her wallet'ın 2 tipi var, ona göre yazılmalı bütün kod
const VALUE_UPDATE_INTERVAL = 1 * 60 * 1e3; // Wallet üzerindeki value'nun güncellenmesi. APR ile çarparak bulacaksın

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  public_key: { // Identifier olarak, unique yine
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  name: { // Text bir değer, filtreleme için. unique değil
    type: String,
    trim: true,
    unique: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  chain_id: { // MongoDB ObjectId, relational DB mantığı
    type: mongoose.Types.ObjectId,
    required: true,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  type: { // TYPE_LIST'ten biri olmalı, normal wallet ya da validator wallet
    type: String,
    required: true,
    default: 'normal',
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  reward_comission: { // Admin girecek, sadece validator type için YOK. yüzde cinsinden 0 100 arası bir sayı
    type: Number,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  self_stake_value: { // Bizim kendimize ait coin miktarımız cüzdandaki admin
    type: Number,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  stake_value: { // Stake edilen coin miktarı, sadece validator type için var admin
    type: Number,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  available_balance: {
    type: Number,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  last_value_update_time: { // Value'nun en son ne zaman güncellendiği, cron için lazım. UNIX timestamp olarak tutulacak, Number yap Date değil sebebini anlatıcam
    type: Number,
    required: true
  }
});

WalletSchema.statics.findWalletById = function (id, callback) { // Wallet'in id'si ile bulunması, bunu diğer repo'lardan bakabilirsin. Hassas bir nokta var, indexing hakkında. Anlatacağım
  const Wallet = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Wallet.findById(id, (err, wallet) => {
    if (err) return callback('database_error');
    if (!wallet) return callback('document_not_found');

    return callback(null, wallet)
  });
};

WalletSchema.statics.findWalletByIdAndFormat = function (id, callback) { // Wallet'in id'si ile bulunması ve front'a gönderilmesi için formatlanması
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

WalletSchema.statics.createWallet = function (data, callback) { // Admin'in wallet'i yaratması. Chain ile eşleştirmeyi unutma
  const Wallet = this;
  if (!data || typeof data != 'object')
    return callback('bad_request');
  if (!data.public_key || typeof data.public_key != 'string' || !data.public_key.trim().length || data.public_key.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');
  if(!data.chain_id || !validator.isMongoId(data.chain_id.toString()) || !data.chain_id.trim().length || data.chain_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  const newWallet = new Wallet({
    public_key: data.public_key.trim(),
    name: data.name.trim(),
    chain_id: data.chain_id,
    type: data.type,
    last_value_update_time: data.last_value_update_time,
  })

  newWallet.save((err, wallet) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    return callback(null, wallet);
  });
};

WalletSchema.statics.findWalletByIdAndUpdate = function (id, data, callback) { // Admin wallet güncelleme
  const Wallet = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');
  if (!data || typeof data != 'object')
    return callback('bad_request');
    if (!data.type || typeof data.type != 'string' || !data.type.trim().length || data.type.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  Wallet.findByIdAndUpdate(id, { $set: {
    name: data.name,
    type: data.type,
    reward_comission: data.reward_comission
  }}, { new: true }, (err, wallet) => {
    if (err) return callback('database_error');
    if (!wallet) return callback('document_not_found');

    getWallet(wallet, (err, wallet) => {
      if (err) return callback(err);

      return callback(null, wallet);
    });
  });
};

WalletSchema.statics.findWalletsByFilters = function (data, callback) { // Wallet arama, UI'da kullanılacak.
  const Wallet = this;

  const filters = {};
  if (!data || typeof data != 'object')
    return callback('bad_request');

  if(data.chain_id && validator.isMongoId(data.chain_id.toString()))
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

WalletSchema.statics.findWalletByIdAndDelete = function (id, callback) { // Private değil, direk silebilir
  const Wallet = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Chain.findChainById(mongoose.Types.ObjectId(id.toString()), (err, wallet) => {
    if (err) return callback(err);

    getWallet(wallet, (err, wallet) => {
      if (err) return callback(err);

      return callback(null, wallet);
    });
  });
};//burada wallet silinirken chaini kontrol edecek dikkat et

WalletSchema.statics.findChainByIdAndDelete = function (chain_id, callback) { // Neden Chain'i wallet'dan siliyoruz?! :D
};

WalletSchema.statics._updateWalletValues = function (callback) { // Private fonksiyon, cron job çağıracak her sn. async lib'i ile teker teker update atmalısın
};

module.exports = mongoose.model('Wallet', WalletSchema);
