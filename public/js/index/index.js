function createElement(name) {
  const deneme = document.createElement('div')
  deneme.classList.add('each-chain-wrapper')
  deneme.textContent = name;

  document.querySelector('.all-content').appendChild(deneme);
};

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.closest('#chains-submit-button')) {
      const chainIdentifierInput = document.querySelector('#chains-identifier-input').value;
      const chainAPRInput = document.querySelector('#chains-apr-input').value;

      serverRequest('/chain/create', 'POST', {
        identifier: chainIdentifierInput,
        apr: chainAPRInput
      }, response => {
        createElement(response.chain.identifier)
      });
    };
  });
});
