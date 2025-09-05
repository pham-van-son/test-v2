import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { Vehicle } from '../../../core/interface';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    TranslateModule,
  ],
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() filterStatus: string = '';
  @Input() vehicles: Vehicle[] = [];
  @Input() widgetId: string = '';
  @Input() barColor: string = '#dc143c';
  @Output() refresh = new EventEmitter<void>();
  @Output() toggleVisibility = new EventEmitter<void>();
  @Output() widthChanged = new EventEmitter<{ id: string, width: 'auto'|'small'|'medium'|'large' }>();
  @ViewChild('chartContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  /** trạng thái chiều rộng độ rộng */
  widgetWidth: 'auto' | 'small' | 'medium' | 'large' = 'auto';
  widgetWidthDropdownOpen = false;
  showWidgetWidthSubmenu = false;
  visible = true;

  /** Liên kết tới app-chart-bar để sử dụng tính năng tùy chỉnh độ rộng */
  @HostBinding('class.widget-width-small') hostClassSmall = false;
  @HostBinding('class.widget-width-medium') hostClassMedium = false;
  @HostBinding('class.widget-width-large') hostClassLarge = false;
  @HostBinding('class.widget-width-auto') hostClassAuto = true;

  /** ghi đè kiểu nội tuyến (những kiểu này sẽ ghi đè Bootstrap col-*) */
  @HostBinding('style.flex') hostFlex?: string | null;
  @HostBinding('style.maxWidth') hostMaxWidth?: string | null;

  /** Cấu hình cho chart bar xử lý trục x,y, các cột label ... */
  barType: 'bar' = 'bar';
  barLabels: string[] = [];
  barData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: this.barColor, label: '', barPercentage: 0.9, categoryPercentage: 0.8 }]
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: false,
    layout: { padding: { top: 20, left: 20, right: 20 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'end',
        offset: -2,
        font: {
          size: 12,
        },
        formatter: (value) => value
      }
    },
    scales: {
      x: {
        offset: true,
        ticks: {
          autoSkip: false,
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          minRotation: window.innerWidth < 768 ? 45 : 0,
          font: { size: 12 },
          callback: function (value) {
            const label = this.getLabelForValue(Number(value));
            if (typeof label !== 'string') return label;

            const maxLen = 15; // tối đa 13 ký tự mỗi dòng
            const words = label.split(' ');
            const lines: string[] = [];
            let currentLine = '';

            words.forEach(word => {
              if ((currentLine + ' ' + word).trim().length <= maxLen) {
                currentLine = (currentLine + ' ' + word).trim();
              } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word; // bắt đầu dòng mới
              }
            });
            if (currentLine) lines.push(currentLine);

            return lines; // Chart.js sẽ render mỗi phần tử trong array thành một dòng
          }
        },
        grid: { offset: true }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
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

  private i18nService = inject(TranslateService);

  ngOnInit() {
    this.updateData();
    this.applyWidthToHost(this.widgetWidth);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicles'] || changes['filterStatus']) {
      this.updateData();
    }
  }

  ngAfterViewInit() {
    this.updateData();
  }

  /** sau khi nhận được thay đổi độ rộng ở auto  */
  @HostListener('window:resize')
  onResize() {
    setTimeout(() => window.dispatchEvent(new CustomEvent('adjustAutoWidths')), 0);
  }

  /** Xử láy nhận data và xử lý các cột data(khoảng cách các cột và chiều rộng của cột) */
  updateData() {
    const filtered = this.vehicles.filter(v => v.status === this.filterStatus);
    const labels = Array.from(new Set(filtered.map(v => v.location)));
    const counts = labels.map(label => filtered.filter(v => v.location === label).length);
    this.barLabels = labels;

    const barWidth = 20;
    const gap = 50;
    const slot = barWidth + gap;

    this.barData = {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: this.barColor,
        label: this.i18nService.instant('DASHBOARD.COMMON.COUNT_VEHICLE'),
        categoryPercentage: 1,
        barPercentage: barWidth / slot,
      }]
    };
  }

  /** Xử lý reload lại chart */
  refreshChart() {
    this.updateData();
    this.refresh.emit();
  }

  /** Xử lý dropdown độ rộng */
  toggleChart() {
    this.visible = !this.visible;
    this.toggleVisibility.emit();
  }

  openWidgetWidthDropdown() {
    this.widgetWidthDropdownOpen = true;
  }

  closeWidgetWidthDropdown() {
    this.widgetWidthDropdownOpen = false;
    this.showWidgetWidthSubmenu = false;
  }

  setWidgetWidth(width: 'auto' | 'small' | 'medium' | 'large') {
    this.widgetWidth = width;
    this.closeWidgetWidthDropdown();
    this.applyWidthToHost(width);
    this.widthChanged.emit({ id: this.widgetId || '', width });
    
    setTimeout(() => window.dispatchEvent(new CustomEvent('adjustAutoWidths')), 0);

    this.refreshChart();
  }

  /** áp dụng các lớp / kiểu nội tuyến cho phần tử lưu trữ */
  private applyWidthToHost(width: 'auto' | 'small' | 'medium' | 'large') {
    this.hostClassSmall = this.hostClassMedium = this.hostClassLarge = this.hostClassAuto = false;

    if (width === 'small') {
      this.hostClassSmall = true;
      this.hostFlex = '0 0 33.3333%';
      this.hostMaxWidth = '33.3333%';
    } else if (width === 'medium') {
      this.hostClassMedium = true;
      this.hostFlex = '0 0 66.6666%';
      this.hostMaxWidth = '66.6666%';
    } else if (width === 'large') {
      this.hostClassLarge = true;
      this.hostFlex = '0 0 100%';
      this.hostMaxWidth = '100%';
    } else {
      this.hostClassAuto = true;
    }
  }

  getWidgetWidthClass() {
    switch (this.widgetWidth) {
      case 'small': return 'widget-width-small';
      case 'medium': return 'widget-width-medium';
      case 'large': return 'widget-width-large';
      default: return 'widget-width-auto';
    }
  }

  /** Xử lý khi nào hiện scroll */
  shouldScroll(): boolean {
    return this.barLabels.length > 10;
 }

 /** sử lý tính cột chiều rộng của canva */
  getCanvasWidth(): string {
    const barWidth = 10;
    const gap = 100;
    const slot = barWidth + gap;
    const extraPadding = 40;
    const total = this.barLabels.length * slot + extraPadding;
    const minWidth = 10;
    return `${Math.max(total, minWidth)}px`;
  }
}
