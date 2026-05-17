import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { StockkService } from '../stockk.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import * as Highcharts from 'highcharts/highstock';
import { MatDialog } from '@angular/material/dialog';
import { ModalForNewsComponent } from '../modal-for-news/modal-for-news.component';
import * as HighchartsInsights from 'highcharts';
import { XAxisOptions } from 'highcharts';
import { interval } from 'rxjs';
import vbp from 'highcharts/indicators/volume-by-price';
import { Modal } from 'bootstrap';

import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorZigzag from "highcharts/indicators/zigzag";
import IndicatorVBP from "highcharts/indicators/volume-by-price";
IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);
IndicatorVBP(Highcharts);
vbp(Highcharts);



// import { Chart } from 'angula';
interface StockRecommendationDataa {
  buy: number;
  hold: number;
  period: string;
  sell: number;
  strongBuy: number;
  strongSell: number;
  symbol: string;
}

interface SeriesData {
  name: string;
  data: (number[] | [string | number, number])[];
  type: string;
}
interface HighchartsDataPoint2 {
  x: string;
  y: number;
}

interface HighchartPoint {
  series: {
    name: string;
  };
  y: number;
}
interface HighchartFormatterContext {
  x: string;
  points?: HighchartPoint[];
}
//charts tab
interface StockDataPoint {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
  n: number;
}

interface ChartsData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: StockDataPoint[];
  status: string;
  request_id: string;
  count: number;
}




@Component({
  selector: 'app-tabsfor-search',
  templateUrl: './tabsfor-search.component.html',
  styleUrl: './tabsfor-search.component.css'
})
export class TabsforSearchComponent implements OnInit {
  stockName: string = '';
  companyStockQuoteData: any;
  companyAboutData: any;
  companyPeers: any;
  // chartOptionss: Highcharts.Options= {};
  //yt
  chartOptions: any;//1
  highcharts: typeof Highcharts = Highcharts;//1

  timestamp: any;
  openMarket: boolean = false;
  formattedDateTime: string = '';
  formattedDateTime2: Date = new Date();


  //newsTab
  companyNews: any;
  companyInsiderSentiment: any;


  //insightsTab
  totalMSPR: number = 0;
  positiveMSPR: number = 0;
  negativeMSPR: number = 0;
  totalChange: number = 0;
  positiveChange: number = 0;
  negativeChange: number = 0;
  stockRecommendationData: any;
  stockEarningsData: any;

  //insightsTabHighCharts1
  chartOptionsInsights1: any;//1
  highchartsInsights1: typeof Highcharts = Highcharts;//1
  xAxisCategories: string[] = [];
  // dataforhighchartsInsights1:any;


  chartOptions2: any;
  highcharts2: typeof Highcharts = Highcharts;
  actualData: number[] = [];
  estimateData: number[] = [];
  surpriseData: number[] = [];
  publicSeriesData2: HighchartsDataPoint2[][] = [];

  //chartsTab
  dataforchartsTab3:any;
  chartOptions3: any;
  highchartsForChartsTab: typeof Highcharts = Highcharts;

