// import { CLIENT_RENEG_LIMIT } from "tls";



var changeLog = [
  {
    title: 'Apple Subscription Online',
    date: '20180115'
  },
  {
    title: 'Apps Blocked in China',
    date: '20180308'
  },
  {
    title: 'Web and Android Subscription Online',
    date: '20180401'
  },
  {
    title: 'Pop Up Service Agreement in Web Registration Form',
    date: '20180616'
  },
  {
    title: 'Audio on Home',
    date: '20180621'
  },
  {
    title: 'Exclusive Section on Home',
    date: '20180624'
  },
  {
    title: 'Prominent Language Switch on Story Page',
    date: '20180626'
  },
  {
    title: 'Fix Bugs in Service Agreement Pop and Billingual Story',
    date: '20180628'
  },
  {
    title: 'Start to Track Language Switch Performance',
    date: '20180702'
  },
  {
    title: 'Start to track all required steps in registration form of web site',
    date: '20180702'
  }
];


/**
 *  Calculate the pearson correlation score between two items in a dataset.
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




//utility functions
const lineFit = function(xs, ys, rV){
    rV.slope = 0.0;
    rV.intercept = 0.0;
    rV.rSquared = 1.0; // assume perfection
    
    if (xs.length < 2)
    {
        return false;
    }
    
    if (xs.Count != ys.Count)
    {
        return false;
    }
    
    var N = xs.length;
    var sumX = sumFunc(xs,null);
    var sumY = sumFunc(ys,null);
    var funcSq = function(i){return (i*i);}
    var funcSq2 = function(i,j){return (i*j);}
    var sumXx = sumFunc(xs, funcSq);
    var sumYy = sumFunc(ys, funcSq);
    var sumXy = sumFunc(zip(xs,ys),funcSq2); 

    rV.slope = ((N * sumXy) - (sumX * sumY)) / (N * sumXx - (sumX*sumX));
    rV.intercept = (sumY - rV.slope * sumX) / N;
    rV.rSquared = Math.abs((rV.slope * (sumXy - (sumX * sumY) / N)) / (sumYy - ((sumY * sumY) / N)));
    return true;
}   

const sumFunc = function(arr, func){
    var total = 0;
    for (var [i, k] of arr.entries()) {
        if (typeof k === 'object' && k.length > 0){
            if (func == null){
                k = k[0] + k[1];
            }else{                
                k = func(k[0],k[1]);
            }
        } else {
            if (func != null){
                k = func(k);
            }
        }
        total += k;
    }
    return total;
}

const zip = function(arr1,arr2) {
    var rV = [];
    for(var i=0; i<arr1.length; i++){
       rV.push([arr1[i],arr2[i]]);
    }
    return rV;
}


function queryDifferentReports() {
  // MARK: - 适用于ReportRequest对象的dateRange、viewId不同的情况
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

function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
    var regexS = '[\\?&]'+name+'=([^&#]*)';
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
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
// MARK: - Query the API and print the results to the page.
var gaDataReports = [];
function queryReportsAll() {
  //MARK: - 适用于ReportRequest对象的dateRange、viewId都相同，但ReportRequest对象的数量超过5个的情况。

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
  drawCharts(response.result);
}


// MARK: - Append an div for drawing chart in it.
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

function insertDiv(height) {
  var divContainer = document.createElement('div');
  divContainer.innerHTML = '<div style="height:'+height+'px;"></div>';
  document.getElementById('charts-container').appendChild(divContainer);
}

function insertDivWithHTML(htmlString) {
  var divContainer = document.createElement('div');
  divContainer.innerHTML = htmlString;
  document.getElementById('charts-container').appendChild(divContainer);
}


// MARK: - Append an div for drawing table in it.
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

// MARK: - Extract data from Google Analytics API
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

//MARK: - By wangyichen, 根据ga响应原始数据集，得到想要的obj数据,一般用于给table用作数据集
/**
 * 
 * @param {Array} gaResponseReports: ga响应原始数据集的reports字段值，即含有至多五个Obj的数组
 * @param {Array} propsArr：最终得到obj各属性名称组成的数组，其中第一个为 key的名称，第二个为reports[0]数值项的名称，第三个为reports[1]数值项的名称....
 * @param {Array} keys：主键值数组,最终数据集将按照keys数组的顺序程现。
 * @param {string} orderBy: 按照从多到少排序的字段，是propsArr中除key外的某一个
 */
