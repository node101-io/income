window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#wallet-submit-button')) {
      const walletPublicKey = document.querySelector('#wallet-public-key').value;
      const walletName = document.querySelector('#wallet-name').value;
      const walletChain = JSON.parse(document.getElementById('chain-json').value);
      const walletLastValueUpdateTime = document.querySelector('#wallet-last-value-update-time').value;
      const walletType = document.querySelector('#wallet-type').value;

      serverRequest('/chain/wallet/create', 'POST', {
        public_key: walletPublicKey,
        name: walletName,
        chain_id: walletChain._id,
        type: walletType,
        last_value_update_time: walletLastValueUpdateTime
      }, response => {
        if(!response.success)
          console.log(response.error);
        else
          window.location.reload();
      });
    };
  });
});