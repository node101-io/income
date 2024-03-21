const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getSnapshot = require('./functions/getSnapshot');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e3;
const MAX_DOCUMENT_COUNT_PER_QUERY = 1e2;
const PRICE_UPDATE_INTERVAL = 1 * 60 * 1e3;
const DEFAULT_DOCUMENT_COUNT_PER_QUERY = 20;

const Schema = mongoose.Schema;

const SnapshotSchema = new Schema({
  // year: {
  //   type: Number,
  //   required: true,
  //   index: true,
  //   min: 0,
  //   max: 9999
  // },
  // month: { // Format: YYYY-MM
  //   type: Number,
  //   required: true,
  //   index: true,
  //   min: 0,
  //   max: 12
  // },
  // day: {
  //   type: Number,
  //   required: true,
  //   index: true,
  //   min: 0,
  //   max: 12
  // },
  is_general: { // If true, data for entire month. Only data is spesific for a single repository
    type: Boolean,
    required: true
  },
  chain_id: {
    type: mongoose.Types.ObjectId,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  full_time_chain_count: { // Defined only for is_total: true
    required: true,
    type: Number
  },
  new_chain_count: { // Defined only for is_total: true
    type: Number,
    min: 0
  },
  each_day_token_balance: { // Defined only for is_total: true
    type: Object
  },
  each_month_token_balance: { // Defined only for is_total: true
    type: Object
  },
  each_year_token_balance: { // Defined only for is_total: true
    type: Object
  },
  each_day_usd_balance: { // Defined only for is_total: true
    type: Number
  },
  each_month_usd_balance: { // Defined only for is_total: true
    type: Number
  },
  each_year_usd_balance: { // Defined only for is_total: true
    type: Number
  },
  date : {
    type: Number,
    required: true
  }
});

SnapshotSchema.statics.findSnapshotById = function (id, callback) {
  const Snapshot = this;

  if(!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Snapshot.findById(id, (err, snapshot) => {
    if (err) return callback('database_error');
    if (!snapshot) return callback('document_not_found');

    return callback(null, snapshot)
  })
}

WalletSchema.statics.findSnapshotByIdAndFormat = function (id, callback) { // Wallet'in id'si ile bulunması ve front'a gönderilmesi için formatlanması
  const Snapshot = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

    Snapshot.findWalletById(id, (err, snapshot) => {
      if (err) return callback(err);

      getWallet(snapshot, (err, snapshot) => {
        if (err) return callback(err);

        return callback(null, snapshot);
      });
    });
};

SnapshotSchema.statics.createSnapshot = function (data, callback) {
  const Snapshot = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if(!data.is_general || typeof data.is_general != 'boolean')
    return callback('bad_request');

  if (!data.chain_id || !validator.isMongoId(data.chain_id.toString()))
    return callback('bad_request');

};

SnapshotSchema.statics.findSnapshotsByFilters = function (data, callback) { // Wallet arama, UI'da kullanılacak.
  const Snapshot = this;

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
  Snapshot.find(filters)
    .exec((err, snapshots) => {
      if (err) {
        return callback('database_error');
      }
      return callback(null, snapshots);
    });
};

SnapshotSchema.statics.findSnapshotsByIdAndDelete = function (id, callback) { // Private değil, direk silebilir
  const Snapshot = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Snapshot.findOneAndDelete({ _id: id }, (err, snapshot) => {
    if (err) return callback('database_error');
    if (!snapshot) return callback('document_not_found');

    return callback(null);
  })
};

module.exports = mongoose.model('Snapshot', SnapshotSchema);
