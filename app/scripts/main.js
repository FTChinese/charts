/**
 *  Calculate the person correlation score between two items in a dataset.
 *
 *  @param  {object}  prefs The dataset containing data about both items that
 *                    are being compared.
 *  @param  {string}  p1 Item one for comparison.
 *  @param  {string}  p2 Item two for comparison.
 *  @return {float}  The pearson correlation score.
 */
function pearsonCorrelation(prefs, p1, p2) {
  var si = [];

  for (var key in prefs[p1]) {
    if (prefs[p2][key]) si.push(key);
  }

  var n = si.length;

  if (n == 0) return 0;

  var sum1 = 0;
  for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

  var sum2 = 0;
  for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

  var sum1Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum1Sq += Math.pow(prefs[p1][si[i]], 2);
  }

  var sum2Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum2Sq += Math.pow(prefs[p2][si[i]], 2);
  }

  var pSum = 0;
  for (var i = 0; i < si.length; i++) {
    pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
  }

  var num = pSum - (sum1 * sum2 / n);
  var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
      (sum2Sq - Math.pow(sum2, 2) / n));

  if (den == 0) return 0;

  var final = Math.round(100 * (num / den))/100;

  return final;
}


/**
Exactly –1. A perfect downhill (negative) linear relationship

–0.70. A strong downhill (negative) linear relationship

–0.50. A moderate downhill (negative) relationship

–0.30. A weak downhill (negative) linear relationship

0. No linear relationship

+0.30. A weak uphill (positive) linear relationship

+0.50. A moderate uphill (positive) relationship

+0.70. A strong uphill (positive) linear relationship

Exactly +1. A perfect uphill (positive) linear relationship
**/

function correlationExplained(r) {
  if (r < -1) {
    return 'value meaningless';
  } else if (r <= -0.85) {
    return 'perfect negative';
  } else if (r <= -0.6) {
    return 'strong negative';
  } else if (r <= -0.4) {
    return 'moderate negative';
  } else if (r <= -0.15) {
    return 'weak negative';
  } else if (r <= 0.15) {
    return 'No linear relationship';
  } else if (r <= 0.4) {
    return 'weak positive';
  } else if (r <= 0.6) {
    return 'moderate positive';
  } else if (r <= 0.85) {
    return 'strong positive';
  } else if (r <= 1) {
    return 'perfect positive';
  } else {
    return 'value meaningless';
  }
}

