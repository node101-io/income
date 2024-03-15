const Chain = require('../../../models/chain/Chain');

module.exports = (req, res) => {
  Chain.createChain(req.body, (err, chain) => {
    console.log(err);
    if (err) return res.redirect('/error?message=' + err);

    return res.redirect('/');
  });
};