function extractObjData(gaResponseReports, propsArr, keys, orderBy) {
  //console.log('exect');
  const resultData = [];
  //console.log(keys);
  keys.forEach(function(onekey) { //处理每个key,一个key对应一个最后数组数组的一项obj
    const oneObj = {};
    oneObj[propsArr[0]] = onekey; //该obj的第一个属性键为propsArr[0],值为key本身的值
    //console.log(onekey);
    for (let [index, elem] of gaResponseReports.entries()) {//该obj剩下的属性值分别从这几个reports中获取
    //for(var index = 0, len = gaResponseReports.length; index<len;index++) {
      //const elem = gaResponseReports[index];
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
  resultData.sort((a,b) => {
    // MARK - :sort方法是会改变原数组的
    if(a[orderBy] > b[orderBy]) {
      return -1;
    } else {
      return 1;
    }
  });
  return resultData;
}

/**
 * By wangyichen,为已经处理好的数据集添加新属性，新属性由已有属性值计算得到
 * @param {Array:[Obj,Obj,Obj]} data
 * @param {Array:[Obj,Obj,Obj]} addPropsArr 
 *    @param {Function} Obj.operateFunc 操作函数
 *    @param {String} Obj.prop1 第一个被操作数在数据集中的属性名称
 *    @param {String} Obj.prop2 第二个被操作数在数据集中的属性名称
 *    @param {String} Obj.propNew 操作后的结果在数据集中的属性名称
 */
function addPropsToData(data, addPropsArr) {
  return data.map(datum => {
    for (const item of addPropsArr) {
      const operatedNum1 = datum[item.prop1];
      const operatedNum2 = datum[item.prop2];
      const propNewValue = item.operateFunc(operatedNum1, operatedNum2);
      datum[item.propNew] = propNewValue;
    }
    return datum;
  });
}

/**
 * By wangyichen,为数据集增加统计指标行
 * @param {Array:[Obj,Obj,Obj]} data:原数据集
 * @param {Array:[Obj,Obj,Obj]} addStatisRowArr:需要增加的统计信息行相关信息
 *   @param {String} Obj.rowNameValue:新的一行的名称，即位于表格第一列
 *   @param {String} Obj.rowNameKey:新的一行的名称为于原数据集的属性名
 *   @param {String} Obj.operateFunc:操作函数
 *   @param {Array:[String,String]} Obj.propsArr:需要操作得到统计结果的属性数组
 * 
 */
function addStatisRowToData(data, addStatisRowArr) {
  const dataItemPropArr = Object.keys(data[0]);//得到数据集每项的属性组成的数组
  for (const item of addStatisRowArr) {//遍历要计算的统计值信息数组，一项对应新增的一行
    const newObj = {};//一行对应一个新对象
    if(!dataItemPropArr.includes(item.rowNameKey)) {//如果不包含这个属性名，则跳过
      continue;
    }
    newObj[item.rowNameKey] = item.rowNameValue;

    for (const prop of item.propsArr) {
      if (!dataItemPropArr.includes(prop)) {
        continue;
      }
      //console.log(prop);
      const numArr = data.map(datum => {
        return datum[prop];
      });
      newObj[prop] = item.operateFunc(numArr);
    }

    for (const prop of dataItemPropArr) {
      if (newObj[prop] == undefined) {
        newObj[prop] = '--';
      }
    }
    //console.log(newObj);
    data.push(newObj);
  }
  return data;
}

/*** 一系列数据计算方法：Start ***/
/**
 * By wangyichen:得到两数之商，结果是百分比的数，保留两位小数
 * @param {Number} a 被除数
 * @param {Number} b 除数--除数为0返回NaN
 */
function divide(a,b) {
  return Math.round(a/b * 10000)/100;
}

/**
 * By wangyichen:计算一系列数之和
 * @param {Array:[Number,Number..]} numArray 
 */
function sumOfAll(numArray) {
  let sum = 0;
  for(const item of numArray) {
    let numItem ;
    if(typeof item === 'number') {
      numItem = item;
    } else {
      numItem = Number(item);
    }
    if (numItem !== numItem || numItem === 'undefined') {//说明它是NaN或者是undefined
      numItem = 0;
    } 
    sum += numItem;
  }
  return sum;
}

/**
 * By wangyichen:计算一系列数的平均数
 * @param {Array:[Number,Number..]} numArray 
 */
function meanOfAll(numArray) {
  let sum = 0, n=0;
  for(const item of numArray) {
    let numItem ;
    if(typeof item === 'number') {
      numItem = item;
    } else {
      numItem = Number(item);
    }
    if (numItem === numItem ) {//说明它不是NaN
      n++; //NaN的时候不计算数量
      sum += numItem;
    }
  }
  if(n > 0) {
    return Math.round(sum/n * 100)/ 100;
  } else {
    return 0;
  }
}

/**
 * By wangyichen:计算一系列数的中位数
 * @param {Array:[Number,Number..]} numArray 
 */
function medianOfAll(numArray) {
  const cleanNumArr = numArray.map(num => {
    if (typeof num === 'number') {
      return num;//这里也有可能是NaN
    } else {
      return Number(num);//这里也有可能是NaN,如Number(undefined)
    }
  }).filter(num =>{
    return num === num;//过滤掉NaN
  });
  cleanNumArr.sort((a,b) => {//从小到大就地排序
    return a-b;
  });
  const len = cleanNumArr.length;
  if (len%2 === 0) {//如果为偶数个
    return Math.round((cleanNumArr[len/2] + cleanNumArr[len/2-1])/2*100)/100;
  } else {//如果为奇数个
    return Math.round(cleanNumArr[(len-1)/2]*100)/100;
  }
}
/*** 一系列数据计算方法：End ***/

// MARK: Calculate percentage between two sets of data
function calculateRates(part, total, percentageSign) {
  var rates=[];
  if (part == null || total == null) {
    return rates;
  }
  if (part.length>0 && part.length === total.length) {
    for (var i=0; i<part.length; i++) {
      var rate;
      try {
        rate = part[i] / total[i];
      } catch (ignore) {
        rate = 0; 
      }
      const divNumber = (percentageSign === '%') ? '1000' : '100000';
      // console.log (percentageSign);
      // console.log (divNumber);
      rate = parseInt(rate * 100000, 10)/divNumber;//保留3位小数
      rates.push(rate);
    }
  }
  return rates;
}

// MARK: Calculate percentage between two sets of data
function calculateOverallRates(part, total, percentageSign) {
  if (part == null || total == null) {
    return 0;
  }
  var partSum = part.reduce((a, b) => a + b, 0);
  var totalSum = total.reduce((a, b) => a + b, 0); 
  var rate = 0;
  if (partSum >= 0 && totalSum > 0) {
    rate = partSum / totalSum;
    const divNumber = (percentageSign === '%') ? '1000' : '100000';
    rate = parseInt(rate * 1000000, 10)/divNumber;
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
  avg = Math.round(avg * 10000)/10000;
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
 * @param {Array} statistcFields:需要进行统计信息计算的fields，应该是fields中的若干项
 */
function createNormalTable(data, fields,statisticFields) {
  const chartContainer = document.createElement('div');
  const chartId = 'chart-container-' + gCurrentChartIndex;
  chartContainer.id = chartId;
  chartContainer.className = 'chart-container';
  gCurrentChartIndex += 1;
  const tableContainer = document.createElement('table');
  const tableThead = document.createElement('thead');
  const tableTbody = document.createElement('tbody');
  tableContainer.className = 'ftc-table ftc-table--responsive-overflow ftc-table--row-stripes ftc-table--vertical-lines';
  tableContainer.setAttribute('data-ftc-component','ftc-table');
  tableContainer.setAttribute('data-ftc-table--no-js','');
  tableContainer.setAttribute('data-ftc-table--statistic','');
  tableContainer.setAttribute('data-ftc-table--wrapped','');
  tableContainer.setAttribute('data-ftc-table--wrapper-width','100%');
  tableContainer.setAttribute('data-ftc-table--wrapper-height','500px');
  //TODO:将class和attribute作为函数参数
  //data-ftc-table--wrapped data-ftc-table--wrapper-width="100%" data-ftc-table--wrapper-height="180px"
  let ths = '';
  for(const item of fields) {
    if(typeof data[0][item] == 'number') {
      if(statisticFields.includes(item)) {
        ths+=`<th aria-sort='none' data-ftc-table--datatype="numeric" data-ftc-table--tostatistic class="ftc-table__cell--numeric">${item}</th>`;
      } else {
        ths+=`<th aria-sort='none' data-ftc-table--datatype="numeric" class="ftc-table__cell--numeric">${item}</th>`;
      }
    
    } else {
      ths+=`<th aria-sort='none'>${item}</th>`;
    }
  }
  tableThead.innerHTML = ths;
  tableContainer.appendChild(tableThead);
  for(const item of data) {
     let tds = '';
     for(const field of fields) {
       if(typeof item[field] === 'number') {
         tds += `<td class="ftc-table__cell--numeric">${item[field]}</td>`;
       } else {
         tds += `<td>${item[field]}</td>`;
       }
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


function convertObjToBreakdown(obj) {
  var obj = obj;
  if (obj.eventCategories && obj.eventCategories.length > 0 && obj.breakdown === 'all') {
    var newData = [];
    var step = gaDataReports.length / obj.eventCategories.length;
    for (var i=0; i<obj.eventCategories.length; i++) {
      var data = obj.data;
      var eventCategoryName = obj.eventCategories[i].name || '';
      for (oneData of data) {
        var newOneData = JSON.parse(JSON.stringify(oneData));
        if (typeof newOneData.index === 'number') {
          newOneData.index += i * step;
        }
        if (typeof newOneData.total === 'number') {
          newOneData.total += i * step;
        }
        if (typeof newOneData.part === 'number') {
          newOneData.part += i * step;
        }
        const oneDataName = (data.length>1) ? ': ' + oneData.name : ''; 
        newOneData.name = eventCategoryName + oneDataName;
        newOneData.eventCategory = obj.eventCategories[i];
        newData.push(newOneData);
      }
    }
    obj.data = newData;
    delete obj.breakdown;
    delete obj.eventCategories;
    return obj;
  }
  return obj;
}

function addingMultiplierByKey(sourceData, objData, eventCategory) {
  var multiplierKey = objData.multiplierKey;
  var oneDataArray = sourceData;
  if (typeof multiplierKey === 'string') {
    oneMultiplier = eventCategory[multiplierKey];
    if (oneMultiplier >0) {
      oneDataArray = oneDataArray.map(x => x * oneMultiplier);
    }
  }
  return oneDataArray;
}

// MARK: A quick way to draw just one chart with just enought information
function drawChartByKey(obj) {
  if (obj.eventCategories && obj.eventCategories.length > 0 && obj.breakdown === 'all') {
    var newObj = convertObjToBreakdown(obj);
    drawChartByKey(newObj);
    return;
  }
  var percentageSign = (obj.percentage === true) ? '%': '';
  var keys = obj.keys;
  var unitName = obj.unitName || '';
  var multiplier = obj.multiplier || 1;
  var series;
  var subtitle = obj.subtitle || '';
  var plotOptions = obj.plotOptions || {};
  // MARK: Different Type of Charts
  const isMultipleConversionChart = (obj.conversion === true && obj.data.length > 0 && typeof obj.data[0].part === 'number' && typeof obj.data[0].total === 'number');
  const isPairConversionChart = (obj.conversion === true && obj.data.length === 2);
  const isBreakdownByEventCategory = (obj.eventCategories && obj.eventCategories.length > 0 && obj.breakdown && obj.breakdown === 'eventCategory');
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
  } else if (isPairConversionChart) {
    // MARK: Draw conversion rates between two sets of data
    var series1 = extractDataFromGAAPI(gaDataReports[obj.data[0].index].data.rows, keys);
    var series2 = extractDataFromGAAPI(gaDataReports[obj.data[1].index].data.rows, keys);
    var conversionRate = calculateRates(series2, series1);
    var overallConversionRate = calculateOverallRates(series2, series1);
    var correlationDataSet = [series1, series2];
    var r = pearsonCorrelation(correlationDataSet, 0, 1);
    var rExplained = correlationExplained(r);
    series = [{
      name: obj.data[1].name + ' vs ' + obj.data[0].name,
      data: conversionRate
    }];
    subtitle = 'Overall Conversion: ' + overallConversionRate + '%, Correlation: '+r + ' (' + rExplained + ')';
  } else if (isMultipleConversionChart) {
      series = obj.data.map(function(x) {
      var total = extractDataFromGAAPI(gaDataReports[x.total].data.rows, keys);
      var part = extractDataFromGAAPI(gaDataReports[x.part].data.rows, keys);
      var conversionRate = calculateRates(part, total, percentageSign);
      var overallConversionRate = calculateOverallRates(part, total, percentageSign);
      return {
        name: x.name + ' (Average: ' + overallConversionRate + percentageSign + ')',
        data: conversionRate
      };
    });
  } else if (isBreakdownByEventCategory) {
    series = obj.eventCategories.map(function(category, index) {
      var categoryData;
      var step = gaDataReports.length / obj.eventCategories.length;
      for (var n=0; n<obj.data.length; n++) {
        var gaReportIndex = obj.data[n].index + (index * step);
        var oneCategoryData = extractDataFromGAAPI(gaDataReports[gaReportIndex].data.rows, keys);
        oneCategoryData = addingMultiplierByKey(oneCategoryData, obj.data[n], obj.eventCategories[index]);
        if (n == 0) {
          categoryData = oneCategoryData;
        } else {
          categoryData = categoryData.map((a, i) => a + oneCategoryData[i]);
        }
      }
      return {
        name: category.name + ' (Average: ' + averageOfArray(categoryData) + percentageSign + ')',
        data: categoryData
      };
    });
  } else {
    series = obj.data.map(function(x) {
      var dataArray;
      if (obj.eventCategories && obj.eventCategories.length > 0 && obj.breakdown && obj.breakdown === 'data') {
        var dataArryInCategories;
        var eventCategoryLength = obj.eventCategories.length;
        var gaDataReportLength = gaDataReports.length / eventCategoryLength;
        for (var n=0; n < eventCategoryLength; n++) {
          var xIndex = x.index + n * gaDataReportLength;
          if (!gaDataReports[xIndex]) {
            console.log (obj);
          }
          var oneDataArray = extractDataFromGAAPI(gaDataReports[xIndex].data.rows, keys);
          var oneMultiplier;
          oneDataArray = addingMultiplierByKey(oneDataArray, x, obj.eventCategories[n]);
          if (n === 0) {
            dataArryInCategories = oneDataArray
          } else {
            dataArryInCategories = dataArryInCategories.map((a, i) => a + oneDataArray[i]);
          }
        }
        dataArray = dataArryInCategories;
      } else {
        dataArray = extractDataFromGAAPI(gaDataReports[x.index].data.rows, keys);
      }
      var dataMultiplier = multiplier;
      if (x.multiplier && x.multiplier > 0) {
        dataMultiplier = x.multiplier;
      }
      if (dataArray) {
        dataArray = dataArray.map(x => x * dataMultiplier);
        var currentEventCategory = x.eventCategory;
        if (currentEventCategory) {
          dataArray = addingMultiplierByKey(dataArray, x, currentEventCategory);
        }
      }
      return {
        name: x.name + ' (Average: ' + averageOfArray(dataArray) + percentageSign + ')',
        data: dataArray
      };
    });
  }
  var pointFormat;
  if (percentageSign === '') {
    pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.0f}' + percentageSign + '</b><br/>';
  } else {
    pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.3f}' + percentageSign + '</b><br/>';
  }


  var annotations = updateAnnotationWithChangeLog(changeLog, obj, series);

  var tooltip = getToolTipWithChangeLog(changeLog, pointFormat, obj);

  var plotLines = getPlotLinesWithChangeLog(changeLog, obj, series);

  if (obj.trendline !== undefined) {
    const trendlineData = getTrendline(series, obj.trendline);
    series.push(trendlineData);
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
          },
          plotLines: plotLines
      },
      yAxis: {
          title: {
              text: obj.yAxisTitle || obj.unitName || ''
          }
      },
      tooltip: tooltip,
      series: series,
      credits: {
        enabled: false
      },
      legend: {
        enabled: true
      },
      annotations: annotations,
      plotOptions: plotOptions
    });


}


function getTrendline (series, option) {
    var xs = []; 
    var ys = [];
    var minX = 1E100;
    var maxX = -1E100;
    var finalSeries;
    // if (option === 'sum') {
    //   var sumData = [];
    //   for (oneData of series) {
        
    //   }
    // } else {
    //   finalSeries = series;
    // }
    finalSeries = series;
    for (const [i,j] of series.entries()) {
        for (const [i,k] of j.data.entries()) {
            if (i < minX) minX = i;
            if (i > maxX) maxX = i;
            xs.push(i);
            ys.push(k);
        }
    };
    var reg = {};
    lineFit(xs,ys,reg);
    const trendlineData = {
      name: 'Trend',
      data: [[minX, reg.slope * minX + reg.intercept], 
             [maxX, reg.slope * maxX + reg.intercept]],
      color: '#0D7680',
      marker:{enabled:false},
      lineWidth: 5,
      type: 'spline'
    };
    return trendlineData;
}



function getToolTipWithChangeLog(changeLog, pointFormat, obj) {
  var tooltip;
  if (obj.showAnnotations === true || obj.showPlotLines === true) {
    tooltip = {
        formatter: function () {
            var title = '';
            for (logItem of changeLog) {
              if (logItem.date == this.x) {
                title = logItem.title;
                break;
              }
            }
            var s = '<b>' + this.x + ': ' + title + '</b>';
            for (point of this.points) {
              var percentageSign = (obj.percentage === true) ? '%': '';
                if (percentageSign === '') {
                  s += '<br><span style="color:' + point.color + '">' + point.series.name + '</span>: <b>' + point.y + percentageSign + '</b><br/>';
                } else {
                  s += '<br><span style="color:' + point.color + '">' + point.series.name + '</span>: <b>' + point.y + percentageSign + '</b><br/>';
                }
            }
            return s;
        },
        shared: true
    }
  } else {
    tooltip = {
      pointFormat: pointFormat,
      shared: true
    };
  }
  return tooltip;
}

function updateAnnotationWithChangeLog(changeLog, obj, series) {
  if (obj.showAnnotations !== true) {
    return [];
  }
  var keys = obj.keys;
  if (keys === undefined) {
    return [];
  }
  if (series.length == 0 || typeof series[0].data !== 'object') {
    return [];
  }
  var labels = [];
  for (logItem of changeLog) {
    const index = keys.indexOf(logItem.date);
    if (index >= 0) {
      const x = index;
      const y = getYForData(series, index, obj);
      const text = logItem.title;
      const label = {
        point: {
          xAxis: 0,
          yAxis: 0,
          x: index,
          y: y
        },
        text: text
      };
      labels.push(label);
    }
  }
  const annotations = [{
        labelOptions: {
            backgroundColor: '#0a5e66',
            color: 'white',
            verticalAlign: 'top',
            y: -36,
            zIndex: 999999,
            allowOverlap: true
        },
        labels: labels
    }];
  return annotations;
}

function getPlotLinesWithChangeLog(changeLog, obj, series) {
  if (obj.showPlotLines !== true) {
    return [];
  }
  var keys = obj.keys;
  if (keys === undefined) {
    return [];
  }
  if (series.length == 0 || typeof series[0].data !== 'object') {
    return [];
  }
  var plotLines = [];
  for (logItem of changeLog) {
    const index = keys.indexOf(logItem.date);
    if (index >= 0) {
      const x = index;
      //const y = getYForData(series, index, obj);
      const plotLine = {
          color: '#777777', // Red
          width: 1,
          value: x
      };
      plotLines.push(plotLine);
    }
  }
  //console.log (plotLines);
  return plotLines;
}



function getYForData(series, index, obj) {
  var y = 0;
  var currentData = [];
  for (item of series) {
    currentData.push(item.data[index]);
  }
  // MARK: If the chart is a stacking one
  if (obj.plotOptions) {
    y = currentData.reduce((a, b) => a + b, 0)
  } else {
    y = Math.max( ...currentData );
  }
  return y;
}


function drawBreakDownChart(obj) {
  var seriesData;
  if (obj.data.length > 0 && obj.data[0].name && obj.data[0].y) {
    seriesData = obj.data;
  } else {
    seriesData = obj.data.map(function(x, index) {
      var dataTotal = gaDataReports[x.index].data.totals[0].values[0];
      dataTotal = parseInt(dataTotal, 10) || 0;
      return  {
        name: x.name,
        y: dataTotal
      }
    });
  }
  var chartId = createChart();
  var chart = new Highcharts.Chart({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        renderTo: chartId,
        type: obj.type
    },
    title: {
        text: obj.title
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: '',
        colorByPoint: true,
        data: seriesData
    }]
  });
}


