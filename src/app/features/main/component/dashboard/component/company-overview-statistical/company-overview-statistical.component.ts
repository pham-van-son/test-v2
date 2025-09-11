import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Vehicle } from '../../../../../../core/interface';

@Component({
  selector: 'app-company-overview-statistical',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './company-overview-statistical.component.html',
  styleUrl: './company-overview-statistical.component.scss'
})
export class CompanyOverviewStatisticalComponent {
  @Input() vehicles: Vehicle[] = [];
  @Input() title: string = '';
  @Input() widgetId: string = '';
  @Output() toggleVisibility = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  // State
  widgetWidthCompany: 'large' | 'small' | 'medium' | 'auto' = 'auto';
  widgetWidthDropdownOpenCompany: boolean = false;
  showWidgetWidthSubmenuCompany: boolean = false;
  showCompanyStats: boolean = true;

  // ================== Tính toán số liệu ==================
  get totalVehicles(): number {
    return this.vehicles.length;
  }

  get totalVehiclesInStock(): number {
    return this.vehicles.filter((v) => v.hasGoods).length;
  }

  get totalVehiclesNotInStock(): number {
    return this.vehicles.filter((v) => !v.hasGoods).length;
  }

  get percentInStock(): number {
    return this.totalVehicles === 0 ? 0 : Math.round((this.totalVehiclesInStock / this.totalVehicles) * 100);
  }

  get percentNotInStock(): number {
    return this.totalVehicles === 0 ? 0 : Math.round((this.totalVehiclesNotInStock / this.totalVehicles) * 100);
  }

  // ================== Toggle / Refresh ==================
  toggleCompanyStats(): void {
    this.showCompanyStats = !this.showCompanyStats;
    this.toggleVisibility.emit();
  }

  refreshCompanyStats(): void {
    this.refresh.emit();
  }

  // ================== Dropdown width ==================
  openWidgetWidthDropdownCompany(): void {
    this.widgetWidthDropdownOpenCompany = true;
  }

  closeWidgetWidthDropdownCompany(): void {
    this.widgetWidthDropdownOpenCompany = false;
    this.showWidgetWidthSubmenuCompany = false;
  }

  setWidgetWidthCompany(width: 'large' | 'small' | 'medium' | 'auto'): void {
    this.widgetWidthCompany = width;
    this.closeWidgetWidthDropdownCompany();
  }

  getWidgetWidthClass(): string {
    switch (this.widgetWidthCompany) {
      case 'small' : return 'widget-width-small';
      case 'medium': return 'widget-width-medium';
      case 'large' : return 'widget-width-large';
      case 'auto'  : return 'widget-width-auto';
    }
  }
}
