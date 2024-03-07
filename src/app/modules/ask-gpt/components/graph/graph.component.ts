import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, Chart, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AskGptService } from '../../ask-gpt.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { cursorTo } from 'readline';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

Chart.defaults.font.family = 'Geist-regular';
// Chart.defaults.font.weight = '100';
Chart.defaults.font.style = 'initial';
// Chart.defaults.borderColor = '#475467'
Chart.defaults.color = '#475467';
// Chart.defaults.elements.point.pointStyle = false;


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewChecked {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective | undefined;
    @ViewChild(BaseChartDirective) savedBaseChart: BaseChartDirective;

  @Input() data;
  @Input() options;
  @Input() chartType;
  @Input() displayType;
  @Input() showSaveBtn;
  @Input() showUnsaveBtn;
  @Input() id;
  @Input() title;
  @Output() onUnsave: EventEmitter<any> = new EventEmitter<any>();
  chartPlugins = [ChartDataLabels];
  selectedChartIndex = 0;
  // types: string[];
  scales = {
    x: {
      ticks: {
        callback: this.convertToKFormat.bind(null)
      }
    },
    y: {
      ticks: {
        callback: this.convertToKFormat.bind(null)
      },
      border: {
        dash: [2,4],
      }
    }
  }

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'x',
    layout: {
      padding: 6
    },
    // We use these empty structures as placeholders for dynamic theming.
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 1.5,
      },
      point:{
        radius: 1,
        hitRadius: 3,
        hoverRadius: 5,
        hoverBorderWidth: 2,
        backgroundColor: "#0084FF"
      }
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        // display: false
      },
      y: {
        ticks: {
          callback: this.convertToKFormat.bind(null)
        },
        border: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false
        },
        // display: false,
        min: 0
      },
    },
    datasets: {
      bar: {
        maxBarThickness: 18,
        borderRadius: 2
      },
      line: {
        pointBorderWidth: 0,
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        "align": "start",
        labels: {
          padding: 10,
          usePointStyle: true,
          pointStyle: 'rectRounded',
          // pointStyleWidth: 16,
          // boxWidth: 3,
          // boxHeight: 5,
          // useBorderRadius: true,
          // borderRadius: 2,
        },
      },
      // afterLayout: chart => {
        //   let ctx = chart.ctx;
        //   ctx.save();
        //   let yAxis = chart.scales.y;
        //   let yThreshold = yAxis.getPixelForValue(threshold);
        //   let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);
        //   gradient.addColorStop(0, 'green');
        //   let offset = 1 / yAxis.bottom * yThreshold;
        //   gradient.addColorStop(offset, 'green');
        //   gradient.addColorStop(offset, 'red');
        //   gradient.addColorStop(1, 'red');
        //   chart.data.datasets[0].borderColor = gradient;
        //   ctx.restore();
        // }
        datalabels: {
          display: false
        },
    },
  };
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: true,
    layout: {
      padding: 6,
    },
    elements: {
      line: {
        tension: 0.1,
        borderWidth: 1.5
      },
      point:{
        radius: 0
    }
    },
    scales: {
      r: {
        pointLabels: {
          display: false // Hides the labels around the radar chart 
        }
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'right',
        // labels: {
        //   usePointStyle: true,
        //   pointStyle: 'circle',
        //   boxWidth: 8,
        //   boxHeight: 8,
        // }
      },
      datalabels: {
        display: false
        // formatter: (value: any, ctx: any) => {
        //   if (ctx.chart.data.labels) {
        //     return ctx.chart.data.labels[ctx.dataIndex];
        //   }
        // },
      },
    },
  }

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: true,
    layout: {
      padding: 30,
    },
    datasets: {
      doughnut: {
        borderRadius: 8,
        borderWidth: 0,
        // spacing: 10,
      },
    },
    scales: {
    },
    plugins: {
      legend: {
        display: false,
        // position: 'right',
        // labels: {
        //   usePointStyle: true,
        //   pointStyle: 'circle',
        //   boxWidth: 8,
        //   boxHeight: 8,
        // }
      },
      datalabels: {
        display: false
        // formatter: (value: any, ctx: any) => {
        //   if (ctx.chart.data.labels) {
        //     return ctx.chart.data.labels[ctx.dataIndex];
        //   }
        // },
      },
    },
  };
  
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: true,
    layout: {
      padding: 30,
    },
    datasets: {
      doughnut: {
        borderRadius: 8,
        borderWidth: 0,
        // spacing: 10,
      },
    },
    scales: {
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          padding: 13,
          // usePointStyle: true,
          // pointStyle: 'circle',
          // boxPadding: 15,
          boxWidth: 8,
          boxHeight: 8,
        }
      },
      datalabels: {
        display: false
        // formatter: (value: any, ctx: any) => {
        //   if (ctx.chart.data.labels) {
        //     return ctx.chart.data.labels[ctx.dataIndex];
        //   }
        // },
      },
    },
  };

  // public bubbleChartOptions: ChartConfiguration['options'] = {
  //   scales: {
  //     x: {
  //       min: 0,
  //       max: 100,
  //       ticks: {},
  //     },
  //     y: {
  //       min: 0,
  //       max: 100,
  //       ticks: {},
  //     },
  //   },
  // };

  actionLoading: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private service: AskGptService,
    private gs: GeneralService
  ) {
    this.id = this.id;
  }
  public legendSettings?: Object;

  ngOnInit(): void {
    this.showSaveBtn = this.showSaveBtn === 0 ? true : false;
    // this.types = ['bar', 'line', 'scatter', 'doughnut', 'radar', 'pie', 'bubble'];
    this.setOptions();
    this.chartOptions = this.setChartType();
    this.setScales();
  }

  ngAfterViewInit() {
    this.setGradients();
    this.setCutOut();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  setCutOut() {
    // circumference: 270,
    if (this.chartType !== 'doughnut') {
      return;
    }
    const ci = this.savedBaseChart;    
    // if (this.data.datasets.length == 1) {
    //   this.data.datasets.forEach((dataset, i) => {
    //       dataset['cutout'] = 70;
    //       dataset['borderRadius'] = 2;
    //   });
    // }    
    ci.update();
    this.changeDetectorRef.detectChanges();
  }

  setGradients() {
    if (this.chartType !== 'line') {
      return;
    }
    const ci = this.savedBaseChart;
    const ctx = ci.chart.ctx;
    
    // this.data.datasets.push(
    //   {
    //     borderColor: ['#03045E', '#0096C8', '#0084FF', '#C2E1FF']
    //   }
    // )

    var updateColors = ['#03045E', '#0096C8', '#0084FF', '#C2E1FF'];
    var cashSets:any = [];
    var cashValues:any = [];

    // if (this.data.datasets[0].gradientStart !== undefined) {
      this.data.datasets.forEach((dataset, i) => {
        this.data.datasets[i].borderColor = updateColors[i];
        this.data.datasets[i].pointBackgroundColor = updateColors[i];
        this.data.datasets[i].backgroundColor = updateColors[i];

        // if (i == 0) {
          var gradientFill = ctx.createLinearGradient(0, 300, 0, 0);
          // ctx.createLinearGradient()
          // gradientFill.addColorStop(0.5, dataset.gradientEnd);
          gradientFill.addColorStop(1, '#0084FF1A');
          gradientFill.addColorStop(0.5, '#0084FF00');
          // gradientFill.addColorStop(0, dataset.backgroundColor);
          // gradientFill.addColorStop(0.5, dataset.gradientEnd);
          // gradientFill.addColorStop(1, dataset.gradientStart);
          dataset['fill'] = true;
          dataset['backgroundColor'] = gradientFill;
        // }
        cashSets.push(this.data.datasets[i]);
        let flagL = 0;
        let dataLength = this.data.datasets[i].data.length;
        for (let l = 0; l < dataLength+dataLength; l++) {
          if(l == 0){
            cashSets[i].data[l] = this.data.datasets[i].data[l] + (this.data.datasets[i].data[l] - this.data.datasets[i].data[l+1]);
            flagL++;
          }else if(l%2 == 0){
            cashSets[i].data[l] = (this.data.datasets[i].data[l-1] + this.data.datasets[i].data[l])/2;
            flagL++;
          }else if(l == 1 ){
            cashSets[i].data.push(this.data.datasets[i].data[l-1]);
            flagL = 0;
          }else{
            cashSets[i].data.push(this.data.datasets[i].data[flagL]);
          }
        }
      });

      let spaceLength = 2 * this.data.labels.length;
      let flagJ = 0;
      for (let j = 0; j < spaceLength; j++) {
        if(j == 0 || j%2 == 0){
          cashValues[j] = '';
          flagJ++;
        }else if(j == 1){
          cashValues[j] = this.data.labels[flagJ-1];
          flagJ = 0;
        }else if(j > 2){
          cashValues[j] = this.data.labels[flagJ];
        }
      };
      
      cashValues.forEach((cashValue, k) => {
        if(k < cashValues.length){
          this.data.labels[k] = cashValues[k];
        }else if(k == cashValues.length){
          this.data.labels.push(cashValues[k]);
        }
      });
      
      ci.update();
      this.changeDetectorRef.detectChanges();
    // }
  }

  // changeGraph() {
  //   this.selectedChartIndex = this.selectedChartIndex + 1 < this.types.length ? this.selectedChartIndex + 1 : 0;
  //   this.chartType = this.types[this.selectedChartIndex];
  // }

  setChartType() {
    if (this.chartType == 'line' || this.chartType == 'bar') {
      return this.chartOptions;
    }
    if (this.chartType == 'radar') {
      return this.radarChartOptions;
    }
    if (this.chartType == 'pie'){
      return this.pieChartOptions;
    }
    return this.doughnutChartOptions;
  }

  setScales() {
    if (this.chartType == 'bubble' || this.chartType == 'scatter') {
      this.chartOptions.scales = this.scales;
    }
  }

  convertToKFormat(value, index, values) {
    const format = this ? this : '';
    const number = parseFloat(value.toString());
    if (isNaN(number)) {
      return value;
    }
    return Math.abs(number) >= 1000 ? format + (number / 1000 + 'k') : format + value;
  }

  setOptions() {
    if (this.options) {
      this.chartOptions.indexAxis = this.options.indexAxis ? this.options.indexAxis : this.chartOptions.indexAxis;
      if (this.options.indexAxis) {
        this.chartOptions.scales.y.ticks = {
        }
        this.chartOptions.scales.x.ticks = {
          callback: this.convertToKFormat.bind(null)
        }
      }
      if (this.options.yAxis?.format) {
        let data = { format: this.options.yAxis.format }
        this.chartOptions.scales.y.ticks = {
          callback: this.convertToKFormat.bind(data.format)
        }
      }
      if (this.options.xAxis?.format) {
        let data = { format: this.options.xAxis.format }
        this.chartOptions.scales.x.ticks = {
          callback: this.convertToKFormat.bind(data.format)
        }
      }
      if (this.options.scales?.y?.min) {
        this.chartOptions.scales.y.min = this.options.scales.y.min;
      }
      if (this.options.scales?.x?.min) {
        this.chartOptions.scales.x.min = this.options.scales.x.min;
      }
    }
  }

  async saveGraph(isSave = true) 
  {
    if (this.actionLoading) {
      return;
    }
    let data = {
      question_id: this.id
    }
    try {
      this.actionLoading = true;
      const response: any = await this.service.saveGraph(data, isSave);
      this.gs.showToastSuccess(response?.message);
      this.showSaveBtn = false;
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      if (!isSave) {
        this.onUnsave.emit()
      }
      this.actionLoading = false;
    }
  }


  legendOnClick(indexItem): void {
    const ci = this.savedBaseChart;
    console.log(indexItem);
  
    if (this.data.datasets[indexItem].hidden  == false) {
       this.data.datasets[indexItem].hidden = true;
       console.log("hidden");
      } 
      else { 
        this.data.datasets[indexItem].hidden = false;
        console.log("show");
    }
    ci.update();

    /** If every dataset's `hidden` key is `true`, re-assign all `hidden` keys with value of `false` */
    if (this.data.datasets.every(dataset => dataset.hidden === true)) {
      this.data.datasets.map(eachDataset => Object.assign(eachDataset, {hidden: false}))
      ci.update();
    }
    console.log(ci);
  }

}