function drawTable(obj) {
  const title = obj.title;
  const description = obj.description;
  var tableData = gaDataReports[obj.index];
  var tableRowsHTML = '';
  var dataRows = tableData.data.rows;
  for (dataRow of dataRows) {
    const dimension = dataRow.dimensions[0];
    const metrics = dataRow.metrics[0].values;
    var metricsHTML = '';
    for (metric of metrics) {
      metricsHTML += '<td>'+ metric +'</td>'
    }
    const rowHTML = '<tr><td>'+dimension+'</td>'+metricsHTML+'</tr>';
    tableRowsHTML += rowHTML;
  }
  tableRowsHTML = '<tbody>' + tableRowsHTML + '</tbody>';
  const tableHeader = tableData.columnHeader.dimensions[0].replace(/^ga:/g,'');
  var columnHeaderHTML = '<th  aria-sort="none">' + tableHeader + '</th>';
  var columnHeaderData = tableData.columnHeader.metricHeader.metricHeaderEntries;
  for (oneHeader of columnHeaderData) {
    const name = oneHeader.name.replace(/^ga:/g,'');
    columnHeaderHTML += '<th  aria-sort="none">' + name + '</th>';
  }
  columnHeaderHTML = '<thead><tr>' + columnHeaderHTML + '</tr></thead>';
  var tableHTML = '<h1 class="page-title">' + title + '</h1><div class="page-description">'+ description +'</div><table class="ftc-table ftc-table--responsive-overflow ftc-table--row-stripes ftc-table--vertical-lines" data-ftc-component="ftc-table" data-ftc-table--no-js>' + columnHeaderHTML + tableRowsHTML + '</table>';
  insertDivWithHTML(tableHTML);
}


