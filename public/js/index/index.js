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
  const inputElement = document.getElementById('snapshot-json');
  const jsonString = inputElement.value;
  const snapshots = JSON.parse(jsonString);

  console.log(snapshots);

  const xValues = [1,2,3,4,5,6,7,8,9,10,11,12]; //bunu yunusa sor
  const yValues = [1000,2,3,4,5,6,7,8,9,10,11,12];

  new Chart("snapshot-canvas", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        lineTension: 0,
        data: yValues
      }]
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { min: 16, max: 16 } }]
      },
      //responsive: true, // Make the chart responsive
      //maintainAspectRatio: false, // Allow chart to adjust its aspect ratio
    }
});
});