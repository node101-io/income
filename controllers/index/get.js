const Chain = require('../../models/chain/Chain');

module.exports = (req, res) => {
  Chain.findChainsByFilters({}, (err, chains) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('index/index', {
      page: 'index/index',
      title: 'Dashboard',
      includes: {
        external: {
          css: ['form', 'general', 'page', 'text'], //buraya dokunmadım
          js: ['page', 'serverRequest']
        }
      },
      chains,
    });
  });
};