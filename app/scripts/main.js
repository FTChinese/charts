function queryDifferentReports() {
  //MARK:适用于ReportRequest对象的dateRange、viewId不同的情况
  /**
   * @dest:发出数个ReportRequest对象不同的请求，所有请求都完成后得到响应数据，再处理响应数据并绘图。
   * @depend requestDataArr：TYPE Arr 用于存储数个ReportRequest对象,来自具体展示页面设置的全局常量。
   * @depend responseDataArr： TYPE Arr 用于存储数个response.result对象，来自具体展示页面设置的全局常量。
   */
  const  requestNum = requestDataArr.length;
  console.log(requestNum);
  let requestIndex = 0;
  function oneRequest() {
    const requestData = requestDataArr[requestIndex];
    console.log(requestData);
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests:requestDataArr[requestIndex]
      }
    }).then(function(response) {
      requestIndex++;
      //console.log(response);
      responseDataArr.push(response.result);
      //console.log(JSON.stringify(response.reports));
      //displayResults(response);
      console.log(JSON.stringify(response.result))
      
      if (requestIndex < requestNum) {
        oneRequest();
      } else {
        drawCharts(responseDataArr);
      }
      

    },console.error.bind(console));
  }
   
   oneRequest();
}

function getStoredDataFile(filePath) {
  return fetch(filePath, {
    method:'GET',
    headers: {
      'Accept':'application/json',
      'Content-Type':'application/json'
    }
  })
  .then((response) => {
    return response.json();
  })
}

var gCurrentChartIndex = 0;
// Query the API and print the results to the page.
var gaDataReports = [];
function queryReportsAll() {
  //MARK:适用于ReportRequest对象的dateRange、viewId都相同，但ReportRequest对象的数量超过5个的情况。

  function requestBatch(index, reportRequests) {
    var startIndex = index * reportBatchLimit;
    var endIndex = (index + 1) * reportBatchLimit -1;
    endIndex = Math.min(endIndex, reportRequestLength - 1);
    var currentReportRequest = reportRequests.slice(startIndex, endIndex + 1);
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: currentReportRequest
      }
    }).then(
      function(response) {
        var reports = response.result.reports;
        for (var i=0; i<reports.length; i++) {
          gaDataReports.push(reports[i]);
        }
        if (endIndex === reportRequestLength -1) {
          //displayResults(response);
          drawChartsAll();
        } else {
          requestBatch(index+1, reportRequests)
        }
      }
    );
  }

  const reportBatchLimit = 5;
  var reportRequests = constructQuerryData(startDate, endDate);
  var reportRequestLength = reportRequests.length;
  var reportRequestBatchLength = Math.ceil(reportRequestLength/reportBatchLimit);
  var currentBatchIndex = 0;
  gaDataReports = [];
  requestBatch(currentBatchIndex, reportRequests);

}


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
  //console.log(response);
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

// MARK:Append an div for drawing table in it.
function createTable() {
  var chartContainer = document.createElement('div');
  var chartId = 'chart-container-' + gCurrentChartIndex;
  chartContainer.id = chartId;
  chartContainer.className = 'chart-container';
  gCurrentChartIndex += 1;
  var tableContainer = document.createElement('table');
  chartContainer.appendChild(tableContainer);
  document.getElementById('charts-container').appendChild(chartContainer);
  return chartId;
}

// MARK: Extract data from Google Analytics API
function extractDataFromGAAPI(dataSource, baseKeys) {
  var resultData = {};
  if (dataSource === undefined) {
    return null;
  }
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
      rate = parseInt(rate * 1000, 10)/10;//保留1位小数
      rates.push(rate);
    }
  }
  return rates;
}

// MARK: Calculate percentage between two sets of data
function calculateOverallRates(part, total) {
  var partSum = part.reduce((a, b) => a + b, 0);
  var totalSum = total.reduce((a, b) => a + b, 0); 
  var rate = 0;
  if (partSum >= 0 && totalSum > 0) {
    rate = partSum / totalSum;
    rate = parseInt(rate * 1000, 10)/10;
  }
  return rate;
}

function calculateRatesConvert(percentageData) {
  /**
   * @dest:Convert an Array of percentage data to normal data.
   * @param percentageData: Type Array [number], whose item is x meaning x%,Eg: [120,130] means 120%,130%
   * @return: Type Array.The result of dividing the param by 100.
   */
  return percentageData.map( x => x/100);
}

