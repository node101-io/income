window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#chain-update-button')) {
      const chainAPRInput = document.querySelector('#chains-apr-input').value;
      const chain = JSON.parse(document.getElementById('chain-json').value);

      serverRequest('/chain/update?id=' + chain._id, 'POST', {
        apr: chainAPRInput
      }, response => {
        if (response.success)
          window.location.reload();
      });
    };
  });
});