const Wallet = require('../../../../models/wallet/Wallet');

module.exports = (req, res) => {
  Wallet._findChainByIdAndDelete(req.query.id, err => {
    if (err) return res.redirect('/error?message=' + err);

    return res.redirect('/');
  });
};