// MARK: A quick way to draw pivot chart with just enought information
function drawPivotChartFromKey(obj) {

  var percentageSign = (obj.percentage === true) ? '%': '';
  var keys = obj.keys;
  var unitName = obj.unitName || '';
  var multiplier = obj.multiplier || 1;
  var series;
  var subtitle = '';
  if (obj.originalData && obj.eventCategories) {
    obj.data = createAllData(obj.originalData, obj.eventCategories, gaDataReports.length);
  }
  if (obj.eventCategories) {
    obj.dataSets =  eventCategories.map(function(value){
      return value.name;
    });
  }
  if (obj.conversion === true && obj.data.length > 0 && obj.data[0].part !== undefined && obj.data[0].total !== undefined) {
    series = obj.data.map(function(x) {
      var total = extractDataFromGAAPI(gaDataReports[x.total].data.rows, keys);
      var part = extractDataFromGAAPI(gaDataReports[x.part].data.rows, keys);
      var overallConversionRate = calculateOverallRates(part, total);
      percentageSign = '%';
      return {
        name: x.name,
        y: [overallConversionRate]
      };
    });
  } else if (obj.conversion === true && obj.data.length > 0 && obj.data[0].data.length > 0 && obj.data[0].data[0].total !== undefined && obj.data[0].data[0].total !== undefined) {
    var dataLength = obj.data[0].data.length;
    series = [];
    for (var i=0; i<dataLength; i++) {
      var name = obj.data[0].data[i].name;
      var y = [];
      for (var j=0; j<obj.data.length; j++) {
        const totalIndex = obj.data[j].data[i].total;
        const total = extractDataFromGAAPI(gaDataReports[totalIndex].data.rows, keys);
        const partIndex = obj.data[j].data[i].part;
        const part = extractDataFromGAAPI(gaDataReports[partIndex].data.rows, keys);
        const overallConversionRate = calculateOverallRates(part, total);
        y.push(overallConversionRate);
      }
      series.push({
        name: name,
        y: y
      });
    }
  } else if (obj.data.length > 0 && obj.data[0].data.length > 0 && obj.data[0].data[0].index !== undefined && obj.data[0].data[0].name !== undefined) {
    var dataLength = obj.data[0].data.length;
    series = [];
    for (var i=0; i<dataLength; i++) {
      var name = obj.data[0].data[i].name;
      var y = [];
      for (var j=0; j<obj.data.length; j++) {
        const index = obj.data[j].data[i].index;
        const value = gaDataReports[index].data.totals[0].values[0];
        const valueNumber = parseInt(value, 10) || 0;
        y.push(valueNumber);
      }
      series.push({
        name: name,
        y: y
      });
    }
  }


  //console.log (gaDataReports);
  //console.log (series);

  var pointFormat;
  if (percentageSign === '') {
    pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.0f}' + percentageSign + '</b><br/>';
  } else {
    pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.3f}' + percentageSign + '</b><br/>';
  }
  var chartId = createChart();
  var chartObj = {
    title: obj.title,
    subtitle: obj.subtitle,
    type: obj.type,
    unit: obj.unitName,
    data: series,
    dataSets: obj.dataSets || [],
    decimalPoints: obj.decimalPoints || 0
  }
  drawNormalChart(chartObj);
}