function queryDifferentReports() {
  //MARK:适用于ReportRequest对象的dateRange、viewId不同的情况
  /**
   * @dest:发出数个ReportRequest对象不同的请求，所有请求都完成后得到响应数据，再处理响应数据并绘图。
   * @depend requestDataArr：TYPE Arr 用于存储数个ReportRequest对象,来自具体展示页面设置的全局常量。
   * @depend responseDataArr： TYPE Arr 用于存储数个response.result对象，来自具体展示页面设置的全局常量。
   */
  const  requestNum = requestDataArr.length;
  //console.log(requestNum);
  let requestIndex = 0;
  function oneRequest() {
    const requestData = requestDataArr[requestIndex];
    //console.log(requestData);
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
      //console.log(JSON.stringify(response.result))
      
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

function insertPicture(title, src) {
  var imgContainer = document.createElement('div');
  imgContainer.innerHTML = '<div class="chart-title">' + title + '</div><img src="'+ src +'">';
  imgContainer.className = 'chart-container';
  document.getElementById('charts-container').appendChild(imgContainer);
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

//MARK:By wangyichen, 根据ga响应原始数据集，得到想要的obj数据,一般用于给table用作数据集
/**
 * 
 * @param {Array} gaResponseReports: ga响应原始数据集的reports字段值，即含有至多五个Obj的数组
 * @param {Array} propsArr：最终得到obj各属性名称组成的数组，其中第一个为 key的名称，第二个为reports[0]数值项的名称，第三个为reports[1]数值项的名称....
 * @param {Array} keys：主键值数组,最终数据集将按照keys数组的顺序程现。
 * @param {string} orderBy: 按照从多到少排序的字段，是propsArr中除key外的某一个
 */
function extractObjData(gaResponseReports, propsArr, keys, orderBy) {
  const resultData = [];
  
  keys.forEach(onekey => { //处理每个key,一个key对应一个最后数组数组的一项obj
    const oneObj = {};
    oneObj[propsArr[0]] = onekey; //该obj的第一个属性键为propsArr[0],值为key本身的值

    for (const [index, elem] of gaResponseReports.entries()) {//该obj剩下的属性值分别从这几个reports中获取
      const oneReportDataArray = elem.data.rows;
      const thisField = propsArr[index+1];
      for(const datum of oneReportDataArray ) {
        if (datum.dimensions[0] == onekey) {
          oneObj[thisField] = Number(datum.metrics[0].values[0]);
        }
      }
      if(!oneObj[thisField]) {
        oneObj[thisField] = 0;
      }
    }

    resultData.push(oneObj);
  });
  if (!orderBy) {
    return resultData;
  }
  resultData.sort((a,b) => { //Note:sort方法是会改变原数组的
    if(a[orderBy] > b[orderBy]) {
      return -1;
    } else {
      return 1;
    }
  });
  return resultData;
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
  avg = Math.round(avg * 100)/100;
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

// MARK:Append an div for drawing table in it.
/**
 * 
 * @param {Array} data:绘制table所用的数据集，最后得到的数据呈现方式完全是和数据集对应的，一行是数据集的一项，字段就是每一项的props
 * @param {Array} fields:数据集每一项的属性组成的数组，其顺序决定了呈现在表格中从左到右的顺序
 */
function createNormalTable(data, fields) {
  const chartContainer = document.createElement('div');
  const chartId = 'chart-container-' + gCurrentChartIndex;
  chartContainer.id = chartId;
  chartContainer.className = 'chart-container';
  gCurrentChartIndex += 1;
  const tableContainer = document.createElement('table');
  const tableThead = document.createElement('thead');
  const tableTbody = document.createElement('tbody');

  tableContainer.className = 'ftc-table ftc-table--responsive-overflow ftc-table--row-stripes ftc-table--vertical-lines';
  
  let ths = '';
  for(const item of fields) {
    ths+=`<th>${item}</th>`
  }
  tableThead.innerHTML = ths;
  tableContainer.appendChild(tableThead);

  for(const item of data) {
     let tds = '';
     for(const field of fields) {
       tds += `<td>${item[field]}</td>`
     };
    const tableTr = document.createElement('tr');
    tableTr.innerHTML = tds;
    tableTbody.appendChild(tableTr);
  }
  tableContainer.appendChild(tableTbody);
  chartContainer.appendChild(tableContainer);
  document.getElementById('charts-container').appendChild(chartContainer);
  return chartId;
}

// MARK：By wangyichen, 按照某项指标前多少名获取keys
/**
 * @param {Array} keys，数据主键，如文章id
 * @param {Array} orderFieldValue, 用于排序的字段值数组，一般可以根据keys获得
 * @param {Number} n,用于取前多少名
 */
function getKeysByOder(keys,n) {
  const request = extractDataFromGAAPI(gaData.reports[0].data.rows, keys);
  const keyAndRequestArray = [];
  for(let i=0,len=keys.length;i<len;i++) {
    const keyAndRequest = {
      ad:keys[i],
      request:request[i]
    }
    keyAndRequestArray.push(keyAndRequest);
  }
  const top30Records = keyAndRequestArray.sort(function(a,b) {
    if(a.request > b.request) {
      return -1;
    } else {
      return 1;
    }
  }).slice(0,30);

  const ads = [];
}
// MARK: A quick way to draw just one chart with just enought information
function drawChartByKey(obj) {
  var percentageSign = (obj.percentage === true) ? '%': '';
  var keys = obj.keys;
  var unitName = obj.unitName || '';
  var multiplier = obj.multiplier || 1;
  var series;
  var subtitle = '';
  if (!keys) {
    var baseData; 
    var seriesData = obj.data.map(function(x, index) {
      //console.log (gaDataReports[x.index].data);
      //var dataArray = extractDataFromGAAPI(gaDataReports[x.index].data.rows, keys);
      var dataTotal = gaDataReports[x.index].data.totals[0].values[0];
      var dataDetail = '';
      var dataPercentage;
      dataTotal = parseInt(dataTotal, 10);
      if (obj.type === 'funnel' || obj.type === 'pyramid') {
        if (index === 0) {
          baseData = parseInt(dataTotal, 10);
        }
        if (index>0) {
          dataPercentage = Math.round(parseInt(10000 * dataTotal/baseData, 10)) / 100;
          dataPercentage += '%';
          dataDetail = '('+  dataTotal + ', ' + dataPercentage +')';
        } else {
          dataDetail = '('+  dataTotal  +')';
        }
      }

      
      return [
        x.name + dataDetail, dataTotal
      ];
    });
    series = [{
        name: unitName,
        data: seriesData
    }];
    // console.log (series);
  } else if (obj.conversion === true && obj.data.length === 2) {
    // MARK: Draw conversion rates between two sets of data
    var series1 = extractDataFromGAAPI(gaDataReports[obj.data[0].index].data.rows, keys);
    var series2 = extractDataFromGAAPI(gaDataReports[obj.data[1].index].data.rows, keys);
    var conversionRate = calculateRates(series2, series1);
    var overallConversionRate = calculateOverallRates(series2, series1);
    var correlationDataSet = [series1, series2];
    var r = pearsonCorrelation(correlationDataSet, 0, 1);
    var rExplained = correlationExplained(r);
    series = [{
      name: obj.data[1].name + " vs " + obj.data[0].name,
      data: conversionRate
    }];
    percentageSign = '%';
    subtitle = 'Overall Conversion: ' + overallConversionRate + '%, Correlation: '+r + ' (' + rExplained + ')';
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
      subtitle: {
          text: subtitle,
          style: {
            fontSize: '18px'
          }
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
