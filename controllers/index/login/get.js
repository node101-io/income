module.exports = (req, res) => {
  return res.render('index/login/index', {
    page: 'index/login/index',
    title: 'Login',
    includes: {
      external: {
        css: ['form', 'general', 'page', 'text'],
        js: []
      }
    }
  });
};