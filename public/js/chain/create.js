window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#chain-submit-button')) {
      // const chainIdentifierInput = document.querySelector('#chain-identifier-input').value;
      // const chainAPRInput = document.querySelector('#chain-apr-input').value;
      // const chainToken = document.querySelector('#chain-token')

      // serverRequest('/chain/create', 'POST', {
      //   identifier: chainIdentifierInput,
      //   apr: chainAPRInput,
      //   token: chainToken
      // }, response => {
      //   createElement(response.chain.identifier)
      // });
    };
  });
});
