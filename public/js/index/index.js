window.addEventListener('load', () => {
  if (document.getElementById('chain-search-input')) {
    document.getElementById('chain-search-input').focus();
    document.getElementById('chain-search-input').select();

    document.getElementById('chain-search-input').addEventListener('keyup', event => {
      if (event.target.value?.trim()?.length) {
        window.location = `/?search=${event.target.value.trim()}`;
      } else if (event.key == 'Enter') {
        window.location = '/';
      }
    });
  }
});