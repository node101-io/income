const croner = require('croner');

const Chain = require('../models/chain/Chain');
const Wallet = require('../models/wallet/Wallet');
const Snapshot = require('../models/snapshot/Snapshot');

const Job = {
  start: callback => {
    croner.Cron(process.env.SCHEDULE || '*/5 * * * *' , () => {
      Chain._updateChainPrices((err) => {
        if (err)
          return console.log(err);

        //console.log(`Price updatesd ${Date.now()}`);
      });
    });

    croner.Cron(process.env.SCHEDULE || '*/60 * * * *' , () => {
      Wallet._updateWalletValues((err) => {
        if (err)
          return console.log(err);
      });
    });

    croner.Cron(process.env.SCHEDULE || '*/15 * * * *' , () => {
      Chain.calculateTotalValueOfAllChains((err, chainsTotalValue) => {
        const data = {
          is_day: false,
          is_month: false,
          is_year: false,
          current_usd_balance: chainsTotalValue
        };

        Snapshot.createSnapshot(data , (err, snapshot) => {
          if (err)
          return console.log(err);

          console.log("snapshot created")
        });
      });
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      Snapshot.findSnapshotsByFilters({ date: { $gte: oneHourAgo }} , (err, snapshot) => {
        if(err)
        return console.log(err);

        if(snapshot){

        }

      });
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