function drawNormalChart(obj) {
  //console.log (obj);
  var seriesData;
  var total = [];
  var categories;
  var subtitle;
  var decimalPoints = obj.decimalPoints || 0;
  if (obj.data.length > 0 && obj.data[0].name && obj.data[0].y) {
    categories = obj.data.map(function(x, index) {
      return x.name;
    });
    var arrayCount = obj.data[0].y.length;
    seriesData = [];
    for (var i=0; i<arrayCount; i++) {
      var data = obj.data.map(function(x, index) {
        return x.y[i];
      });
      var dataSetName = obj.dataSets[i] || i;
      var oneItem = {
        name: dataSetName,
        data: data
      }
      seriesData.push(oneItem);
      var currentTotal;
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      currentTotal = data.reduce(reducer, 0);
      currentTotal = number_format(currentTotal, 0, '.', ',');
      total.push({
        name: dataSetName,
        value: currentTotal
      });
    }
  }
  const reducerForTotal = (accumulator, currentValue) => accumulator + ' ' + currentValue.name + ': ' + currentValue.value;
  subtitle = obj.subtitle || total.reduce(reducerForTotal, '');
  const unitName = obj.unit || '';
  var chartId = createChart(reducerForTotal, '');
  var chart = new Highcharts.Chart({
      chart: {
          type: obj.type,
          renderTo: chartId
      },
      title: {
          text: obj.title
      },
      subtitle: {
        text: subtitle
      },
      xAxis: {
          categories: categories,
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: unitName
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:,.' + decimalPoints +'f} ' + unitName + '</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      credits: {
        enabled: false
      },
      series: seriesData
  });
}

