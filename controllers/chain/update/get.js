const Chain = require('../../../models/chain/Chain');

module.exports = (req, res) => {
  Chain.findChainByIdAndFormat(req.query.id, (err, chain) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('update/index', {
      page: 'update/index',
      title: `${chain.identifier} - Update Chain`,
      includes: {
        external: {
          css: ['form', 'general', 'page', 'text'],
          js: ['page', 'serverRequest']
        }
      },
      chain
    });
  });
};