  calculateSMA(data: any[], period: number) {
    let sma = [];
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j][1]; // assuming data[i] = [time, value]
      }
      sma.push([data[i][0], sum / period]);
    }
    return sma;
  }

  createSMAVolumePriceChart(data:ChartsData) {
    const ohlcData = data.results.map((d: StockDataPoint) => [d.t, d.o, d.h, d.l, d.c]);
    const volumeData = data.results.map((d: StockDataPoint) => [d.t, d.v]);
    
    const sma = this.calculateSMA(data.results.map(d => [d.t, d.c]), 20);

    this.chartOptions3 = {
      
      title: {
        text: data.ticker + ' Historical'
      },subtitle: {
        text: 'With SMA and Volume by Price Technical Indicators'
    },
      xAxis: {
        type: 'datetime',
      },
      yAxis: [{
        opposite: true ,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          // align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        opposite:true,
        top: '65%',
        height: '35%',
        offset: 5,
        lineWidth: 2
      }],
      tooltip: {
        split: true
      },
      legend:{
        enabled:false
      },
      series: [{
        type: 'candlestick',
        name: data.ticker,
        data: ohlcData,
        id: 'forlinking',
        zIndex: 4
      }, {
        type: 'column',
        name: 'Volume',
        id:'volume',
        data: volumeData,
        yAxis: 1,
        zIndex: 1
      }, {
        type: 'vbp',
        linkedTo: 'forlinking',
        data:ohlcData,
        params: {
            volumeSeriesID: 'volume'
        },
        dataLabels: {
            enabled: false
        },
        zoneLines: {
            enabled: false
        }
    },{
        type: 'spline',
        name: 'SMA',
        data: sma,
        zIndex: 3,
        marker: {
          enabled: false
        }
      },]
  ,navigator: {
        enabled: true
      },
    
      scrollbar: {
        liveRedraw: false
      },
    
      rangeSelector: {
        enabled: true,

        buttons: [{
          type: 'month',
          count: 1,
          text: '1m'
        }, {
        type: 'month',
        count: 3,
        text: '3m'
      },{
          type: 'month',
          count: 6,
          text: '6m'
        },{
          type: 'ytd',
          text: 'YTD' // Year-to-date button
        }, {
          type: 'year',
          count: 1,
          text: '1y'
        }, {
          type: 'all',
          text: 'All'
        }],
        selected: 2,
        inputEnabled: true,
       // Here, '3' corresponds to the 'All' button
      },
    
    };
    this.highchartsForChartsTab.stockChart('container', this.chartOptions3);
  }

  // ohlcData:any;
  // volumeData:any;

  constructor(private cdr: ChangeDetectorRef,private stockkService: StockkService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {


  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stockName = params['ticker'];
      this.stockkService.setStockName(this.stockName);
      this.fetchDataForCompanyStockQuoteAPI(this.stockName);
      this.fetchDataForAboutCompany(this.stockName);
      this.fetchDataForChartTabStockQuote(this.stockName); 

      this.stockkService.fetchDataForCompanyStockQuote(this.stockName)
      .subscribe(data => {this.companyStockQuoteData = data;
        // console.log('API Response from fetch data for compnay stock quote API of display stock search component:', this.companyStockQuoteData);
        this.timestamp = this.companyStockQuoteData.t * 1000;//and this
        const timestampDifference = Math.floor(Date.now() - this.companyStockQuoteData.t) / 1000;
        this.openMarket = timestampDifference < 60 ? true : false; // send this
  })
//   if(this.openMarket==true){
//     interval(15000).subscribe(() => {
//       this.fetchDataForCompanyStockQuoteAPI(this.stockName);
//       this.fetchDataForAboutCompany(this.stockName);
//       this.fetchDataForChartTabStockQuote(this.stockName);  
//     });
//   }
// else {
//        this.fetchDataForCompanyStockQuoteAPI(this.stockName);
//       this.fetchDataForAboutCompany(this.stockName);
//       this.fetchDataForChartTabStockQuote(this.stockName);
// }
      // this.fetchDataForPolyCharts();
      this.fetchCompanyNews(this.stockName);
      // console.log("END OF NGONINIT", this.stockName);
      this.fetchInsiderSentimentFromAPI(this.stockName);
      this.fetchStockRecommendation(this.stockName);
      this.fetchStockEarnings(this.stockName);
      // const date: Date = new Date(this.timestamp);
      // const year: number = date.getFullYear();
      // const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
      // const day: string = String(date.getDate()).padStart(2, '0');
      // this.formattedDateTime = `${year}-${month}-${day}`;
      // console.log("TIMESTAMP TABS FOR SEARCH:", this.formattedDateTime);
   
   });


  }


  createChart(splineData: any[]) {
    // console.log("he");
    const color = this.companyStockQuoteData.dp>0 ? 'green' : 'red';
    this.chartOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Stock Price'
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          month: '%e. %b',
          year: '%b'
        }, title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: 'Price'
        }
      }, series: [{
        name: 'Current Price',
        data: splineData,
        color: color,
        marker:{
          enabled: false // Disable data point markers
        }
      }],
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        }
      }

    }
  }
  //



