module.exports = (req, res) => {
  return res.render('chain/create', {
    page: 'chain/create',
    title: 'Dashboard',
    includes: {
      external: {
        css: ['form', 'general', 'page', 'text'], //buraya dokunmadım
        js: ['page', 'serverRequest']
      }
    },
  });
};