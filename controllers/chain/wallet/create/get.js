const Chain = require('../../../../models/chain/Chain');

module.exports = (req, res) => {
  Chain.findChainByIdAndFormat(req.query.chain_id, (err, chain) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('wallet/create', {
      page: 'wallet/create',
      title: 'Update Wallet',
      includes: {
        external: {
          css: ['form', 'general', 'page', 'text'],
          js: ['page', 'serverRequest']
        }
      },
      chain
    });
  });
};