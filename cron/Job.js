const croner = require('croner');

const Chain = require('../models/chain/Chain');

const Job = {
  start: callback => {
    croner.Cron(process.env.SCHEDULE || '*/5 * * * *' , () => {
      Chain._updateChainPrices((err) => {
        if (err)
          return console.log(err);

        console.log(`Price updated ${Date.now()}`);
      });
    });
    callback(null);
  }
};

module.exports = Job;