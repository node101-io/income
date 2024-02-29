const Chain = require('../../../../models/wallet/Wallet');

module.exports = (req, res) => {
  Chain.createWallet(req.body, (err, wallet) => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true, wallet });
  });
};