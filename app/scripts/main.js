

var gCurrentChartIndex = 0;
// Query the API and print the results to the page.
function queryReports() {
  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      reportRequests: constructQuerryData(startDate, endDate)
    }
  }).then(displayResults, console.error.bind(console));
}

function displayResults(response) {
  drawCharts(response.result);
}

function createChart() {
  var chartContainer = document.createElement('div');
  var chartId = 'chart-container-' + gCurrentChartIndex;
  chartContainer.id = chartId;
  chartContainer.className = 'chart-container';
  gCurrentChartIndex += 1;
  document.getElementById('charts-container').appendChild(chartContainer);
  return chartId;
}