module.exports = (chain, callback) => {
  if (!chain || !chain._id)
    return callback('document_not_found');

  return callback(null, {
    _id: chain._id.toString(),
    identifier: chain.identifier,
    apr: chain.apr,
    token: chain.token,
    price: chain.price,
    total_token_count: chain.total_token_count
  });
};