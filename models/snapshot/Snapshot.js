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

const ChainSchema = new Schema({
  token_id: {},
  chain_id: {},
  token_name: {},
  token_balance: {},
  last_avarege_update_time: {
    type: Number,
    required: true
  }
})