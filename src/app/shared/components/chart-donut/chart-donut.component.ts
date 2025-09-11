import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { Vehicle } from '../../../core/interface';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart-donut',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgChartsModule],
  templateUrl: './chart-donut.component.html',
  styleUrls: ['./chart-donut.component.scss']
})
export class ChartDonutComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() filterStatus: string = '';
  @Input() vehicles: Vehicle[] = [];
  @Input() widgetId: string = '';
  @Output() refresh = new EventEmitter<void>();
  @Output() toggleVisibility = new EventEmitter<void>();
  @Output() widthChanged = new EventEmitter<{ id: string, width: 'auto'|'small'|'medium'|'large' }>();

  /* Khai báo để sử lý phần độ rộng */
  widgetWidth: 'auto' | 'small' | 'medium' | 'large' = 'auto';
  widgetWidthDropdownOpen = false;
  showWidgetWidthSubmenu = false;
  visible = true;

  @HostBinding('class.widget-width-small') hostClassSmall = false;
  @HostBinding('class.widget-width-medium') hostClassMedium = false;
  @HostBinding('class.widget-width-large') hostClassLarge = false;
  @HostBinding('class.widget-width-auto') hostClassAuto = true;

  @HostBinding('style.flex') hostFlex?: string | null;
  @HostBinding('style.maxWidth') hostMaxWidth?: string | null;

  /** Cấu hình cho chart donut */
  donutType: 'doughnut' = 'doughnut';
  donutData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [0, 0], backgroundColor: ['#509447', '#e2803c'] }]
  };
  donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle' }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => {
            const dataset = ctx.dataset as any;
            const value = ctx.raw as number;
            const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
            return `${value} ${this.i18n.instant('DASHBOARD.COMMON.VEHICLE_UNIT')} (${pct}%)`;
          }
        }
      }
    }
  };

  private i18n = inject(TranslateService);
  private el = inject(ElementRef<HTMLElement>);

  ngOnInit() {
    this.updateData();
    this.applyWidthToHost(this.widgetWidth);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicles'] || changes['filterStatus']) {
      this.updateData();
    }
  }

  /** Xử lý lấy data donut */
  updateData() {
    const filtered = this.filterStatus
      ? this.vehicles.filter(v => v.status === this.filterStatus)
      : this.vehicles;
    const inStock = filtered.filter(v => v.hasGoods).length;
    const notInStock = filtered.length - inStock;

    this.donutData = {
      labels: [
        this.i18n.instant('DASHBOARD.COMMON.COUNT_VEHICLE_IN_STOCK'),
        this.i18n.instant('DASHBOARD.COMMON.COUNT_VEHICLE_NOT_IN_STOCK')
      ],
      datasets: [{ data: [inStock, notInStock], backgroundColor: ['#509447', '#e2803c'] }]
    };
  }

  /** Reload lại chart donut */
  refreshChart() {
    this.updateData();
    this.refresh.emit();
  }

  /* Xử lý dropdown mở độ rộng và các tùy chỉnh độ rộng */ 
  toggleChart() {
    this.visible = !this.visible;
    this.toggleVisibility.emit();
  }

  openWidgetWidthDropdown() {
    this.widgetWidthDropdownOpen = true;
    this.showWidgetWidthSubmenu = false;
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

  private applyWidthToHost(width: 'auto' | 'small' | 'medium' | 'large') {
    this.hostClassSmall = this.hostClassMedium = this.hostClassLarge = this.hostClassAuto = false;
    this.hostFlex = this.hostMaxWidth = null;

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent) {
    if (!this.el.nativeElement.contains(ev.target as Node)) {
      this.closeWidgetWidthDropdown();
    }
  }
}
