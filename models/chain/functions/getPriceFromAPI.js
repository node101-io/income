const PRICE_API_URL = 'https://api-osmosis.imperator.co/tokens/v2/price';

module.exports = (token, callback) => {
  fetch(`${PRICE_API_URL}/${token}`)
    .then(res => res.json())
    .then(res => {
      const price = res.price;

      if (!price || isNaN(Number(res.price))) return callback('not_found');

      return callback(null, Number(price));
    })
    .catch(_ => callback('network_error'));
};