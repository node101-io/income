module.exports = (chain, callback) => {
  if (!chain || !chain._id)
    return callback('document_not_found');

  return callback(null, {
    _id: chain._id.toString(),
    identifier: chain.identifier,
    apr: chain.apr,
    price: chain.price,
    total_value: chain.total_value
  });
};