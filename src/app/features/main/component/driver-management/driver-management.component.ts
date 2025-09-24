import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DriverService } from '../../../../core/service/driver.service';
import { HrmEmployee, BcaLicenseType } from '../../../../core/interface/driver.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './driver-management.component.html',
  styleUrl: './driver-management.component.scss'
})
export class DriverManagementComponent implements OnInit, OnDestroy {
  private driverService = inject(DriverService);
  private i18nService = inject(TranslateService);
  private subscriptions: Subscription = new Subscription();

  // Search & Filter Properties
  searchType: 'name' | 'license' = 'name';
  searchKeyword: string = '';
  isSearchTypeDropdownOpen: boolean = false;

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Close search type dropdown if clicking outside
    if (!target.closest('.search-section .dropdown') && !target.closest('.search-section .dropdown-menu')) {
      this.isSearchTypeDropdownOpen = false;
    }

    // Close driver dropdown if clicking outside
    if (!target.closest('.driver-dropdown')) {
      this.isDriverDropdownOpen = false;
    }

    // Close license type dropdown if clicking outside
    if (!target.closest('.license-type-dropdown')) {
      this.isLicenseTypeDropdownOpen = false;
    }

    // Close all table row license type dropdowns if clicking outside
    if (!target.closest('.license-type-dropdown')) {
      this.openLicenseTypeDropdowns = {};
    }
  }

  // Handle keydown for searchable dropdowns
  onDropdownKeydown(event: KeyboardEvent, type: 'driver' | 'license'): void {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      if (type === 'driver') {
        this.driverSearchTerm = this.driverSearchTerm.slice(0, -1);
        this.filterDrivers();
      } else if (type === 'license') {
        this.licenseTypeSearchTerm = this.licenseTypeSearchTerm.slice(0, -1);
        this.filterLicenseTypes();
      }
    } else if (event.key.length === 1) {
      // Regular character input
      if (type === 'driver') {
        this.driverSearchTerm += event.key;
        this.filterDrivers();
      } else if (type === 'license') {
        this.licenseTypeSearchTerm += event.key;
        this.filterLicenseTypes();
      }
    }
  }

  // Driver Selection
  drivers: HrmEmployee[] = [];
  filteredDrivers: HrmEmployee[] = [];
  selectedDrivers: HrmEmployee[] = [];
  driverSearchTerm: string = '';
  isDriverDropdownOpen: boolean = false;

  // License Type Selection
  licenseTypes: BcaLicenseType[] = [];
  filteredLicenseTypes: BcaLicenseType[] = [];
  selectedLicenseTypes: BcaLicenseType[] = [];
  licenseTypeSearchTerm: string = '';
  isLicenseTypeDropdownOpen: boolean = false;

  // Table Data
  currentPage: number = 1;
  pageSize: number = 20;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  totalCount: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;

  // All drivers data (if backend doesn't paginate)
  allDrivers: HrmEmployee[] = [];

  // UI State
  hasUnsavedChanges: boolean = false;
  isLoading: boolean = false;

  // Validation errors
  validationErrors: { [key: string]: { [field: string]: string; }; } = {};

  // Dropdown states for table rows
  openLicenseTypeDropdowns: { [key: string]: boolean; } = {};

  // Track which fields have been modified (changed from original data)
  modifiedFields: { [key: string]: { [field: string]: boolean; }; } = {};

  ngOnInit(): void {
    this.loadLicenseTypes();
    this.loadDrivers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Search Type Methods
  toggleSearchTypeDropdown(event: Event): void {
    event.stopPropagation();
    this.isSearchTypeDropdownOpen = !this.isSearchTypeDropdownOpen;
  }

  selectSearchType(type: 'name' | 'license'): void {
    this.searchType = type;
    this.isSearchTypeDropdownOpen = false;
  }

  clearSearch(): void {
    this.searchKeyword = '';
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadDrivers();
  }

  // Driver Dropdown Methods
  toggleDriverDropdown(): void {
    this.isDriverDropdownOpen = !this.isDriverDropdownOpen;
    if (this.isDriverDropdownOpen && this.drivers.length === 0) {
      this.loadAllDrivers();
    }
  }

  filterDrivers(): void {
    if (!this.driverSearchTerm) {
      this.filteredDrivers = [...this.drivers];
      return;
    }

    const term = this.driverSearchTerm.toLowerCase();
    this.filteredDrivers = this.drivers.filter(driver =>
      driver.displayName?.toLowerCase().includes(term) ||
      driver.driverLicense?.toLowerCase().includes(term)
    );
  }

  toggleAllDrivers(event: any): void {
    event.stopPropagation();
    const checked = event.target.checked;
    if (checked) {
      // Add all filtered drivers to selection (avoid duplicates)
      this.filteredDrivers.forEach(driver => {
        driver.checked = true;
        if (!this.selectedDrivers.some(d => d.pkEmployeeId === driver.pkEmployeeId)) {
          this.selectedDrivers.push(driver);
        }
      });
    } else {
      // Remove all filtered drivers from selection
      this.filteredDrivers.forEach(driver => {
        driver.checked = false;
      });
      this.selectedDrivers = this.selectedDrivers.filter(selected =>
        !this.filteredDrivers.some(filtered => filtered.pkEmployeeId === selected.pkEmployeeId)
      );
    }
  }

  toggleDriver(driver: HrmEmployee, event: any): void {
    event.stopPropagation();
    const checked = driver.checked;
    if (checked) {
      if (!this.selectedDrivers.some(d => d.pkEmployeeId === driver.pkEmployeeId)) {
        this.selectedDrivers.push(driver);
      }
    } else {
      this.selectedDrivers = this.selectedDrivers.filter(d => d.pkEmployeeId !== driver.pkEmployeeId);
    }
  }

  toggleDriverSelection(driver: HrmEmployee, event: any): void {
    const checked = event.target.checked;
    if (checked) {
      if (!this.selectedDrivers.some(d => d.pkEmployeeId === driver.pkEmployeeId)) {
        this.selectedDrivers.push(driver);
      }
    } else {
      this.selectedDrivers = this.selectedDrivers.filter(d => d.pkEmployeeId !== driver.pkEmployeeId);
    }
  }

  // License Type Dropdown Methods
  toggleLicenseTypeDropdown(): void {
    this.isLicenseTypeDropdownOpen = !this.isLicenseTypeDropdownOpen;
  }

  filterLicenseTypes(): void {
    if (!this.licenseTypeSearchTerm) {
      this.filteredLicenseTypes = [...this.licenseTypes];
      return;
    }

    const term = this.licenseTypeSearchTerm.toLowerCase();
    this.filteredLicenseTypes = this.licenseTypes.filter(licenseType =>
      licenseType.name?.toLowerCase().includes(term)
    );
  }

  toggleAllLicenseTypes(event: any): void {
    event.stopPropagation();
    const checked = event.target.checked;
    if (checked) {
      // Add all filtered license types to selection (avoid duplicates)
      this.filteredLicenseTypes.forEach(licenseType => {
        licenseType.checked = true;
        if (!this.selectedLicenseTypes.some(l => l.pkLicenseTypeId === licenseType.pkLicenseTypeId)) {
          this.selectedLicenseTypes.push(licenseType);
        }
      });
    } else {
      // Remove all filtered license types from selection
      this.filteredLicenseTypes.forEach(licenseType => {
        licenseType.checked = false;
      });
      this.selectedLicenseTypes = this.selectedLicenseTypes.filter(selected =>
        !this.filteredLicenseTypes.some(filtered => filtered.pkLicenseTypeId === selected.pkLicenseTypeId)
      );
    }
  }

  toggleLicenseType(licenseType: BcaLicenseType, event: any): void {
    event.stopPropagation();
    const checked = licenseType.checked;
    if (checked) {
      if (!this.selectedLicenseTypes.some(l => l.pkLicenseTypeId === licenseType.pkLicenseTypeId)) {
        this.selectedLicenseTypes.push(licenseType);
      }
    } else {
      this.selectedLicenseTypes = this.selectedLicenseTypes.filter(l => l.pkLicenseTypeId !== licenseType.pkLicenseTypeId);
    }
  }

  toggleLicenseTypeSelection(licenseType: BcaLicenseType, event: any): void {
    const checked = event.target.checked;
    if (checked) {
      if (!this.selectedLicenseTypes.some(l => l.pkLicenseTypeId === licenseType.pkLicenseTypeId)) {
        this.selectedLicenseTypes.push(licenseType);
      }
    } else {
      this.selectedLicenseTypes = this.selectedLicenseTypes.filter(l => l.pkLicenseTypeId !== licenseType.pkLicenseTypeId);
    }
  }

  // Helper methods for template
  isDriverSelected(driver: HrmEmployee): boolean {
    return this.selectedDrivers.some(d => d.pkEmployeeId === driver.pkEmployeeId);
  }

  isLicenseTypeSelected(licenseType: BcaLicenseType): boolean {
    return this.selectedLicenseTypes.some(l => l.pkLicenseTypeId === licenseType.pkLicenseTypeId);
  }

  isAllDriversSelected(): boolean {
    if (this.filteredDrivers.length === 0) return false;
    return this.filteredDrivers.every(driver => driver.checked);
  }

  isAllLicenseTypesSelected(): boolean {
    if (this.filteredLicenseTypes.length === 0) return false;
    return this.filteredLicenseTypes.every(licenseType => licenseType.checked);
  }

  // Table Methods
  markAsEdited(driver: HrmEmployee): void {
    driver.isEditing = true;
    this.hasUnsavedChanges = true;
    this.validateDriver(driver);
  }

  // Track field modifications
  markFieldAsModified(driver: HrmEmployee, fieldName: string): void {
    const driverId = driver.pkEmployeeId?.toString() || '';
    if (!this.modifiedFields[driverId]) {
      this.modifiedFields[driverId] = {};
    }

    // Mark this field as modified
    this.modifiedFields[driverId][fieldName] = true;
    this.markAsEdited(driver);
  }

  isFieldModified(driver: HrmEmployee, fieldName: string): boolean {
    const driverId = driver.pkEmployeeId?.toString() || '';
    return !!(this.modifiedFields[driverId] && this.modifiedFields[driverId][fieldName]);
  }

  // Validation methods
  validateDriver(driver: HrmEmployee): void {
    const errors: { [field: string]: string; } = {};

    // Simple validation - check if field has data
    if (!driver.displayName || driver.displayName.trim() === '') {
      errors['displayName'] = 'Họ và tên không được để trống';
    }

    if (!driver.driverLicense || driver.driverLicense.trim() === '') {
      errors['driverLicense'] = 'Số GPLX không được để trống';
    }

    if (!driver.issueLicenseDate) {
      errors['issueLicenseDate'] = 'Ngày cấp không được để trống';
    }

    if (!driver.expireLicenseDate) {
      errors['expireLicenseDate'] = 'Ngày hết hạn không được để trống';
    }

    if (!driver.issueLicensePlace || driver.issueLicensePlace.trim() === '') {
      errors['issueLicensePlace'] = 'Nơi cấp không được để trống';
    }

    if (!driver.licenseType) {
      errors['licenseType'] = 'Loại bằng không được để trống';
    }

    // Store errors for this driver
    this.validationErrors[driver.pkEmployeeId?.toString() || ''] = errors;
  }

  isFieldValid(driver: HrmEmployee, fieldName: string): boolean {
    // Simple validation - check if field has data
    let isValid = false;

    switch (fieldName) {
      case 'displayName':
        isValid = !!(driver.displayName && driver.displayName.trim() !== '');
        break;
      case 'driverLicense':
        isValid = !!(driver.driverLicense && driver.driverLicense.trim() !== '');
        break;
      case 'issueLicenseDate':
        isValid = !!driver.issueLicenseDate;
        break;
      case 'expireLicenseDate':
        isValid = !!driver.expireLicenseDate;
        break;
      case 'issueLicensePlace':
        isValid = !!(driver.issueLicensePlace && driver.issueLicensePlace.trim() !== '');
        break;
      case 'licenseType':
        isValid = !!driver.licenseType;
        break;
      default:
        isValid = true;
    }

    return isValid;
  }

  getFieldError(driver: HrmEmployee, fieldName: string): string {
    // Check if field is valid first
    const isValid = this.isFieldValid(driver, fieldName);

    if (isValid) {
      return '';
    }

    // Return specific error messages for invalid fields
    switch (fieldName) {
      case 'displayName':
        return 'Họ và tên không được để trống';
      case 'driverLicense':
        return 'Số GPLX không được để trống';
      case 'issueLicenseDate':
        return 'Ngày cấp không được để trống';
      case 'expireLicenseDate':
        return 'Ngày hết hạn không được để trống';
      case 'issueLicensePlace':
        return 'Nơi cấp không được để trống';
      case 'licenseType':
        return 'Loại bằng không được để trống';
      default:
        return '';
    }
  }

  // Table row license type dropdown methods
  toggleTableLicenseTypeDropdown(driver: HrmEmployee, event: Event): void {
    event.stopPropagation();
    const driverId = driver.pkEmployeeId?.toString() || '';
    this.openLicenseTypeDropdowns[driverId] = !this.openLicenseTypeDropdowns[driverId];
  }

  isTableLicenseTypeDropdownOpen(driver: HrmEmployee): boolean {
    const driverId = driver.pkEmployeeId?.toString() || '';
    return !!this.openLicenseTypeDropdowns[driverId];
  }

  selectTableLicenseType(driver: HrmEmployee, licenseType: BcaLicenseType, event: Event): void {
    event.stopPropagation();

    // Create unique mapping from code to number since all pkLicenseTypeId are 0
    const codeToNumberMap: { [key: string]: number; } = {
      'A1': 1,
      'A2': 2,
      'A3': 3,
      'A4': 4,
      'B': 5
    };

    driver.licenseType = codeToNumberMap[licenseType.code] || 0;

    // Mark field as modified
    this.markFieldAsModified(driver, 'licenseType');

    // Force validation update
    this.validateDriver(driver);

    this.markAsEdited(driver);
    this.closeTableLicenseTypeDropdown(driver);
  }

  closeTableLicenseTypeDropdown(driver: HrmEmployee): void {
    const driverId = driver.pkEmployeeId?.toString() || '';
    this.openLicenseTypeDropdowns[driverId] = false;
  }

  getSelectedLicenseTypeName(licenseTypeNumber: any): string {
    // Return empty string for null/undefined/empty values
    if (licenseTypeNumber === null || licenseTypeNumber === undefined || licenseTypeNumber === '') {
      return '';
    }

    // Create reverse mapping from number to code
    const numberToCodeMap: { [key: number]: string; } = {
      1: 'A1',
      2: 'A2',
      3: 'A3',
      4: 'A4',
      5: 'B'
    };

    const code = numberToCodeMap[licenseTypeNumber];
    if (!code) {
      return '';
    }

    // Find license type by code
    const licenseType = this.licenseTypes.find(lt => lt.code === code);

    return licenseType ? licenseType.name : '';
  }

  saveChanges(): void {
    const editedDrivers = this.drivers.filter(d => d.isEditing);
    if (editedDrivers.length === 0) return;

    // TODO: Implement save logic
    console.log('Saving changes:', editedDrivers);

    // Reset editing state
    editedDrivers.forEach(d => d.isEditing = false);
    this.hasUnsavedChanges = false;
  }

  cancelChanges(): void {
    if (confirm('Bạn có chắc chắn muốn hủy bỏ các thay đổi chưa lưu?')) {
      this.loadDrivers(); // Reload data
      this.hasUnsavedChanges = false;
    }
  }

  deleteDriver(driver: HrmEmployee): void {
    if (confirm('Bạn có chắc chắn muốn xóa lái xe này?')) {
      // TODO: Implement delete logic
      console.log('Deleting driver:', driver);
    }
  }

  // Pagination Methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDrivers();
    }
  }

  goToPageFromPagination(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  onPageSizeChange(): void {
    this.pageSize = Number(this.pageSize);
    this.currentPage = 1;
    this.loadDrivers();
  }

  getPageNumbers(): (number | string)[] {
    const totalPages = this.totalPages || 1;
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng số trang > 5, hiển thị động theo trang hiện tại
      if (this.currentPage <= 3) {
        // Trang hiện tại ở đầu: 1 2 3 4 5 ...
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (this.currentPage >= totalPages - 2) {
        // Trang hiện tại ở cuối: ... (last-4) (last-3) (last-2) (last-1) last
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Trang hiện tại ở giữa: ... (current-2) (current-1) current (current+1) (current+2) ...
        pages.push('...');
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
      }
    }

    return pages;
  }

  // Data Loading Methods
  private loadDrivers(): void {
    this.isLoading = true;
    const searchTerm = this.searchType === 'name' ? this.searchKeyword : '';
    const driverLicense = this.searchType === 'license' ? this.searchKeyword : '';

    this.subscriptions.add(
      this.driverService.listDrivers(this.currentPage, this.pageSize, searchTerm, driverLicense).subscribe({
        next: (response) => {
          if (response.statusCode === 200 && response.data) {
            this.drivers = response.data.items || [];
            this.totalCount = response.data.totalCount || 0;
            this.totalPages = response.data.totalPage || 1;
            this.startIndex = this.totalCount === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
            this.endIndex = Math.min(this.currentPage * this.pageSize, this.totalCount);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading drivers:', error);
          this.isLoading = false;
        }
      })
    );
  }

  private loadAllDrivers(): void {
    // Load all drivers for dropdown selection
    this.subscriptions.add(
      this.driverService.listDrivers(1, 1000, '', '').subscribe({
        next: (response) => {
          if (response.statusCode === 200 && response.data) {
            this.drivers = (response.data.items || []).map(driver => ({
              ...driver,
              checked: false
            }));
            this.filteredDrivers = [...this.drivers];
          }
        },
        error: (error) => {
          console.error('Error loading all drivers:', error);
        }
      })
    );
  }

  private loadLicenseTypes(): void {
    this.subscriptions.add(
      this.driverService.listBcaLicenseType().subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            const data = Array.isArray(response.data) ? response.data : [response.data];
            this.licenseTypes = data.map(licenseType => ({
              ...licenseType,
              checked: false
            }));
            this.filteredLicenseTypes = [...this.licenseTypes];
          }
        },
        error: (error) => {
          console.error('Error loading license types:', error);
        }
      })
    );
  }

  // Action Methods
  updateGridData(): void {
    this.loadDrivers();
  }

  refreshData(): void {
    this.loadDrivers();
  }

  exportToExcel(): void {
    // TODO: Implement export logic
    console.log('Exporting to Excel');
  }

  toggleSelectAllChanges(event: any): void {
    // TODO: Implement select all changes logic
    console.log('Toggle select all changes:', event.target.checked);
  }
}