fetchDataForPolyCharts(time:number,OpenClose:boolean) {

{
  // time=1711686657;
  this.stockkService.fetchDataFromPolyMarketClosed(time,this.stockName)
  .subscribe(data => {
    // console.log("data from highcharts hourly stuff", time,this.stockName,data);
    const splineData = this.formatDataForHighcharts(data);//1
    // console.log(splineData);
    this.createChart(splineData);//1
  },
    error => {
      console.error('spline data closed market 403 error', error);
    });

}
      
    
  }


  formatDataForHighcharts(stockData: any) {
    const splineData: any = [];

    stockData.results.forEach((result: { t: string | number | Date; c: any; }) => {
      const date = new Date(result.t);
      const closePrice = [
        date.getTime(),  // timestamp
        result.c         // close price
      ];
      splineData.push(closePrice);

    });
    // console.log("SPLINEDATA FOR CHARTS", splineData);
    return splineData;
  }

  //insights2


  formatDataForHighcharts2(stockData2: any): { xAxisData: string[], seriesData2: HighchartsDataPoint2[][] } {
    const xAxisData: string[] = [];
    const seriesData2: HighchartsDataPoint2[][] = [];
 

    stockData2.forEach((item: { period: string, actual: number, estimate: number, surprise: number }) => {
      xAxisData.push(`${item.period} (Surprise: ${item.surprise})`);

      seriesData2.push([
        { x: `${item.period}!(Surprise: ${item.surprise})`, y: item.actual },
        { x: `${item.period}!(Surprise: ${item.surprise})`, y: item.estimate }
      ]);
      // console.log(seriesData2);

    });
    this.publicSeriesData2=seriesData2
    // console.log("seriesData", seriesData2);
    return { xAxisData, seriesData2 };
  }


  formatDataForHighchartsInsights1(stockDataa: any): SeriesData[] {
    const series: SeriesData[] = [
      { name: 'Buy', data: [], type: 'column' },
      { name: 'Strong Buy', data: [], type: 'column' },
      { name: 'Sell', data: [], type: 'column' },
      { name: 'Strong Sell', data: [], type: 'column' },
      { name: 'Hold', data: [], type: 'column' }
    ];


    stockDataa.forEach((item: { period: string }) => {
      this.xAxisCategories.push(item.period.substring(0, 7));
    });

    stockDataa.forEach((item: { period: string, buy: number, strongBuy: number, sell: number, strongSell: number, hold: number }) => {
      const period = item.period; // If period as a string is fine for xAxis categories
      // console.log("FORLOOPFORLOOP", item);
      // Push data to each series
      series[0].data.push([period, item.buy]);
      series[1].data.push([period, item.strongBuy]);
      series[2].data.push([period, item.sell]);
      series[3].data.push([period, item.strongSell]);
      series[4].data.push([period, item.hold]);

    });
    // console.log("SERIESERIESSERIESSSSS", series)
    return series;
  }

  //charts tab
//    formatDataForChartsTab(stockData) {
//     const ohlcData = [];
//     const volumeData = [];

//     // Assuming each 'result' has: v(volume), o(open), c(close), h(high), l(low), and t(timestamp)
//     stockData.results.forEach((result) => {
//         const date = new Date(result.t);  // Converting the timestamp to a Date object

//         // Creating the OHLC structure for Highcharts
//         const ohlcPoint = [
//             date.getTime(),  // timestamp
//             result.o,        // open
//             result.h,        // high
//             result.l,        // low
//             result.c         // close
//         ];
//         ohlcData.push(ohlcPoint);

//         // Creating the volume structure for Highcharts
//         const volumePoint = [
//             date.getTime(),  // timestamp
//             result.v         // volume
//         ];
//         volumeData.push(volumePoint);
//     });

