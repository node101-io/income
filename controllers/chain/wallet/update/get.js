const Wallet = require('../../../../models/wallet/Wallet');

module.exports = (req, res) => {
  Wallet.findWalletByIdAndFormat(req.query.id, (err, wallet) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('wallet/update', {
      page: 'wallet/update',
      title: `${wallet.name} - Update Wallet`,
      includes: {
        external: {
          css: ['form', 'general', 'page', 'text'],
          js: ['page', 'serverRequest']
        }
      },
      wallet
    });
  });
};