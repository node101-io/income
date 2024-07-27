const Chain = require('../../../models/chain/Chain');
const Snapshot = require('../../../models/snapshot/Snapshot')
module.exports = (req, res) => {
  Chain.findChainCountByFilters(req.query, (err, count) => {
    if(err) return res.redirect('/error?message=' + err);

    Chain.findChainsByFilters(req.query, (err, data) => {
      if (err) return res.redirect('/error?message=' + err);

      Chain.calculateTotalValueOfAllChains((err, totalValueOfAllChains) => {
        if(err) return res.redirect('/error?message=' + err);

        Snapshot.findSnapshotsByFilters(req.query, (err, snapshots) => {
          if (err) return res.redirect('/error?message=' + err);

          const options = [
            "Last 24 hours",
            "Month",
            "Year"
          ];

          return res.render('index/index', {
            page: 'index/index',
            title: 'Dashboard',
            includes: {
              external: {
                css: ['form', 'general', 'page', 'text', 'navigation', 'header', 'snapshot'],
                js: ['page', 'serverRequest', 'chart.js']
              }
            },
            chains_count: count,
            chains: data.chains,
            chains_search: data.search,
            chains_page: data.page,
            chains_limit: data.limit,
            chains_total_value: totalValueOfAllChains.toFixed(2),
            snapshots: snapshots,
            options: options
          });
        });
      });
    });
  });
};