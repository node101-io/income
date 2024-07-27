const croner = require('croner');

const Chain = require('../models/chain/Chain');
const Wallet = require('../models/wallet/Wallet');
const Snapshot = require('../models/snapshot/Snapshot');

const EVERY_FIVE_MINS_CRON = '*/5 * * * *';
const EVERY_HOUR_CRON = '*/60 * * * *';
const EVERY_MIN_CRON = '*/1 * * * *';

const Job = {
  start: callback => {
    croner.Cron(EVERY_FIVE_MINS_CRON, () => {
      Chain._updateChainPrices((err) => {
        if (err)
          return console.log(err);

        //console.log(`Price updatesd ${Date.now()}`);
      });
    });

    croner.Cron(EVERY_HOUR_CRON, () => {
      Wallet._updateWalletValues((err) => {
        if (err)
          return console.log(err);
      });
    });

    croner.Cron(EVERY_MIN_CRON, () => {
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
        });
      });

      // const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const oneHourAgo = Date.now() - (2 * 60 * 1000);
      const hourlyData = {
        // date: { $lte: oneHourAgo },
        date_before: oneHourAgo,
        is_hour: false,
        is_day: false,
        is_month: false,
        is_year: false
      };

      Snapshot.findSnapshotsByFiltersAndMerge(hourlyData, (err, snapshot) => {
        if (err)
        return console.log(err)
      });

      // const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const oneDayAgo = Date.now() - (4 * 60 * 1000);
      const dailyData = {
        // date: { $lte: oneDayAgo },
        date_before: oneDayAgo,
        is_hour: true,
        is_day: false,
        is_month: false,
        is_year: false
      };

      Snapshot.findSnapshotsByFiltersAndMerge(dailyData, (err, snapshot) => {
        if (err)
        return console.log(err)
      });

      // const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = Date.now() - (8 * 60 * 1000);
      const monthlyData = {
        // date: { $lte: oneMonthAgo },
        date_before: oneMonthAgo,
        is_hour: false,
        is_day: true,
        is_month: false,
        is_year: false
      };

      Snapshot.findSnapshotsByFiltersAndMerge(monthlyData, (err, snapshot) => {
        if (err)
        return console.log(err)
      });

      // const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
      const oneYearAgo = Date.now() - (16 * 60 * 1000);
      const yearlyData = {
        date_before: oneYearAgo,
        is_hour: false,
        is_day: false,
        is_month: true,
        is_year: false
      };

      Snapshot.findSnapshotsByFiltersAndMerge(yearlyData, (err, snapshot) => {
        if (err) return console.log(err);
      });
    });

    callback();
  }
};

module.exports = Job;