import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, Chart, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { centerTextPlugin } from '../../../../shared/pipe/count-chart-donut.pipe';
import { Vehicle } from '../../../../core/interface/vehicle.interface';

Chart.register(ChartDataLabels, centerTextPlugin);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgChartsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // ====== I18N & State ======
  private i18nService = inject(TranslateService);
  selectedVehicles: number[] = [];
  isDropdownOpen = false;

  //Company
  widgetWidthDropdownOpenCompany = false;
  showWidgetWidthSubmenuCompany = false;
  widgetWidthCompany: 'auto' | 'small' | 'medium' | 'large' = 'auto';

  //Donut1
  widgetWidthDropdownOpenDonut1 = false;
  showWidgetWidthSubmenuDonut1 = false;
  widgetWidthDonut1: 'auto' | 'large' | 'medium' | 'small' = 'auto';

  //Donut2
  widgetWidthDropdownOpenDonut2 = false;
  showWidgetWidthSubmenuDonut2 = false;
  widgetWidthDonut2: 'auto' | 'large' | 'medium' | 'small' = 'auto';

  //column1
  widgetWidthDropdownOpenColumn1 = false;
  showWidgetWidthSubmenuColumn1 = false;
  widgetWidthColumn1: 'auto' | 'large' | 'medium' | 'small' = 'auto';

  //column2
  widgetWidthDropdownOpenColumn2 = false;
  showWidgetWidthSubmenuColumn2 = false;
  widgetWidthColumn2: 'auto' | 'small' | 'medium' | 'large' = 'auto';

  showCompanyStats  = true;
  visible = { donut1: true, donut2: true, colPlant: true, colPort: true };

  // ====== Data ======
  vehicles: Vehicle[] = [
    { id: 1, name: '43C01338_C', status: 'at-plant', hasGoods: true, location: 'Cty Sedovina ( trang thiết bị trường học )' },
    { id: 2, name: '43C01339_C', status: 'at-plant', hasGoods: false, location: 'Keyhinge Hòa Cầm' },
    { id: 3, name: '43C01340_C', status: 'at-plant', hasGoods: true, location: 'Sợi Phú Nam' },
    { id: 4, name: '43C01341_C', status: 'at-plant', hasGoods: false, location: 'Cá kho Nam Định' },
    { id: 5, name: '43C01342_C', status: 'at-plant', hasGoods: true, location: 'Chả cá Lã Vọng' },
    { id: 6, name: '43C01343_C', status: 'at-port', hasGoods: true, location: '504' },
    { id: 7, name: '43C01344_C', status: 'at-port', hasGoods: false, location: 'A Minh' },
    { id: 8, name: '43C01345_C', status: 'at-port', hasGoods: true, location: 'A. Bửu ( Đại đồng _Đại lộc )' },
    { id: 9, name: '43C01346_C', status: 'at-port', hasGoods: false, location: 'An Lợi Tinh' },
    { id: 10, name: '43C01347_C', status: 'at-port', hasGoods: true, location: 'An Phú Tài' },
    { id: 11, name: '43C01348_C', status: 'at-port', hasGoods: false, location: 'Anh Bửu ( giác trầm làm hương )' },
    { id: 12, name: '43C01349_C', status: 'at-port', hasGoods: true, location: 'Bãi Container Chân Thật' },
    { id: 13, name: '43C01350_C', status: 'at-port', hasGoods: false, location: 'Bãi Container Hoàng Bảo Anh' },
    { id: 14, name: '43C01351_C', status: 'at-port', hasGoods: true, location: 'Bãi Container Hoàng Bảo Anh ( KCN PBA1 )' },
    { id: 15, name: '43C01352_C', status: 'at-port', hasGoods: false, location: 'Bãi X50' },
    { id: 16, name: '43C01353_C', status: 'at-port', hasGoods: true, location: 'Bãi xe 223 Trục chính (trả hàng bct )' },
    { id: 17, name: '43C01354_C', status: 'at-port', hasGoods: false, location: 'bãi Dăm Bạch đàn' },
    { id: 18, name: '43C01355_C', status: 'at-port', hasGoods: true, location: 'Bãi Tân Thành ( container Hòa cầm )' },
    { id: 19, name: '43C01356_C', status: 'at-port', hasGoods: true, location: 'Bãi Hải Phòng' },
    { id: 20, name: '43C01357_C', status: 'at-port', hasGoods: false, location: 'Bãi Thuận An' },
    { id: 21, name: '43C01358_C', status: 'at-port', hasGoods: true, location: 'Bãi Tân Thành' },
    { id: 22, name: '43C01359_C', status: 'at-port', hasGoods: true, location: 'Bãi Tân Triều' },
    { id: 23, name: '43C01360_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 24, name: '43C01361_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 25, name: '43C01362_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đuống' },
    { id: 26, name: '43C01363_C', status: 'at-port', hasGoods: false, location: 'Bãi sông Mê Công' },
    { id: 27, name: '43C01364_C', status: 'at-port', hasGoods: false, location: 'Bãi Củ Chi' },
    { id: 28, name: '43C01365_C', status: 'at-port', hasGoods: true, location: 'Bãi Cà Mau' },
    { id: 29, name: '43C01366_C', status: 'at-port', hasGoods: false, location: 'Bãi Mèo Vạc' },
    { id: 30, name: '43C01366_C', status: 'at-port', hasGoods: false, location: 'Bãi sông Đuống' },
    { id: 31, name: '43C01367_C', status: 'at-port', hasGoods: true, location: 'Bãi Mỹ An' },
    { id: 32, name: '43C01368_C', status: 'at-port', hasGoods: false, location: 'Bãi Hòa Bình' },
    { id: 33, name: '43C01369_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đà' },
    { id: 34, name: '43C01370_C', status: 'at-port', hasGoods: false, location: 'Bãi Cửa Lò' },
    { id: 35, name: '43C01371_C', status: 'at-port', hasGoods: true, location: 'Bãi Thanh Hóa' },
    { id: 36, name: '43C01372_C', status: 'at-plant', hasGoods: true, location: 'Bia Carron' },
    { id: 37, name: '43C01373_C', status: 'at-plant', hasGoods: true, location: 'Bia Barret' },
    { id: 38, name: '43C01374_C', status: 'at-plant', hasGoods: true, location: 'Bia Camel' },
    { id: 39, name: '43C01375_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 40, name: '43C01376_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Daikkin' },
    { id: 41, name: '43C01377_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Hưng Long' },
    { id: 42, name: '43C01378_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Thái Bình' },
    { id: 43, name: '43C01379_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Hưng Long' },
    { id: 44, name: '43C01380_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 45, name: '43C01381_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 46, name: '43C01382_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 47, name: '43C01383_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 48, name: '43C01384_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 49, name: '43C01385_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đà' },
    { id: 50, name: '43C01386_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đà' },
    { id: 51, name: '43C01387_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đà' },
    { id: 52, name: '43C01388_C', status: 'at-port', hasGoods: false, location: 'Bãi Cà Mau' },
  ];

  // ====== Donut Charts ======
  public donutType: 'doughnut' = 'doughnut';
  public donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: { enabled: true }
    }
  };
  public donut1Data: ChartData<'doughnut'> = {
    labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
    datasets: [{ data: [0, 0], backgroundColor: ['#509447', '#e2803c'] }]
  };
  public donut2Data: ChartData<'doughnut'> = {
    labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
    datasets: [{ data: [0, 0], backgroundColor: ['#509447', '#e2803c'], }]
  };

  // ====== Bar Chart: Nhà máy ======
  public barPlantType: 'bar' = 'bar';
  public barPlantLabels: string[] = [];
  public barPlantData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#dc143c',
        label: 'Số phương tiện',
        barPercentage: 0.4,
        categoryPercentage: 0.4
      }
    ]
  };
  public barPlantOptions: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: false,
    datasets: {
      bar: {
        barThickness: 30,
      }
    },
    layout: { padding: { top: 20 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#808080',
        font: { size: 11 },
        formatter: (value) => value
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          minRotation: window.innerWidth < 768 ? 45 : 0,
          font: { size: 10 },
          callback: function(value, index, ticks) {
            const label = this.getLabelForValue(Number(value));
            return typeof label === 'string' && label.length > 10 ? label.match(/.{1,13}/g) : label;
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, ticks) {
            if (index === ticks.length - 1) {
              return 'Số phương tiện';
            }
            return value;
          }
        }
      }
    }
  };

  // ====== Bar Chart: Cảng ======
  public barPortType: 'bar' = 'bar';
  public barPortLabels: string[] = [];
  public barPortData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#20c997',
        label: 'Số phương tiện',
        barPercentage: 0.4,
        categoryPercentage: 0.4
      }
    ]
  };
  public barPortOptions: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: false,
    datasets: {
      bar: {
        barThickness: 20,
      }
    },
    layout: { padding: { top: 20 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#808080',
        font: { size: 11 },
        formatter: (value) => value
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          minRotation: window.innerWidth < 768 ? 45 : 0,
          font: { size: 10 },
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(Number(value));
            return typeof label === 'string' && label.length > 10
              ? label.match(/.{1,13}/g)
              : label;
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, ticks) {
            if (index === ticks.length - 1) {
              return 'Số phương tiện';
            }
            return value;
          }
        }
      }
    }
  };

  // ====== Chart Plugins ======
  public chartPlugins = [ChartDataLabels, centerTextPlugin];

  // ====== Responsive Canvas ======
  canvasWidth = 0;
  canvasMinWidth = '0px';

  widgetWidthDropdownOpen = false;
  showWidgetWidthSubmenu = false;
  widgetWidth: 'auto' | 'small' | 'medium' | 'large' = 'auto';

  constructor() {}

  ngOnInit(): void {
    this.updateDonutData();
    this.updateBarPlantData();
    this.updateBarPortData();
    this.updateCanvasWidth();
    window.addEventListener('resize', () => this.updateCanvasWidth());
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCanvasWidth();
  }

  // ====== UI Methods ======
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedVehicles = this.vehicles.map(v => v.id);
    } else {
      this.selectedVehicles = [];
    }
    this.filterWidgetsBySelectedVehicles();
  }

  onCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      this.selectedVehicles.push(id);
    } else {
      this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
    }
    this.filterWidgetsBySelectedVehicles();
  }

  // Lọc dữ liệu cho các widget theo xe đã chọn
  filterWidgetsBySelectedVehicles() {
    const filteredVehicles = this.selectedVehicles.length === 0
      ? this.vehicles
      : this.vehicles.filter(v => this.selectedVehicles.includes(v.id));

    // Cập nhật dữ liệu cho các widget
    this.updateDonutData(filteredVehicles);
    this.updateBarPlantData(filteredVehicles);
    this.updateBarPortData(filteredVehicles);
  }

  getSelectedText(): string {
    if (this.selectedVehicles.length === 0) {
      return this.i18nService.instant('DASHBOARD.SELECT_PLACEHOLDER');
    }
    if (this.selectedVehicles.length === 1) {
      const v = this.vehicles.find(x => x.id === this.selectedVehicles[0]);
      return v ? v.name : `${this.i18nService.instant('DASHBOARD.SELECT_PLACEHOLDER')}`;
    }
    return `${this.selectedVehicles.length} ${this.i18nService.instant('DASHBOARD.SELECT_VEHICLE')}`;
  }

  toggleCompanyStats() {
    this.showCompanyStats = !this.showCompanyStats;
  }

  toggleDonut1() {
    this.visible.donut1 = !this.visible.donut1;
  }

  toggleDonut2() {
    this.visible.donut2 = !this.visible.donut2;
  }

  toggleColPlant() {
    this.visible.colPlant = !this.visible.colPlant;
  }

  toggleColPort() {
    this.visible.colPort = !this.visible.colPort;
  }

  //Donut1
  openWidgetWidthDropdownDonut1() {
    this.widgetWidthDropdownOpenDonut1 = true;
  }
  closeWidgetWidthDropdownDonut1() {
    this.widgetWidthDropdownOpenDonut1 = false;
    this.showWidgetWidthSubmenuDonut1 = false;
  }
  setWidgetWidthDonut1(width: 'auto' | 'small' | 'medium' | 'large') {
    this.widgetWidthDonut1 = width;
    this.closeWidgetWidthDropdownDonut1();
  }

  //Company
  openWidgetWidthDropdownCompany() {
    this.widgetWidthDropdownOpenCompany = true;
  }
  closeWidgetWidthDropdownCompany() {
    this.widgetWidthDropdownOpenCompany = false;
    this.showWidgetWidthSubmenuCompany = false;
  }
  setWidgetWidthCompany(width: 'auto' | 'small' | 'medium' | 'large') {
    this.widgetWidthCompany = width;
    this.closeWidgetWidthDropdownCompany();
  }

  //Donut2
  openWidgetWidthDropdownDonut2() {
    this.widgetWidthDropdownOpenDonut2 = true;
  }
  closeWidgetWidthDropdownDonut2() {
    this.widgetWidthDropdownOpenDonut2 = false;
    this.showWidgetWidthSubmenuDonut2 = false;
  }
  setWidgetWidthDonut2(width: 'auto' | 'small' | 'medium' | 'large') {
    this.widgetWidthDonut2 = width;
    this.closeWidgetWidthDropdownDonut2();
  }

  //Column1
  openWidgetWidthDropdownColumn1() {
    this.widgetWidthDropdownOpenColumn1 = true;
  }
  closeWidgetWidthDropdownColumn1() {
    this.widgetWidthDropdownOpenColumn1 = false;
    this.showWidgetWidthSubmenuColumn1 = false;
  }
  setWidgetWidthColumn1(width: 'auto' | 'small' | 'medium' | 'large') {
    this.widgetWidthColumn1 = width;
    this.closeWidgetWidthDropdownColumn1();
  }

  //Column2
  openWidgetWidthDropdownColumn2() {
    this.widgetWidthDropdownOpenColumn2 = true;
  }
  closeWidgetWidthDropdownColumn2() {
    this.widgetWidthDropdownOpenColumn2 = false;
    this.showWidgetWidthSubmenuColumn2 = false;
  }
  setWidgetWidthColumn2(width: 'auto' | 'small' | 'medium' | 'large') {
    this.widgetWidthColumn2 = width;
    this.closeWidgetWidthDropdownColumn2();
  }

  getWidgetWidthClass(type: 'company' | 'donut1' | 'donut2' | 'column1' | 'column2'): string {
    switch (type) {
      case 'company':
        return `widget-width-${this.widgetWidthCompany === 'auto' ? 'large' : this.widgetWidthCompany}`;
      case 'donut1':
        return `widget-width-${this.widgetWidthDonut1 === 'auto' ? 'small' : this.widgetWidthDonut1}`;
      case 'donut2':
        return `widget-width-${this.widgetWidthDonut2 === 'auto' ? 'small' : this.widgetWidthDonut2}`;
      case 'column1':
        return `widget-width-${this.widgetWidthColumn1 === 'auto' ? 'medium' : this.widgetWidthColumn1}`;
      case 'column2':
        return `widget-width-${this.widgetWidthColumn2 === 'auto' ? 'medium' : this.widgetWidthColumn2}`;
      default:
        return '';
    }
  }

  // ====== Canvas Width Helpers ======
  getCanvasMinWidth(labels: string[]): string {
    const pxPerLabel = 17;
    return `${labels.length * pxPerLabel}px`;
  }
  getCanvasMinWidthPort(): string {
    const pxPerLabel = 60;
    return `${this.barPortLabels.length * pxPerLabel}px`;
  }
  updateCanvasWidth() {
    const colWidth = document.querySelector('.col-12')?.clientWidth || 600;
    const pxPerLabel = 80;
    const minWidth = Math.max(this.barPortLabels.length * pxPerLabel, colWidth);
    this.canvasWidth = minWidth;
  }

  // ====== DATA UPDATE METHODS ======
  updateDonutData(vehicles = this.vehicles) {
    const atBorder = vehicles.filter(v => v.status === 'at-border');
    const onRoad = vehicles.filter(v => v.status === 'on-road');

    this.donut1Data = {
      labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
      datasets: [{
        data: [
          atBorder.filter(v => v.hasGoods).length,
          atBorder.filter(v => !v.hasGoods).length
        ],
        backgroundColor: ['#509447', '#e2803c']
      }]
    };

    this.donut2Data = {
      labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
      datasets: [{
        data: [
          onRoad.filter(v => v.hasGoods).length,
          onRoad.filter(v => !v.hasGoods).length
        ],
        backgroundColor: ['#509447', '#e2803c']
      }]
    };
  }

  updateBarPlantData(vehicles = this.vehicles) {
    const plantLabels = Array.from(new Set(
      vehicles.filter(v => v.status === 'at-plant').map(v => v.location)
    ));
    const plantCounts = plantLabels.map(label =>
      vehicles.filter(v => v.status === 'at-plant' && v.location === label).length
    );
    this.barPlantLabels = plantLabels;
    this.barPlantData = {
      labels: plantLabels,
      datasets: [{
        data: plantCounts,
        backgroundColor: '#dc143c',
        label: 'Số phương tiện',
        barPercentage: 0.4,
        categoryPercentage: 0.4
      }]
    };
  }

  updateBarPortData(vehicles = this.vehicles) {
    const portLabels = Array.from(new Set(
      vehicles.filter(v => v.status === 'at-port').map(v => v.location)
    ));
    const portCounts = portLabels.map(label =>
      vehicles.filter(v => v.status === 'at-port' && v.location === label).length
    );
    this.barPortLabels = portLabels;
    this.barPortData = {
      labels: portLabels,
      datasets: [{
        data: portCounts,
        backgroundColor: '#20c997',
        label: 'Số phương tiện',
        barPercentage: 0.4,
        categoryPercentage: 0.4
      }]
    };
  }

  get totalVehicles(): number {
    return this.vehicles.length;
  }

  get totalVehiclesInStock(): number {
    // Ví dụ: xe ở nhà máy là "trong kho"
    return this.vehicles.filter(v => v.hasGoods === true).length;
  }

  get totalVehiclesNotInStock(): number {
    // Ví dụ: xe không ở nhà máy là "không trong kho"
    return this.vehicles.filter(v => v.hasGoods === false).length;
  }

  get percentInStock(): number {
    return this.totalVehicles === 0 ? 0 : Math.round(this.totalVehiclesInStock / this.totalVehicles * 100);
  }

  get percentNotInStock(): number {
    return this.totalVehicles === 0 ? 0 : Math.round(this.totalVehiclesNotInStock / this.totalVehicles * 100);
  }

  updateCompanyStats() {
    return {
      totalVehicles: this.totalVehicles,
      totalVehiclesInStock: this.totalVehiclesInStock,
      totalVehiclesNotInStock: this.totalVehiclesNotInStock,
      percentInStock: this.percentInStock,
      percentNotInStock: this.percentNotInStock
    };
  }

  refreshDonut1() {
    this.updateDonutData(this.selectedVehicles.length === 0 ? this.vehicles : this.vehicles.filter(v => this.selectedVehicles.includes(v.id)));
  }

  refreshDonut2() {
    this.updateDonutData(this.selectedVehicles.length === 0 ? this.vehicles : this.vehicles.filter(v => this.selectedVehicles.includes(v.id)));
  }

  refreshBarPlant() {
    this.updateBarPlantData(this.selectedVehicles.length === 0 ? this.vehicles : this.vehicles.filter(v => this.selectedVehicles.includes(v.id)));
  }

  refreshBarPort() {
    this.updateBarPortData(this.selectedVehicles.length === 0 ? this.vehicles : this.vehicles.filter(v => this.selectedVehicles.includes(v.id)));
  }

  refreshCompanyStats() {
    this.updateCompanyStats();
  }

  refreshAll() {
    this.selectedVehicles = [];
    this.updateDonutData();
    this.updateBarPlantData();
    this.updateBarPortData();
    this.updateCanvasWidth();
  }
}
