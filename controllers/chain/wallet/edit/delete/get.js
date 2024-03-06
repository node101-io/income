const Wallet = require('../../../../../models/wallet/Wallet');

module.exports = (req, res) => {
  Wallet.findWalletByIdAndDelete(req.query.id, err => {
    console.log(err);
    if (err) return res.redirect('/error?message=' + err);

    return res.redirect('/');
  });
};