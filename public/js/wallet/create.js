window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#wallet-submit-button')) {
      const walletPublicKey = document.querySelector('#wallet-public-key').value;
      const walletName = document.querySelector('#wallet-name').value;
      const walletChain = JSON.parse(document.getElementById('chain-json').value);
      const walletType = document.querySelector('#wallet-type').value;
      const walletRewardComission = document.querySelector('#wallet-reward-comission').value;
      const walletSelfStakeValue = document.querySelector('#wallet-self-stake-value').value;
      const walletStakeValue = document.querySelector('#wallet-stake-value').value;
      const walletAvaliableBalance = document.querySelector('#wallet-available-balance').value;
      const walletLastValueUpdateTime = document.querySelector('#wallet-last-value-update-time').value;

      serverRequest('/chain/wallet/create', 'POST', {
        public_key: walletPublicKey,
        name: walletName,
        chain_id: walletChain._id,
        type: walletType,
        reward_comission: walletRewardComission,
        self_stake_value: walletSelfStakeValue,
        stake_value: walletStakeValue,
        available_balance: walletAvaliableBalance,
        last_value_update_time: walletLastValueUpdateTime
      }, response => {
        if (!response.success)
          console.log(response.error);
        else
          window.location.reload();
      });
    };
  });
});