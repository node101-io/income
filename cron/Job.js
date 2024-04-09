const croner = require('croner');

const Chain = require('../models/chain/Chain');

const Job = {
  start: callback => {
    croner.Cron(process.env.SCHEDULE || '*/5 * * * *' , () => {
      Chain._updateChainPrices((err) => {
        if (err)
          return console.log(err);

        console.log(`Price updatesd ${Date.now()}`);
      });
    });
    croner.Cron(process.env.SCHEDULE || '*/5 * * * *' , () => {
      // date'i kontrol et eğer date - current day > 60 dakika
        //create snapshot with  is_hour: true
      // date'i kontrol et eğer date - current day > 24 saat
        //create snapshot with  is_day: true
      // date'i kontrol et eğer date - current day > 30 gün
        //create snapshot with  is_month: true
    });
    callback(null);
  }
};

module.exports = Job;