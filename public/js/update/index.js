window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#chain-update-button')) {
      const chainAPRInput = document.querySelector('#chain-apr-input').value;
      const chainToken = document.querySelector('#chain-token').value;
      const chain = JSON.parse(document.getElementById('chain-json').value);

      serverRequest('/chain/update?id=' + chain._id, 'POST', {
        apr: chainAPRInput,
        token: chainToken
      }, response => {
        if (response.success)
          window.location.reload();
      });
    };
  });
});