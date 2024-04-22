module.exports = (req, res) => {
  return res.render('index/login/index', {
    page: 'index/login/index',
    title: 'Login',
    includes: {
        css: ['form', 'general', 'page', 'text'],
        js: []
    }
  });
};