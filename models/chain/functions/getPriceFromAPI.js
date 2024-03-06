module.exports = (token, callback) => {
  fetch(`https://api-osmosis.imperator.co/tokens/v2/price/${token}`)
  .then(res => res.json())
  .then(res => {
    const price = res.price;
    console.log(price);
    if (!price)
      return callback('document_not_found');

    return callback(null, price);
  })
  .catch(err => {
    return callback('network_error');
  })
};