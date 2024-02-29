const Chain = require('../../../models/chain/Chain');

module.exports = (req, res) => {
  Chain.findChainByIdAndUpdate(req.query.id, req.body, (err, chain) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({ success: true, chain });
  });
};