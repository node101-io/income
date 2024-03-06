const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getChain = require('./functions/getChain'); // Hangi field'ları kullanıcı front'ta görmeli yaklaşımı ile yazılacak
const getPriceFromAPI = require('./functions/getPriceFromAPI'); // API'a istek atıp price çekeceksin, burasını diğer repo'larda görebilirsin

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000; // duplicated unique field ne kendi kendine çözmeni bekliyorum onu anlatmayacağım :)
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e3; // Hack yemeyelim diye, bunu da düşünüp anla
const MAX_QUERY_COUNT = 1e2; // Tek seferde kaç chain döndürülecek en fazla
const PRICE_UPDATE_INTERVAL = 1 * 60 * 1e3; // Price'ın kaç sn'de bir güncelleneceği, cron job için lazım

const Schema = mongoose.Schema;

const ChainSchema = new Schema({
  identifier: { // Bu chain'in identifier'ı, sallamıyoruz her chain'in var zaten unique. Coin adı gibi düşün ama birebir aynı değil
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  apr: { // Normal şartlarda API'dan çekmek lazım, ama şimdilik admin'ler manuel girecek
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  token: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  price: { // API'dan çekilecek fonksiyon ile, cron kullanarak düzenli (her dk'da bir mesela) güncellenmeli
    type: Number,
    default: null,
    min: 0
  },
  last_price_update_time: { // Price'ın en son ne zaman güncellendiği, cron için lazım. UNIX timestamp olarak tutulacak, Number yap Date değil sebebini anlatıcam
    type: Number,
    default: null,
    min: 0
  },
  total_value: { // Coin olarak toplam bu chain'de ne kadar var, wallet modelleri update atacak
    type: Number,
    default: 0,
    min: 0
  }
});

ChainSchema.statics.createChain = function (data, callback) { // Admin'in chain'i yaratması
  const Chain = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.identifier || typeof data.identifier != 'string' || !data.identifier.trim().length || data.identifier.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  const token = data.token.trim();

  getPriceFromAPI(token, (err, price) => {
    if (err) return callback(err);
    if (!price) return callback('document_not_found');

    const newChain = new Chain({
      identifier: data.identifier.trim(),
      apr: data.apr,
      token: token,
      price: price
    });

    newChain.save((err, chain) => {
      if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
        return callback('duplicated_unique_field');
      if (err)
        return callback('database_error');

      return callback(null, chain);
    });
  });
};

ChainSchema.statics.findChainById = function (id, callback) { // Chain'in id'si ile bulunması, bunu diğer repo'lardan bakabilirsin. Hassas bir nokta var, indexing hakkında. Anlatacağım
  const Chain = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Chain.findById(id, (err, chain) => {
    if (err) return callback('database_error');
    if (!chain) return callback('document_not_found');

    return callback(null, chain);
  });
};

ChainSchema.statics.findChainByIdAndFormat = function (id, callback) { // Chain'in id'si ile bulunması ve front'a gönderilmesi için formatlanması
  const Chain = this;
  if (!id || !id.length || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Chain.findChainById(mongoose.Types.ObjectId(id.toString()), (err, chain) => {
    if (err) return callback(err);

    getChain(chain, (err, chain) => {
      if (err) return callback(err);

      return callback(null, chain);
    });
  });
};

ChainSchema.statics.findChainByIdAndUpdate = function (id, data, callback) { // Admin chain güncelleme
  const Chain = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');
  if (!data || typeof data != 'object')
    return callback('bad_request');


  Chain.findByIdAndUpdate(id, { $set: {
    identifier: data.identifier,
    apr: data.apr,
    price: data.price,
    last_price_update_time: data.last_price_update_time,
    total_value: data.total_value
  }}, { new: true }, (err, chain) => {
    if (err) return callback('database_error');
    if (!chain) return callback('document_not_found');

    getChain(chain, (err, chain) => {
      if (err) return callback(err);

      return callback(null, chain);
    });
  });
};

ChainSchema.statics.findChainsByFilters = function (data, callback) { // Chain arama, wallet yaratırken buraya istek atacak. Text search yazmanı istiyorum identifier üzerine. Alfabetik sıralama yapılacak. Sonuçları limitle
  const Chain = this;

  if (!data || typeof data != 'object') {
    return callback('bad_request')};

  const filters = {};

  if (data.search && typeof data.search == 'string' && data.search.trim().length && data.search.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH){
    filters.$or = [
      { identifier: { $regex: data.search.trim(), $options: 'i' } }
    ];
  };

  Chain.find(filters)
    .sort({ identifier: 1 }) // Alphabetical sorting by 'identifier'
    .exec((err, chains) => {
      if (err) {
        return callback('database_error');
      }
      return callback(null, chains);
    });
};

ChainSchema.statics._updateChainPrices = function (callback) { // Private fonksiyon, cron job çağıracak her 5 sn. async lib'i ile teker teker update atmalısın
  const Chain = this;

  Chain.findChainsByFilters({}, (err, chains) => {
    if (err) return callback('database_error');
    if (!chains) return callback('document_not_found');

    async.timesSeries(
      chains.length,
      (time, next) => {
        getPriceFromAPI(chains[time].token, (err, price) => {
          if (err) return callback(err);

          Chain.findChainByIdAndUpdate(chains[time]._id, {
            price: price,
            last_price_update_time: Date.now()
          }, (err, chain) => {
            if (err) return callback(err);

            return callback(null);
          })
        });
      },
    )
  });
};

ChainSchema.statics._findChainByIdAndIncreaseTotalValue = function (id, value, callback) { // Wallet çağırabilir sadece, anlattım :)
};

ChainSchema.statics._findChainByIdAndDelete = function (id, callback) { // Wallet çağırabilir sadece, anlatıcam
  const Chain = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Chain.deleteOne({
    _id: id
  }, (err, result) => {

    if (err) return callback('database_error');
    if (result.deletedCount === 0) return callback('document_not_found');

    return callback(null, id);
  });

};

module.exports = mongoose.model('Chain', ChainSchema);