var pricing = {'1000': {
    'home': {
      '0201': [490,245],
      '0411': [510,255],
      '0412': [420,0],
      '0421': [350,0],
      '0301': [420,0],
      '0302': [350,0]
    },
    'ros': {
      '0201': [400,200],
      '0411': [470,235],
      '0412': [350,0],
      '0421': [450,225],
      '0301': [320,0]
    }
  },
  '2000': {
    'home': {
      '0101': [400,200],
      '0102': [400,200],
      '0301': [200,100],
      '0801': [200,100],
      '0401': [200,100],
      '0402': [200,0],
      '0302': [200,0]
    },
    'ros': {
      '0301': [200,100],
      '0401': [200,100],
      '0402': [200,0],
      '0302': [200,0]
    }
  },
  '3000': {
      'home': {
      '0101': [400,200],
      '0102': [400,200],
      '0301': [200,100],
      '0801': [200,100],
      '0401': [200,100],
      '0402': [200,0],
      '0302': [200,0]
    },
    'ros': {
      '0301': [200,100],
      '0401': [200,100],
      '0402': [200,0],
      '0302': [200,0]
    }
  },
  '4000': {
    'home': {
      '0101': [400,200],
      '0102': [400,200],
      '0301': [200,100],
      '0801': [200,100],
      '0401': [200,100],
      '0402': [200,0],
      '0302': [200,0]
    },
    'ros': {
      '0301': [200,100],
      '0401': [200,100],
      '0402': [200,0],
      '0302': [200,0]
    }
  },
  '5000': {
   'home': {
      '0101': [400,200],
      '0102': [400,200],
      '0301': [200,100],
      '0801': [200,100],
      '0401': [200,100],
      '0402': [200,0],
      '0302': [200,0]
    },
    'ros': {
      '0301': [200,100],
      '0401': [200,100],
      '0402': [200,0],
      '0302': [200,0]
    }
  },
  '6000': {
    'home': {
      '0101': [1000,500],
      '0102': [1000,500],
      '0411': [500,250],
      '0412': [500,0]
    },
    'ros': {
      '0461': [500,250]
    }
  },
  '7000': {
    'home': {
      '0101': [1000,500],
      '0102': [1000,500],
      '0411': [500,250],
      '0412': [500,0]
    },
    'ros': {
      '0461': [500,250]
    }
  }
};

