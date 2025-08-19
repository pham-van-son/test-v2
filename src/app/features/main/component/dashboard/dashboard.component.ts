import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, Chart, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Vehicle } from '../../../../core/interface/vehicle.interface'
import { centerTextPlugin } from '../../../../shared/pipe/count-chart-donut.pipe';

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
  private i18nService = inject(TranslateService);

  public chartPlugins = [ChartDataLabels, centerTextPlugin];

  selectedVehicles: number[] = [];
  isDropdownOpen = false;
  showStats = true;
  visible = { donut1: true, donut2: true, colPlant: true, colPort: true };

  vehicles: Vehicle[] = [
    { id: 1, name: '43C01338_C' },
    { id: 2, name: '43C01339_C' },
    { id: 3, name: '43C01340_C' },
    { id: 4, name: '43C01341_C' },
    { id: 5, name: '43C01342_C' },
    { id: 6, name: '43C01343_C' },
    { id: 7, name: '43C01344_C' },
    { id: 8, name: '43C01345_C' },
    { id: 9, name: '43C01346_C' },
    { id: 10, name: '43C01347_C' },
    { id: 11, name: '43C01348_C' },
    { id: 12, name: '43C01349_C' },
    { id: 13, name: '43C01350_C' },
    { id: 14, name: '43C01351_C' },
    { id: 15, name: '43C01352_C' },
    { id: 16, name: '43C01353_C' },
    { id: 17, name: '43C01354_C' },
    { id: 18, name: '43C01355_C' },
    { id: 19, name: '43C01356_C' },
    { id: 20, name: '43C01357_C' },
    { id: 21, name: '43C01358_C' },
  ];

  // Donut chart 1
  public donut1Data: ChartData<'doughnut'> = {
    labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
    datasets: [{ data: [0, 40], backgroundColor: ['#509447', '#e2803c'] }]
  };
  public donut2Data: ChartData<'doughnut'> = {
    labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
    datasets: [{ data: [0, 80], backgroundColor: ['#509447', '#e2803c'] }]
  };
  public donutType: 'doughnut' = 'doughnut';
  public donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true, // đổi marker thành hình tròn
          pointStyle: 'circle'
        }
      },
      tooltip: { enabled: true }
    }
  };


  // ChartJS: Phương tiện tại nhà máy
  public barPlantOptions: ChartOptions<'bar'> = {
    responsive: true,
    layout: {
      padding: {
        top: 20,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
      anchor: 'end',   // bám vào đỉnh cột
      align: 'end',    // hiển thị ngay phía trên
      color: '#808080',
      font: { size: 11 },
      formatter: (value) => value   // hiện đúng số liệu gốc
    }
    },
    scales: {
      x: {
        ticks: {
          font: { size: 11 },
          callback: function(value, index, ticks) {
            const label = this.getLabelForValue(Number(value));
            return typeof label === 'string' && label.length > 15 ? label.match(/.{1,15}/g) : label;
          }
        },
      },
      y: {
      beginAtZero: true,
      ticks: {
        callback: function (value, index, ticks) {
          // ticks[ticks.length - 1] = tick cuối cùng (max)
          if (index === ticks.length - 1) {
            return 'Số phương tiện'; // ✅ thay vì số max
          }
          return value; // các tick khác giữ nguyên
        }
      }
    }
    }
  };

  public barPlantLabels: string[] = [
    'Cty Sedovina ( trang thiết bị trường học )',
    'Keyhinge Hòa Cầm',
    'Sợi Phú Nam'
  ];

  public barPlantData: ChartData<'bar'> = {
    labels: this.barPlantLabels,
    datasets: [
      {
        data: [3, 1, 1],
        backgroundColor: '#dc143c',
        label: 'Số phương tiện',
        barPercentage: 0.4,        // Đặt ở đây!
        categoryPercentage: 0.4    // Đặt ở đây!
      }
    ]
  };

  public barPlantType: 'bar' = 'bar';

  // ChartJS: Phương tiện tại cảng
  public barPortLabels: string[] = [
    '504', 'A Minh', 'A. Bửu ( Đại đồng _Đại lộc )', 'An Lợi Tinh', 'An Phú Tài',
    'Anh Bửu ( giác trầm làm hương )', 'Bãi Container Chân Thật', 'Bãi Container Hoàng Bảo Anh',
    'Bãi Container Hoàng Bảo Anh ( KCN PBA1 )', 'Bãi X50', 'Bãi xe 223 Trục chính (trả hàng bct )',
    'bãi Dăm Bạch đàn', 'Bãi Tân Thành ( container Hòa cầm )', 'Khu FLC (Thanh Hóa)'
  ];

  public barPortData: ChartData<'bar'> = {
    labels: this.barPortLabels,
    datasets: [
      { data: [110, 50, 60, 70, 80, 40, 40, 40, 40, 100, 90, 40, 10, 90], backgroundColor: '#20c997', label: 'Số phương tiện', barPercentage: 0.4,        // Đặt ở đây!
        categoryPercentage: 0.4  }
    ]
  };

  public barPortOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',   // bám vào đỉnh cột
        align: 'end',    // hiển thị ngay phía trên
        color: '#808080',
        font: { size: 11 },
        formatter: (value) => value   // hiện đúng số liệu gốc
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: { size: 11 },
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(Number(value));
            return typeof label === 'string' && label.length > 15
              ? label.match(/.{1,15}/g)
              : label;
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, ticks) {
            // ticks[ticks.length - 1] = tick cuối cùng (max)
            if (index === ticks.length - 1) {
              return 'Số phương tiện'; // ✅ thay vì số max
            }
            return value; // các tick khác giữ nguyên
          }
        }
      }
    }
  };

  public barPortType: 'bar' = 'bar';

  constructor() {}

  ngOnInit(): void {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      this.selectedVehicles.push(id);
    } else {
      this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
    }
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

  toggleStats() {
    this.showStats = !this.showStats;
  }
}
