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
  const xValues = [1,2,3,4,5,6,7,8,9,10,11,12];
  const yValues = [1,2,3,4,5,6,7,8,9,10,11,12];

  new Chart("snapshot-canvas", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: yValues
      }]
    },
    options: {
      legend: {display: false},
      scales: {
        yAxes: [{ticks: {min: 6, max:16}}],
      }
    }
  });
});