var devices = {
  '1000': 'PC',
  '2000': 'iPhone App',
  '3000': 'iPhone Web',
  '4000': 'Android App',
  '5000': 'Android Web',
  '6000': 'iPad App',
  '7000': 'iPad Web'
};

var deviceTypes = {
  '1000': 'DeskTop',
  '2000': 'Mobile',
  '3000': 'Mobile',
  '4000': 'Mobile',
  '5000': 'Mobile',
  '6000': 'Mobile',
  '7000': 'Mobile'
};


function lookUpAdPosition(adInfo) {
  var deviceId = adInfo.deviceId;
  var channelId = adInfo.channelId;
  var positionId = adInfo.positionId;
  var adName;
  var finalPosition;
  Object.keys(adDevices).map(function(key, index) {
    if (adDevices[key].id === deviceId) {
      var adPattern = window[adDevices[key].patterns];
      var adSizeId = positionId.substring(0,2);
      var adPositionId = positionId.substring(2,4);
      Object.keys(adPattern).map(function(key, index) {
        if (adPattern[key].id === adSizeId) {
          var adName = key;
          //console.log (adName);
          var adPositionObj = adPattern[key].position;
          //console.log (adPositionObj);
          Object.keys(adPositionObj).map(function(key, index) {
            if (adPositionObj[key].id === adPositionId) {
              //console.log (key);
              finalPosition = {
                name: adName,
                position: key
              };
              //console.log (finalPosition);
            }
          });
        }
      });
    }
  });
  return finalPosition;
}

function lookUpAdChannel(adInfo) {
  var deviceId = adInfo.deviceId;
  var channelId = adInfo.channelId;
  var positionId = adInfo.positionId;
  var adName;
  var finalChannel;
  Object.keys(adDevices).map(function(key, index) {
    if (adDevices[key].id === deviceId) {
      var adChannelObj = window[adDevices[key].channels];
      var mainChannelId = channelId.substring(0,2);
      Object.keys(adChannelObj).map(function(key, index) {
        if (adChannelObj[key].id === mainChannelId) {
          finalChannel = key;
        }
      });
    }
  });
  return finalChannel;
}

function calculateAdValue(adInfo, adImpression) {
  var pricePerImpression = 0;
  var deviceId = adInfo.deviceId;
  var channelId = adInfo.channelId;
  var positionId = adInfo.positionId;
  var deviceBreakDown;
  var deviceType;
  var pageType;
  var adSize;
  var adPosition;
  var adChannel;
  deviceBreakDown = devices[deviceId] || deviceId;
  deviceType = deviceTypes[deviceId] || deviceId;
  if (typeof deviceId !== 'string' || typeof channelId !== 'string' || typeof positionId !== 'string') {
    return null;
  }
  var priceInfoForDevice = pricing[deviceId];
  if (priceInfoForDevice === undefined) {
    return null;
  }
  var priceInfoForChannel;
  if (channelId === '1000') {
    priceInfoForChannel = priceInfoForDevice.home;
    pageType = 'Home';
  } else {
    priceInfoForChannel = priceInfoForDevice.ros;
    pageType = 'Run of Site';
  }
  adPosition = lookUpAdPosition(adInfo);
  adChannel = lookUpAdChannel(adInfo);
  var priceInfoForPosition = priceInfoForChannel[positionId];
  if (priceInfoForPosition === undefined) {
    return null;
  }
  var finalPrice = priceInfoForPosition.map(onePrice => {
    return onePrice * adImpression / 1000;
  });
  var adInformation = {
    'value': finalPrice,
    'deviceType': deviceType,
    'deviceBreakDown': deviceBreakDown,
    'pageType': pageType,
    'name': adPosition.name,
    'position': adPosition.position,
    'channel': adChannel
  };
  return adInformation;
}

