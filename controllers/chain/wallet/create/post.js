const Wallet = require('../../../../models/wallet/Wallet');

module.exports = (req, res) => {
  Wallet.createWallet(req.body, (err, wallet) => {
    if (err)
      return res.json({ success: false, error: err });

    return res.json({ success: true, wallet });
  });
};