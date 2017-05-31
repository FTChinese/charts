

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

// MARK:Append an div for drawing chart in it.
function createChart() {
  var chartContainer = document.createElement('div');
  var chartId = 'chart-container-' + gCurrentChartIndex;
  chartContainer.id = chartId;
  chartContainer.className = 'chart-container';
  gCurrentChartIndex += 1;
  document.getElementById('charts-container').appendChild(chartContainer);
  return chartId;
}

// MARK: Extract data from Google Analytics API
function extractDataFromGAAPI(dataSource, baseKeys) {
  var resultData = {};
  dataSource.forEach(
    function(row) {
      var dimension = row.dimensions[0];
      var metric = row.metrics[0].values[0] || 0;
      metric = parseInt(metric, 10);
      resultData[dimension] = metric;
    }
  );
  var keys = baseKeys;
  var dimensions = keys.map(function(key){
    if (resultData[key]) {
      return resultData[key];
    }
    return 0;
  });
  return dimensions;
}

// MARK: Calculate percentage between two sets of data
function calculateRates(part, total) {
  var rates=[];
  if (part.length>0 && part.length === total.length) {
    for (var i=0; i<part.length; i++) {
      var rate;
      try {
        rate = part[i] / total[i];
      } catch (ignore) {
        rate = 0; 
      }
      rate = parseInt(rate * 10000, 10)/100;
      rates.push(rate);
    }
  }
  return rates;
}