function averageOfArray(arrayObject) {
  var sum = 0;
  var avg = 0;
  try {
  for( var i = 0; i < arrayObject.length; i++ ){
      sum += parseInt(arrayObject[i], 10); //don't forget to add the base
  }
  avg = sum/arrayObject.length;
  avg = Math.round(avg);
  } catch (ignore) {

  }
  return avg;
}

// MARK:Append an div for drawing table in it.
function createTable(data) {
  const chartContainer = document.createElement('div');
  const chartId = 'chart-container-' + gCurrentChartIndex;
  chartContainer.id = chartId;
  chartContainer.className = 'chart-container';
  gCurrentChartIndex += 1;
  const tableContainer = document.createElement('table');
  const tableThead = document.createElement('thead');
  const tableTbody = document.createElement('tbody');

  tableContainer.className = 'o-table o-table--row-stripes';
  
  
  const heads = ['Ad','SuccessRate','FailRate','successOnRetryRate','Request','Success','Fail','SuccessOnRetry'];
  let ths = '';
  for(const item of heads) {
    ths+=`<th>${item}</th>`
  }
  tableThead.innerHTML = ths;
  tableContainer.appendChild(tableThead);

  for(const item of data) {
    const adid = item.ad.replace(/.*\(([0-9]+)\)/,'$1');//该方法并不改变调用它的字符串本身，而只是返回一个新的替换后的字符串
    const successRate = item.successRate;
    let styleForSign = '';
    if(successRate >= 95 && successRate <= 120) {
      styleForSign = 'good';
    } else if(successRate >= 80 && successRate <95) {
      styleForSign = 'warn';
    } else {
      styleForSign = 'error';
    }
    const tdsOfTr = `<td><a href="./doubleclick-gap.html?adid=${adid}">${item.ad}</a></td><td class ="${styleForSign}">${item.successRate}%</td><td>${item.failRate}%</td><td>${item.successOnRetryRate}%</td><td>${item.request}</td><td>${item.success}</td><td>${item.fail}</td><td>${item.successOnRetry}</td>`;
    const tableTr = document.createElement('tr');
    tableTr.innerHTML = tdsOfTr;
    tableTbody.appendChild(tableTr);
  }
  tableContainer.appendChild(tableTbody);
  chartContainer.appendChild(tableContainer);
  document.getElementById('charts-container').appendChild(chartContainer);
  return chartId;
}

// MARK: A quick way to draw just one chart with just enought information
function drawChartByKey(obj) {
  var percentageSign = (obj.percentage === true) ? '%': '';
  var keys = obj.keys;
  var multiplier = obj.multiplier || 1;
  var series;
  if (obj.conversion === true && obj.data.length === 2) {
    // MARK: Draw conversion rates between two sets of data
    var series1 = extractDataFromGAAPI(gaDataReports[obj.data[0].index].data.rows, keys);
    var series2 = extractDataFromGAAPI(gaDataReports[obj.data[1].index].data.rows, keys);
    var conversionRate = calculateRates(series2, series1);
    var overallConversionRate = calculateOverallRates(series2, series1);
    series = [{
      name: obj.data[1].name + "/" + obj.data[0].name + '(Overall: ' + overallConversionRate + '%)',
      data: conversionRate
    }];
    percentageSign = '%';
  } else {
    series = obj.data.map(function(x) {
      var dataArray = extractDataFromGAAPI(gaDataReports[x.index].data.rows, keys);
      if (dataArray) {
        dataArray = dataArray.map(x => x * multiplier);
      }
      return {
        name: x.name + ' (Average: ' + averageOfArray(dataArray) + percentageSign + ')',
        data: dataArray
      };
    });
  }
  var chartId = createChart();
  var chart = new Highcharts.Chart({
      chart: {
          type: obj.type,
          renderTo: chartId,
          spacingBottom: 20
      },
      title: {
          text: obj.title
      },
      xAxis: {
          categories: keys,
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
      },
      yAxis: {
          title: {
              text: 'Percent'
          }
      },
      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.1f}' + percentageSign + '</b><br/>',
          shared: true
      },
      series: series,
      credits: {
        enabled: false
      },
      legend: {
        enabled: true
      }
    });
}
