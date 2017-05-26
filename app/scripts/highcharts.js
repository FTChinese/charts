var FTChartStyle;
var highchartsOptions;
var Highcharts;
function setHighChartsStyle() {
    var titleSize=25;
    var enableLegend=true;
    FTChartStyle = {
        colors: ['#9e2f50', '#4781aa', '#eda45e', '#a6a471', '#736e7e', '#94826b', '#936971', '#c36256', '#8ab5cd'],
        chart: {
            backgroundColor: '#fff1e0',
            borderWidth: 0,
            plotBackgroundColor: '#fff1e0',
            plotShadow: false,
            plotBorderWidth: 0,
            spacingRight: 20
        },
        title: {
            align : 'center',
            style: { 
                color: '#333',
                padding: '0 14px 0 14px',
                font: 'bold '+titleSize+'px arial,"Hiragino Sans GB","Heiti SC",STHeiti,"Microsoft Yahei",SimSun'
                //lineHeight:'162%'
            }
        },
        subtitle: {
            align: 'center',
            y: titleSize * 2,
            style: { 
                color: '#333333',
                font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti'
            }
        },


        xAxis: {
            lineColor: '#333',
            lineWidth: 2,
            tickColor: '#333',
            tickWidth: 1,
            tickPosition: 'outside',
            allowDecimals: false,
            showFirstLabel: true,
            labels: {
                style: {
                    color: '#333',
                    font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti'
                }
            }
        },

        yAxis: {
            gridLineColor: '#999',
            labels: {
                style: {
                    color: '#333',
                    font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti'
                }
            }
        },

        //设定两个Ｙ轴的格式，可以避免在双Ｙ轴的情况下程序出错

        /*
        yAxis: [{
            gridLineColor: '#999',
            labels: {
                style: {
                    color: '#333',
                    font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti'
                }
            }
        }
        
        {
            gridLineColor: '#999',
            labels: {
                style: {
                    color: '#333',
                    font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti'
                }
            }
        }],
        {
            gridLineColor: '#999',
            labels: {
                style: {
                    color: '#333',
                    font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti'
                }
            }
        }],*/
        plotOptions: {
            column: {
                borderWidth: 1,
                borderColor: '#000',
                shadow: false
            },	
            bar: {
                borderWidth: 1,
                borderColor: '#000',
                shadow: false
            },
            line: {
                shadow: false
            },
            pie: {
                lineWidth:1,
                slicedOffset:15,
                shadow:false,
                showInLegend:true,
                center: ['50%', '45%'],
                size: '85%',
                series: {
                    showCheckbox: true
                },
                dataLabels: {
                    enabled: false,
                    color: '#333',		
                    softConnector: false,					
                    connectorColor: '#333',
                    style: {
                        font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti',
                    },	
                }
            }
        },
        legend: {
            layout: 'vertical',
            backgroundColor: '#FFFFFF',
            align: 'right',
            verticalAlign: 'top',
            floating: true,
            enabled: enableLegend,
            shadow: false,
            borderRadius: 0,
            itemStyle: {	
                font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti',
                color: '#333'
            },
            itemHiddenStyle: {
                color: 'gray'
            },

            itemHoverStyle: {
                color: '#4781aa'
            }
        },
        labels: {
            style: {
                color: '#333'
            }
        },
        credits: {
            position: {
                align: 'right',
                x: -14,
                verticalAlign: 'bottom',
                y: -3
            }
        },
        tooltip: {
            style: {
                color: '#333',
                font: '12px arial,"Hiragino Sans GB","Heiti SC",STHeiti'
            },
            borderRadius: 0,
            shadow:false
        }
    };
    highchartsOptions = Highcharts.setOptions(FTChartStyle);
}
setHighChartsStyle();