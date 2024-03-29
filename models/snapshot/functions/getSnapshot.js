module.exports = (snapshot, callback) => {
  if (!snapshot || !snapshot._id)
    return callback('document_not_found');

  return callback(null, {
    _id: snapshot._id.toString(),
    chain_id: snapshot.chain_id,
    full_time_chain_count: snapshot.full_time_chain_count,
    new_chain_count: snapshot.new_chain_count,
    each_day_token_balance: snapshot.each_day_token_balance,
    each_month_token_balance: snapshot.each_month_token_balance,
    each_year_token_balance: snapshot.each_year_token_balance,
    each_day_usd_balance: snapshot.each_day_usd_balance,
    each_month_usd_balance: snapshot.each_month_usd_balance,
    each_year_usd_balance: snapshot.each_year_usd_balance,
    date: snapshot.date
  });
};