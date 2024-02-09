const async = require('async');
const mongoose = require('mongoose');

const getChain = require('./functions/getChain'); // Hangi field'ları kullanıcı front'ta görmeli yaklaşımı ile yazılacak
const getPriceFromAPI = require('./functions/getPriceFromAPI'); // API'a istek atıp price çekeceksin, burasını diğer repo'larda görebilirsin

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000; // duplicated unique field ne kendi kendine çözmeni bekliyorum onu anlatmayacağım :)
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e3; // Hack yemeyelim diye, bunu da düşünüp anla
const MAX_QUERY_COUNT = 1e2; // Tek seferde kaç chain döndürülecek en fazla
const PRICE_UPDATE_INTERVAL = 1 * 60 * 1e3; // Price'ın kaç sn'de bir güncelleneceği, cron job için lazım

const Schema = mongoose.Schema;

const ChainSchema = new Schema({
  identifier: { // Bu chain'in identifier'ı, sallamıyoruz her chain'in var zaten unique. Coin adı gibi düşün ama birebir aynı değil
  },
  apr: { // Normal şartlarda API'dan çekmek lazım, ama şimdilik admin'ler manuel girecek
  },
  price: { // API'dan çekilecek fonksiyon ile, cron kullanarak düzenli (her dk'da bir mesela) güncellenmeli
  },
  last_price_update_time: { // Price'ın en son ne zaman güncellendiği, cron için lazım. UNIX timestamp olarak tutulacak, Number yap Date değil sebebini anlatıcam
  },
  total_value: { // Coin olarak toplam bu chain'de ne kadar var, wallet modelleri update atacak
  }
});

ChainSchema.statics.createChain = function (data, callback) { // Admin'in chain'i yaratması
};

ChainSchema.statics.findChainById = function (id, callback) { // Chain'in id'si ile bulunması, bunu diğer repo'lardan bakabilirsin. Hassas bir nokta var, indexing hakkında. Anlatacağım
};

ChainSchema.statics.findChainByIdAndFormat = function (id, callback) { // Chain'in id'si ile bulunması ve front'a gönderilmesi için formatlanması
};

ChainSchema.statics.findChainByIdAndUpdate = function (id, data, callback) { // Admin chain güncelleme
};

ChainSchema.statics.findChainsByFilters = function (data, callback) { // Chain arama, wallet yaratırken buraya istek atacak. Text search yazmanı istiyorum identifier üzerine. Alfabetik sıralama yapılacak. Sonuçları limitle
};

ChainSchema.statics._updateChainPrices = function (callback) { // Private fonksiyon, cron job çağıracak her 5 sn. async lib'i ile teker teker update atmalısın
};

ChainSchema.statics._findChainByIdAndIncreaseTotalValue = function (id, value, callback) { // Wallet çağırabilir sadece, anlattım :)
};

ChainSchema.statics._findChainByIdAndDelete = function (id, callback) { // Wallet çağırabilir sadece, anlatıcam
};

module.exports = mongoose.model('Chain', ChainSchema);
