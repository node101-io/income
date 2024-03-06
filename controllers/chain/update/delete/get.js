const Wallet = require('../../../../models/wallet/Wallet');

module.exports = (req, res) => {
  Wallet.findChainByIdAndDelete(req.query.chain_id, err => {
    if (err) return res.redirect('/error?message=' + err);

    return res.redirect('/');
  });
};



// const Chain = require('../../../../models/chain/Chain');

// module.exports = (req, res) => {
//   Chain._findChainByIdAndDelete(req.query.id, err => {
//     if (err) return res.redirect('/error?message=' + err);

//     return res.redirect('/');
//   });
// };