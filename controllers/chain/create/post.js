const Chain = require('../../../models/chain/Chain');

module.exports = (req, res) => {
  Chain.createChain(req.body, (err, chain) => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, chain }));
    return res.end();
  });
};