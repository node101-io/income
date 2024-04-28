window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#wallet-update-button')) {
      const walletName = document.querySelector('#wallet-name').value;
      const walletType = document.querySelector('#wallet-type').value;
      const walletRewardComission = document.querySelector('#wallet-reward_commission').value;

      const wallet = JSON.parse(document.getElementById('wallet-json').value);

      serverRequest('/chain/wallet/edit?id=' + wallet._id, 'POST', {
        name: walletName,
        type: walletType,
        reward_commission: walletRewardComission
      }, response => {
        if (response.success)
          window.location.reload();
        else
          console.log(response.error);
      });
    };
  });
});