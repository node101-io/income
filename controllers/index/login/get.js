module.exports = (req, res) => {
  return res.render('index/login', {
    page: 'index/login',
    title: res.__('Login'),
    includes: {
      external: {
        css: ['form', 'general', 'page', 'text'],
        js: []
      }
    }
  });
};