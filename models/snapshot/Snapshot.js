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
  is_day: { // If true, data for entire day
    type: Boolean,
    required: true
  },
  is_month: { // If true, data for entire month
    type: Boolean,
    required: true
  },
  is_year: { // If true, data for entire year.
    type: Boolean,
    required: true
  },
  chain_id: {
    type: mongoose.Types.ObjectId,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  full_time_chain_count: { // Defined only for is_total: true
    //required: true,
    type: Number
  },
  current_token_balance: { // Only If is_general is false
    type: Object
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
  current_usd_balance: { // Only If is_general is false
    type: Number
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
  date: {
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

SnapshotSchema.statics.findSnapshotByIdAndFormat = function (id, callback) {
  const Snapshot = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

    Snapshot.findWalletById(id, (err, snapshot) => {
      if (err) return callback(err);

      getSnapshot(snapshot, (err, snapshot) => {
        if (err) return callback(err);

        return callback(null, snapshot);
      });
    });
};

SnapshotSchema.statics.createSnapshot = function (data, callback) {
  const Snapshot = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  // if (!data.chain_id || !validator.isMongoId(data.chain_id.toString()))
  //   return callback('bad_request');

  const newSnapshot = new Snapshot({
    is_day: data.is_day,
    is_month: data.is_month,
    is_year: data.is_year,
    chain_id: data.chain_id,
    full_time_chain_count: data.full_time_chain_count,
    current_token_balance: data.current_token_balance,
    current_usd_balance: data.current_usd_balance,
    each_day_token_balance: data.each_day_token_balance,
    each_day_usd_balance: data.each_day_usd_balance,
    each_month_token_balance: data.each_month_token_balance,
    each_month_usd_balance: data.each_month_usd_balance,
    each_year_token_balance: data.each_year_token_balance,
    each_year_usd_balance: data.each_year_usd_balance,
    date: Date.now()
  });

  newSnapshot.save((err, snapshot) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    return callback(null, snapshot);
  });
};

SnapshotSchema.statics.findSnapshotsByFilters = function (data, callback) {
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

SnapshotSchema.statics.findSnapshotsByIdAndDelete = function (id, callback) {
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
