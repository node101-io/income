module.exports = (wallet, callback) => {
  if (!wallet || !wallet._id)
    return callback('document_not_found');

  return callback(null, {
    chain_id: wallet.chain_id.toString(),
    _id: wallet._id.toString(),
    public_key: wallet.public_key,
    description: wallet.description,
    reward_commission_percentage: wallet.reward_commission_percentage,
    self_staked_token_balance: wallet.self_staked_token_balance,
    self_unstaked_token_balance: wallet.self_unstaked_token_balance,
    external_staked_token_balance: wallet.external_staked_token_balance,
    self_total_token_balance: wallet.self_staked_token_balance + wallet.self_unstaked_token_balance
  });
};