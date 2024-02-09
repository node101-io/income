const async = require('async');
const mongoose = require('mongoose');

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
  },
  memonic: { // Text bir değer, filtreleme için. unique değil
  },
  chain_id: { // MongoDB ObjectId, relational DB mantığı
  },
  type: { // TYPE_LIST'ten biri olmalı, normal wallet ya da validator wallet
  },
  reward: { // Admin girecek, sadece validator type için YOK. yüzde cinsinden 0 100 arası bir sayı
  },
  self_value: { // Bizim kendimize ait coin miktarımız cüzdandaki admin
  },
  stake_value: { // Stake edilen coin miktarı, sadece validator type için var admin
  }, 
  last_value_update_time: { // Value'nun en son ne zaman güncellendiği, cron için lazım. UNIX timestamp olarak tutulacak, Number yap Date değil sebebini anlatıcam
  }
});

WalletSchema.statics.findWalletById = function (id, callback) { // Wallet'in id'si ile bulunması, bunu diğer repo'lardan bakabilirsin. Hassas bir nokta var, indexing hakkında. Anlatacağım
};

WalletSchema.statics.findWalletByIdAndFormat = function (id, callback) { // Wallet'in id'si ile bulunması ve front'a gönderilmesi için formatlanması
};

WalletSchema.statics.createWallet = function (data, callback) { // Admin'in wallet'i yaratması. Chain ile eşleştirmeyi unutma
};

WalletSchema.statics.findWalletByIdAndUpdate = function (id, data, callback) { // Admin wallet güncelleme
};

WalletSchema.statics.findWalletsByFilters = function (data, callback) { // Wallet arama, UI'da kullanılacak. 
};

WalletSchema.statics.findWalletByIdAndDelete = function (id, callback) { // Private değil, direk silebilir
};

WalletSchema.statics.findChainByIdAndDelete = function (chain_id, callback) { // Neden Chain'i wallet'dan siliyoruz?! :D
};

WalletSchema.statics._updateWalletValues = function (callback) { // Private fonksiyon, cron job çağıracak her sn. async lib'i ile teker teker update atmalısın
};

module.exports = mongoose.model('Wallet', WalletSchema);
