const Wallet = require('../../models/wallet/Wallet');

module.exports = (req, res) => {
  Wallet.findChainByIdAndDelete(req.query.id, err => {
    if (err) return res.redirect('/error?message=' + err);

    return res.redirect('/');
  });
};