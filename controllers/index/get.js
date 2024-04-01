const Chain = require('../../models/chain/Chain');

module.exports = (req, res) => {
  Chain.findChainCountByFilters(req.query, (err, count) => {
    if(err) return res.redirect('/error?message=' + err);

    Chain.findChainsByFilters(req.query, (err, data) => {
      if (err) return res.redirect('/error?message=' + err);
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
        chains_limit: data.limit
      });
    });
  })
};