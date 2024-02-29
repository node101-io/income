const Wallet = require('../../../../models/wallet/Wallet');
const Chain = require('../../../../models/chain/Chain');

module.exports = (req, res) => {
  Chain.findChainById(req.query.chain_id, (err, chain) => {
    if (err) return res.redirect('/error?message=' + err);

    Wallet.findWalletsByFilters({
      chain_id: req.query.chain_id
    }, (err, wallets) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('wallet/index', {
        page: 'wallet/index',
        title: `wallet`,
        includes: {
          external: {
            css: ['form', 'general', 'page', 'text'],
            js: ['page', 'serverRequest']
          }
        },
        wallets,
        chain
      });
    });
  });
};
