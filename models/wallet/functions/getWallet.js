module.exports = (wallet, callback) => {
  if (!wallet || !wallet._id)
    return callback('document_not_found');

  return callback(null, {
    _id: wallet._id.toString(),
    public_key: wallet.public_key,
    name: wallet.name,
    chain_id: wallet.chain_id,
    reward_commission: wallet.reward_commission,
    self_stake_value: wallet.self_stake_value,
    stake_value: wallet.stake_value,
    available_balance: wallet.available_balance
  });
};