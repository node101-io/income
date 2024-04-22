module.exports = (req, res, next) => {
  if (req.session.password && req.session.password == process.env.PASSWORD)
    return next();

  return res.status(401).redirect('/login');
};
