import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Vehicle } from '../../../../core/interface/vehicle.interface'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private i18nService = inject(TranslateService);

  selectedVehicles: number[] = [];
  isDropdownOpen = false;

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
      return v ? v.name : 'Chọn xe...';
    }
    return `${this.selectedVehicles.length} xe đã chọn`;
  }
}
