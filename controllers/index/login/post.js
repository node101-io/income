module.exports = (req, res) => {
  if (!req.body || !req.body.password)
    return res.status(401).redirect('/login');

  if (req.body.password !== process.env.PASSWORD)
    return res.status(401).redirect('/login');

  req.session.password = req.body.password;

  return res.redirect('/');
};