//     // Returning an object with both sets of data
//     return {
//         ohlc: ohlcData,
//         volume: volumeData
//     };
// }



  fetchDataForCompanyStockQuoteAPI(stockname: any) {
    this.stockkService.fetchDataForCompanyStockQuote(stockname)
      .subscribe(data => {
        this.companyStockQuoteData = data;
        // console.log('API Response from Tabs for search component - Company Stock Quote:', this.companyStockQuoteData);
        this.timestamp = this.companyStockQuoteData.t * 1000;//uncomment
        // const timestampDifference = Math.floor(Date.now() - this.companyStockQuoteData.t) / 1000;//uncomment
        // this.openMarket = timestampDifference < 60 ? true : false; //uncomment

        this.timestamp = this.companyStockQuoteData.t * 1000;//and this
        const timestampDifference = Math.floor(Date.now() - this.companyStockQuoteData.t) / 1000;
        const openMarket = timestampDifference < 60 ? true : false; // send this
        // console.log("MARKET IS OPEN:", this.openMarket);
        // console.log("TIMESTAMP TABS FOR SEARCH:", this.timestamp);
        this.fetchDataForPolyCharts((this.companyStockQuoteData.t * 1000),openMarket);
      });
   
  }

  getMonthIndex(month: string): number {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(month);
  }

  fetchDataForAboutCompany(stockname: any) {
    this.stockkService.fetchDataForCompanyProfile(stockname).subscribe(
      (jsonData) => {
        this.companyAboutData = jsonData;
        // console.log('API Response from Summary Tab-About the company:', this.companyAboutData);
      });

    this.stockkService.fetchDataForCompanyPeers(stockname).subscribe(
      (data) => {
        this.companyPeers = data;
        // console.log('company peers: ', this.companyPeers)
      }
    )
  }


  handlePeerClick(peer: any) {
    this.router.navigate(['/search', peer]);
  }


  fetchCompanyNews(stockname: any) {
    this.stockkService.fetchDataForCompanyNews(stockname).subscribe(
      (jsonData) => {
        this.companyNews = jsonData;
        this.companyNews = this.companyNews.filter((item: { image: string; }) => item.image && item.image.trim() !== '');

      });

  }

  openModal(item: any): void {
    const dialogRef = this.dialog.open(ModalForNewsComponent, {
      width: '450px', // Set width and other configuration options
      data: { item }
    });
    // console.log("Entered tabs for search modal function");
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The modal was closed');
    });

  }
  //Insights tabs
  fetchInsiderSentimentFromAPI(stockName: any) {
    this.stockkService.fetchDataforInsiderSentiment(stockName)
      .subscribe(data => {
        this.companyInsiderSentiment = data;


        // console.log(this.stockkService.fetchDataforInsiderSentiment(stockName),"from tabsearch component");
        console.log('API Response for Company Insider Sentiment from TAB SEARCH Component:', data);
        if (data && data.data) {
          for (let i = 0; i < data.data.length; i++) {
            this.totalMSPR += data.data[i].mspr;
            data.data[i].mspr >= 0 ? this.positiveMSPR += data.data[i].mspr : this.negativeMSPR += data.data[i].mspr;

            this.totalChange += data.data[i].change;
            data.data[i].change >= 0 ? this.positiveChange += data.data[i].change : this.negativeChange += data.data[i].change;


            // console.log("----------test array", data.data[i].change); // Print each element of the array
          }
        } else {
          // console.log("No data found in the response.");
        }
      });

  }


  fetchStockRecommendation(stockName: any) {
    this.stockkService.fetchDataForStockRecommendation(stockName)
      .subscribe(data => {
        this.stockRecommendationData = data;
        // this.dataforhighchartsInsights1=this.stockRecommendationData;
        const splineData1 = this.formatDataForHighchartsInsights1(data);
        this.createStackedColumnChart(splineData1);

      }
      );//end of subscribe
    // this.barChart();
  }

  fetchStockEarnings(stockName: any) {
    this.stockkService.fetchDataForStockEarnings(stockName)
      .subscribe(data => {
        this.stockEarningsData = data;
        this.formatDataForHighcharts2(this.stockEarningsData);
        const splineData2 = this.formatDataForHighcharts2(this.stockEarningsData);//1Í
        //1


        this.stockEarningsData.forEach((dataPoint: any) => {
          this.actualData.push(dataPoint.actual);
          this.estimateData.push(dataPoint.estimate);
          this.surpriseData.push(dataPoint.surprise);
          console.log(this.actualData, "-----", this.estimateData, "------", this.surpriseData);
        });
        this.createChart2(this.actualData, this.estimateData, this.surpriseData,splineData2);

      }
      );//end of subscribe
    // this.barChart();
  }
  // barChart(splineData1: any[]){
  //   this.chartOptionsInsights1={
  //     chart:{
  //       type:'column'
  //     },
  //     title:{
  //       text:'Insights Tab CHart1'
  //     },
  //     subtitle:{
  //       text:'Insights Tab CHart1'
  //     },
  //     XAxis:{
  //       categories:['Asia','America','onemore','another']
  //     },
  //     series:[{        
  //       name: 'Current Price',
  //     data: splineData1}]
  //   }
  // }
  createStackedColumnChart(seriesData: SeriesData[]) {

    this.chartOptionsInsights1 = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Recommendation Trends'
      },
      xAxis: {
        categories: this.xAxisCategories, // Assuming each data point corresponds to a period
        title: {
          // text: 'Period'
        }
      },
      yAxis: {
        title: {
          text: '#Analysis'
        }
      },
      legend: {
        shadow: false
      },
      tooltip: {
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'normal', // Enable stacking
          borderWidth: 0,
          dataLabels: {
            enabled: true, // Enable data labels
            inside: true // Display data labels inside the columns
        }
        }
      },
      series: seriesData.map(dataPoint => ({
        name: dataPoint.name,
        data: dataPoint.data,
        type: 'column' // Specify chart type for each series
      }))
    };
  }
  



  createChart2(actualData: any[], estimateData: any[], surpriseData: any[],splinedataa:any) {
    console.log(actualData,estimateData,surpriseData,"======================");
    const categories: any = [];
    splinedataa.seriesData2.forEach((data: any)=>{
      categories.push(data[0].x.replace(/!/g, '<br>'));
      console.log(data[0].x.replace(/!/g, `\n`));
    })

    const periods = ['2023-12-31', '2023-09-30', '2023-06-30', '2023-03-31'];
// console.log("hey");
    // periods.forEach((period, index) => {
    //   const surprise = surpriseData[index];
    //   const category = `${period} (Surprise: ${surprise})`;
    //   categories2.push(category);
    // });

    this.chartOptions2 = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      xAxis: {
        categories: categories,
        title: {
          // text: 'Period'
        }
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        }
      },
      series: [{
        name: 'Actual',
        data: actualData,
        marker: {
          enabled: true,
          symbol: 'circle'
        }
      }, {
        name: 'Estimate',
        data: estimateData,
        marker: {
          enabled: true,
          symbol: 'circle'
        }
      }],
      tooltip: {
        shared: true,
        formatter: function (this: HighchartFormatterContext) {
          const index = categories.indexOf(this.x);
          // const surprise = surpriseData[index];
          let tooltip = `Period: <b>${this.x}</b><br/>`;
          if (this.points) {
            tooltip += `<b>${this.points[0].series.name}:</b> ${this.points[0].y}<br/>`;
            tooltip += `<b>${this.points[1].series.name}:</b> ${this.points[1].y}<br/>`;
            // tooltip += `Surprise: <b>${surprise}</b>`;
          }
          return tooltip;
        }
      },
    };

 
  }

  //charts tab
  fetchDataForChartTabStockQuote(stockname: any) {
    this.stockkService.fetchDataForChartsTab(stockname)
      .subscribe((data: ChartsData) => {
        const dataforchartsTab=data;
        console.log("---------------FETCHDATAFORCHARTSTABSTOCKQUOTE------------------",data);
        this.createSMAVolumePriceChart(data)
      });


    }


    refreshView() {
      this.cdr.detectChanges();
    }

}

