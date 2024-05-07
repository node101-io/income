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

    croner.Cron(process.env.SCHEDULE || '*/1 * * * *' , () => {
      Chain.calculateTotalValueOfAllChains((err, chainsTotalValue) => {
        const data = {
          is_hour: false,
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

      // const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const oneHourAgo = Date.now() - (60 * 4 * 1000);
      const hourlyData = {
        date: { $lte: oneHourAgo },
        is_hour: false,
        is_day: false,
        is_month: false,
        is_year: false,
      };

      Snapshot.findSnapshotsByFiltersAndMerge(hourlyData, (err, snapshot) => {
        if (err)
        return console.log(err)
      if (snapshot)
      console.log('hour snapshot created');
      });

      // const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const oneDayAgo = Date.now() - (24 * 60 * 1000);
      const dailyData = {
        date: { $gte: oneDayAgo },
        is_hour: true,
        is_day: false,
        is_month: false,
        is_year: false,
      };

      // Snapshot.findSnapshotsByFiltersAndMerge(dailyData, (err, snapshot) => {
      //   if (err)
      //   return console.log(err)
      // if (snapshot)
      // console.log('hour snapshot created');
      // });

      // const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = Date.now() - (24 * 60 * 10 * 1000);
      const monthlyData = {
        date: { $gte: oneMonthAgo },
        is_hour: true,
        is_day: false,
        is_month: false,
        is_year: false,
      };

      // Snapshot.findSnapshotsByFiltersAndMerge(monthlyData, (err, snapshot) => {
      //   if (err)
      //   return console.log(err)
      // if (snapshot)
      // console.log('hour snapshot created');
      // });
    });
    callback(null);
  }
};

module.exports = Job;