function calculateInventory() {
  var text = document.getElementById('test').value;
  text = text.replace(/[\n\r]+/g,'|');
  var textArray = text.split('|');
  var adValueBy = {};
  var adValueByDevice = {};
  for (var oneItem of textArray) {
    var adid = oneItem.replace(/^([0-9]+)[\s]+([0-9]+)$/g, '$1');
    var adImpression = oneItem.replace(/^([0-9]+)[\s]+([0-9]+)$/g, '$2');
    adImpression = parseInt(adImpression, 10) || 0;
    if (adid.length === 12) {
      var deviceId = adid.substring(0,4);
      var channelId = adid.substring(4,8);
      var positionId = adid.substring(8, 12);
      var adInfo = {
        deviceId: deviceId,
        channelId: channelId,
        positionId: positionId
      };
      var adInformation = calculateAdValue(adInfo, adImpression);
      var adValue;
      var adPageType;
      var adDeviceType;
      var adDeviceBreakdown;
      var adName;
      var adPosition;
      var adChannel;
      if (adInformation) {
        adValue = adInformation.value || 0;
        adPageType = adInformation.pageType;
        adDeviceType = adInformation.deviceType;
        adDeviceBreakdown = adInformation.deviceBreakDown;
        adName = adInformation.name;
        adPosition = adInformation.position;
        adChannel = adInformation.channel;
      } else {
        continue;
      }
      adInfo = {
        deviceType: adDeviceType,
        deviceBreakDown: adDeviceBreakdown,
        pageType: adPageType,
        name: adName,
        position: adPosition,
        fullname: adName + ': ' + adPosition,
        channel: adChannel
      }
      Object.keys(adInfo).map(function(key, index) {
        if (adValue && adValue.length > 0) {
          if (adValueBy[key] === undefined) {
            adValueBy[key] = {}
          }
          var value = adInfo[key];
          //console.log (value);
          if (adValueBy[key][value] === undefined)  {
            adValueBy[key][value] = adValue;
          } else {
            adValueBy[key][value] = adValueBy[key][value].map(function (num, idx) {
              return num + adValue[idx];
            });
          }
        }
      });
    }
  }
  Object.keys(adValueBy).map(function(key, index) {
    adValueBy[key] = convertToArray(adValueBy[key]);
  });
  return adValueBy;
}

function convertToArray(obj) {
  var newArray = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
       newArray.push({
        name: k,
        y: obj[k]
       });
    }
  }
  return newArray;
}

function createAllData(originalData, eventCategories, dataLength) {
  var finalData = [];
  const eventCategoriesLength = eventCategories.length
  const oneDataLength = dataLength/eventCategoriesLength;
  for (var i=0; i<eventCategoriesLength; i++) {
    // MARK: - Copy by Value Not Referennce
    var myOriginalData = JSON.parse(JSON.stringify(originalData));
    var convertedData = myOriginalData.map(function(value){
      var newValue = value;
      for (var key in newValue) {
        if (newValue.hasOwnProperty(key) && ['index', 'total', 'part'].includes(key)) {
            newValue[key] += i*oneDataLength;
        }
      }
      return newValue;
    });
    var currentCategory = {
      name: eventCategories[i].name,
      data: convertedData
    }
    finalData.push(currentCategory);
  }
  return finalData;
}

function number_format(number, decimals, dec_point, thousands_sep) {
  var n = !isFinite(+number) ? 0 : +number, 
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      toFixedFix = function (n, prec) {
          // Fix for IE parseFloat(0.55).toFixed(0) = 0;
          var k = Math.pow(10, prec);
          return Math.round(n * k) / k;
      },
      s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
  if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


// Get and Parse Dolphin Data
function callAjax(url, callback){
  var xmlhttp;
  // compatible with IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
          callback(xmlhttp.responseText);
      }
  }
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}

function getAdInfoFromDolphineCSV(csv) {
  var csvText = csv.replace(/[\r\n]+/g, '|');
  var csvArray = csvText.split('|');
  csvArray = csvArray.filter(function(text){
    return /^[0-9]+\-[0-9]+\-[0-9]+,/.test(text);
  });
  csvArray = csvArray.map(function(text){
    const textArray = text.split(',');
    const textDate = textArray[0];
    const name = textArray[1];
    const adid = textArray[2];
    const request = textArray[5];
    const textObj = {
      date: textDate,
      name: name,
      adid: adid,
      request: request
    };
    return textObj;
  });
  var finalObj = {
    ads: {}
  };
  for (item of csvArray) {
    const key = item.adid;
    if (finalObj.ads[key] === undefined) {
      finalObj.ads[key] = {
        requests: {}
      };
    }
    finalObj.ads[key].name = item.name;
    finalObj.ads[key].adid = item.adid;
    finalObj.ads[key].requests[item.date] = item.request;
  }
  const dates = csvArray.map(function(obj){
    const currentDate = new Date(obj.date)
    return currentDate;
  });
  const ids = csvArray.map(function(obj){
    const id = obj.adid;
    return id;
  });
  uniqueIds = ids.filter((v, i, a) => a.indexOf(v) === i); 
  finalObj.ids = uniqueIds;
  const startDate = new Date(Math.min.apply(null,dates));
  const endDate = new Date(Math.max.apply(null,dates));
  finalObj.startDate = startDate;
  finalObj.endDate = endDate;
  //console.log (finalObj);

  return finalObj;
}


function getDataSerieFromAdid(keys, csvText) {
  var adInfo = getAdInfoFromDolphineCSV(csvText);
  const adIdByUrl = window.location.search.replace(/.*adid=([0-9]+)/,'$1');
  const adIdByManual = document.getElementById('adid').value;
  const adId = adIdByUrl || adIdByManual;
  const adInfoItem = adInfo.ads[adId];
  if (adInfoItem === undefined) {
    return
  }
  const name = adInfoItem.name;
  const data = keys.map(function (key) {
    const keyConverted = key.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/g, '$1-$2-$3');
    var request = adInfoItem.requests[keyConverted] || 0;
    request = parseInt(request, 10) || 0;
    return request;
  });
  const series = {
    name: name,
    data: data
  };
  return series;
}