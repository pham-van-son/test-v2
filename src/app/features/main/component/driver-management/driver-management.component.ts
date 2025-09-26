import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DriverService } from '../../../../core/service/driver.service';
import { HrmEmployee, BcaLicenseType, ExportConfig, UpdateDriversRequest } from '../../../../core/interface/driver.interface';
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
  /* props */
  private driverService = inject(DriverService);
  private i18nService = inject(TranslateService);
  private subscriptions: Subscription = new Subscription();
  searchType: 'name' | 'license' = 'name';
  searchKeyword: string = '';
  isSearchTypeDropdownOpen: boolean = false;
  drivers: HrmEmployee[] = [];
  filteredDrivers: HrmEmployee[] = [];
  selectedDrivers: HrmEmployee[] = [];
  driverSearchTerm: string = '';
  isDriverDropdownOpen: boolean = false;
  allDriversForDropdown: HrmEmployee[] = [];
  filteredDriversForDropdown: HrmEmployee[] = [];
  licenseTypes: BcaLicenseType[] = [];
  filteredLicenseTypes: BcaLicenseType[] = [];
  selectedLicenseTypes: BcaLicenseType[] = [];
  licenseTypeSearchTerm: string = '';
  isLicenseTypeDropdownOpen: boolean = false;
  currentPage: number = 1;
  pageSize: number = 20;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  totalCount: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  allDrivers: HrmEmployee[] = [];
  hasUnsavedChanges: boolean = false;
  isLoading: boolean = false;
  validationErrors: { [key: string]: { [field: string]: string; }; } = {};
  modifiedFields: { [driverId: string]: { [fieldName: string]: boolean; }; } = {};
  originalValues: { [driverId: string]: HrmEmployee; } = {};
  openLicenseTypeDropdowns: { [key: string]: boolean; } = {};

  /* ngOnInit */
  /**
   * Hàm khởi tạo component, load danh sách loại bằng và danh sách lái xe.
   */
  ngOnInit(): void {
    this.loadLicenseTypes();
    this.loadDrivers();
  }

  /* ngOnDestroy */
  /**
   * Hàm hủy component, giải phóng các subscription.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /* public method */
  /**
   * Đóng các dropdown khi click ra ngoài.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-section .dropdown') && !target.closest('.search-section .dropdown-menu')) {
      this.isSearchTypeDropdownOpen = false;
    }
    if (!target.closest('.driver-dropdown')) {
      this.isDriverDropdownOpen = false;
    }
    if (!target.closest('.license-type-dropdown')) {
      this.isLicenseTypeDropdownOpen = false;
    }
    if (!target.closest('.license-type-dropdown')) {
      this.openLicenseTypeDropdowns = {};
    }
  }

  /**
   * Xử lý sự kiện nhập phím trong dropdown tìm kiếm lái xe/loại bằng.
   */
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
      if (type === 'driver') {
        this.driverSearchTerm += event.key;
        this.filterDrivers();
      } else if (type === 'license') {
        this.licenseTypeSearchTerm += event.key;
        this.filterLicenseTypes();
      }
    }
  }

  /**
   * Hiện/ẩn dropdown chọn loại tìm kiếm (tên/GPLX).
   */
  toggleSearchTypeDropdown(event: Event): void {
    event.stopPropagation();
    this.isSearchTypeDropdownOpen = !this.isSearchTypeDropdownOpen;
  }

  /**
   * Chọn loại tìm kiếm (tên hoặc GPLX).
   */
  selectSearchType(type: 'name' | 'license'): void {
    this.searchType = type;
    this.isSearchTypeDropdownOpen = false;
  }

  /**
   * Xóa từ khóa tìm kiếm.
   */
  clearSearch(): void {
    this.searchKeyword = '';
  }

  /**
   * Thực hiện tìm kiếm lái xe theo điều kiện đã chọn.
   */
  onSearch(): void {
    const maxDrivers = 50;
    const maxLicenseTypes = 10;
    if (this.selectedDrivers.length > maxDrivers) {
      return;
    }
    if (this.selectedLicenseTypes.length > maxLicenseTypes) {
      return;
    }
    this.currentPage = 1;
    this.loadDrivers();
  }

  /**
   * Hiện/ẩn dropdown chọn lái xe.
   */
  toggleDriverDropdown(): void {
    this.isDriverDropdownOpen = !this.isDriverDropdownOpen;
    if (this.isDriverDropdownOpen && this.allDriversForDropdown.length === 0) {
      this.loadAllDrivers();
    }
  }

  /**
   * Lọc danh sách lái xe theo từ khóa tìm kiếm.
   */
  filterDrivers(): void {
    if (!this.driverSearchTerm) {
      this.filteredDriversForDropdown = [...this.allDriversForDropdown];
      return;
    }
    const term = this.driverSearchTerm.toLowerCase();
    this.filteredDriversForDropdown = this.allDriversForDropdown.filter(driver =>
      driver.displayName?.toLowerCase().includes(term) ||
      driver.driverLicense?.toLowerCase().includes(term)
    );
  }

  /**
   * Chọn/bỏ chọn tất cả lái xe trong dropdown.
   */
  toggleAllDrivers(event: any): void {
    event.stopPropagation();
    const checked = event.target.checked;
    if (checked) {
      const maxDrivers = 50;
      const driversToSelect = this.filteredDriversForDropdown.slice(0, maxDrivers);
      driversToSelect.forEach(driver => {
        driver.checked = true;
        if (!this.selectedDrivers.some(d => d.pkEmployeeId === driver.pkEmployeeId)) {
          this.selectedDrivers.push(driver);
        }
      });
    } else {
      this.filteredDriversForDropdown.forEach(driver => {
        driver.checked = false;
      });
      this.selectedDrivers = this.selectedDrivers.filter(selected =>
        !this.filteredDriversForDropdown.some(filtered => filtered.pkEmployeeId === selected.pkEmployeeId)
      );
    }
  }

  /**
   * Chọn/bỏ chọn một lái xe trong dropdown.
   */
  toggleDriver(driver: HrmEmployee, checked: boolean): void {
    if (checked) {
      const maxDrivers = 50;
      if (this.selectedDrivers.length >= maxDrivers) {
        driver.checked = false;
        return;
      }
      if (!this.selectedDrivers.some(d => d.pkEmployeeId === driver.pkEmployeeId)) {
        this.selectedDrivers.push(driver);
      }
    } else {
      this.selectedDrivers = this.selectedDrivers.filter(d => d.pkEmployeeId !== driver.pkEmployeeId);
    }
  }

  /**
   * Chọn/bỏ chọn một lái xe từ checkbox trong dropdown.
   */
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

  /**
   * Hiện/ẩn dropdown chọn loại bằng.
   */
  toggleLicenseTypeDropdown(): void {
    this.isLicenseTypeDropdownOpen = !this.isLicenseTypeDropdownOpen;
  }

  /**
   * Lọc danh sách loại bằng theo từ khóa tìm kiếm.
   */
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

  /**
   * Chọn/bỏ chọn tất cả loại bằng trong dropdown.
   */
  toggleAllLicenseTypes(event: any): void {
    event.stopPropagation();
    const checked = event.target.checked;
    if (checked) {
      this.filteredLicenseTypes.forEach(licenseType => {
        licenseType.checked = true;
        if (!this.selectedLicenseTypes.some(l => l.code === licenseType.code)) {
          this.selectedLicenseTypes.push(licenseType);
        }
      });
    } else {
      this.filteredLicenseTypes.forEach(licenseType => {
        licenseType.checked = false;
      });
      this.selectedLicenseTypes = this.selectedLicenseTypes.filter(selected =>
        !this.filteredLicenseTypes.some(filtered => filtered.code === selected.code)
      );
    }
  }

  /**
   * Chọn/bỏ chọn một loại bằng trong dropdown.
   */
  toggleLicenseType(licenseType: BcaLicenseType, checked: boolean): void {
    if (checked) {
      const maxLicenseTypes = 10;
      if (this.selectedLicenseTypes.length >= maxLicenseTypes) {
        licenseType.checked = false;
        return;
      }
      if (!this.selectedLicenseTypes.some(l => l.code === licenseType.code)) {
        this.selectedLicenseTypes.push(licenseType);
      }
    } else {
      this.selectedLicenseTypes = this.selectedLicenseTypes.filter(l => l.code !== licenseType.code);
    }
  }

  /**
   * Chọn/bỏ chọn một loại bằng từ checkbox trong dropdown.
   */
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

  /**
   * Kiểm tra lái xe đã được chọn chưa.
   */
  isDriverSelected(driver: HrmEmployee): boolean {
    return this.selectedDrivers.some(d => d.pkEmployeeId === driver.pkEmployeeId);
  }

  /**
   * Kiểm tra loại bằng đã được chọn chưa.
   */
  isLicenseTypeSelected(licenseType: BcaLicenseType): boolean {
    return this.selectedLicenseTypes.some(l => l.pkLicenseTypeId === licenseType.pkLicenseTypeId);
  }

  /**
   * Kiểm tra đã chọn tất cả lái xe chưa.
   */
  isAllDriversSelected(): boolean {
    if (this.filteredDriversForDropdown.length === 0) return false;
    return this.filteredDriversForDropdown.every(driver => driver.checked);
  }

  /**
   * Kiểm tra đã chọn tất cả loại bằng chưa.
   */
  isAllLicenseTypesSelected(): boolean {
    if (this.filteredLicenseTypes.length === 0) return false;
    return this.filteredLicenseTypes.every(licenseType => licenseType.checked);
  }

  /**
   * Đánh dấu lái xe đã chỉnh sửa.
   */
  markAsEdited(driver: HrmEmployee): void {
    driver.isEditing = true;
    this.hasUnsavedChanges = true;
    this.validateDriver(driver);
  }

  /**
   * Đánh dấu trường dữ liệu của lái xe đã bị thay đổi.
   */
  markFieldAsModified(driver: HrmEmployee, fieldName: string, newValue: any): void {
    const driverId = driver.pkEmployeeId?.toString() || '';
    if (!this.modifiedFields[driverId]) {
      this.modifiedFields[driverId] = {};
    }
    const originalValue = this.getOriginalValue(driver, fieldName);
    const normalizedNewValue = this.normalizeValue(newValue);
    const normalizedOriginalValue = this.normalizeValue(originalValue);
    if (normalizedNewValue !== normalizedOriginalValue) {
      this.modifiedFields[driverId][fieldName] = true;
      this.markAsEdited(driver);
    } else {
      this.modifiedFields[driverId][fieldName] = false;
      const hasOtherModifications = Object.values(this.modifiedFields[driverId]).some(modified => modified);
      if (!hasOtherModifications) {
        driver.isEditing = false;
        this.hasUnsavedChanges = false;
      }
    }
  }

  /**
   * Kiểm tra trường dữ liệu của lái xe đã bị thay đổi chưa.
   */
  isFieldModified(driver: HrmEmployee, fieldName: string): boolean {
    const driverId = driver.pkEmployeeId?.toString() || '';
    return !!(this.modifiedFields[driverId] && this.modifiedFields[driverId][fieldName]);
  }

  /**
   * Kiểm tra và lưu lỗi validate cho lái xe.
   */
  validateDriver(driver: HrmEmployee): void {
    const errors: { [field: string]: string; } = {};
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
    this.validationErrors[driver.pkEmployeeId?.toString() || ''] = errors;
  }

  /**
   * Kiểm tra tính hợp lệ của một trường dữ liệu lái xe.
   */
  isFieldValid(driver: HrmEmployee, fieldName: string): boolean {
    let isValid = false;
    switch (fieldName) {
      case 'displayName':
        if (!driver.displayName || driver.displayName.trim() === '') {
          isValid = false;
        } else {
          const trimmed = driver.displayName.trim();
          isValid = !trimmed.includes('<') && !trimmed.includes('>') && trimmed.length <= 100;
        }
        break;
      case 'mobile':
        if (!driver.mobile || driver.mobile.trim() === '') {
          isValid = false;
        } else {
          const phoneRegex = /^[0-9]{10,11}$/;
          isValid = phoneRegex.test(driver.mobile.trim());
        }
        break;
      case 'driverLicense':
        if (!driver.driverLicense || driver.driverLicense.trim() === '') {
          isValid = false;
        } else {
          isValid = driver.driverLicense.trim().length <= 20;
        }
        break;
      case 'issueLicenseDate':
        if (!driver.issueLicenseDate) {
          isValid = false;
        } else {
          let issueDate: Date;
          if (driver.issueLicenseDate instanceof Date) {
            issueDate = driver.issueLicenseDate;
          } else {
            issueDate = new Date(driver.issueLicenseDate);
          }
          if (isNaN(issueDate.getTime())) {
            isValid = false;
          } else {
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            isValid = issueDate <= today;
          }
        }
        break;
      case 'expireLicenseDate':
        if (!driver.expireLicenseDate) {
          isValid = false;
        } else {
          let expireDate: Date;
          if (driver.expireLicenseDate instanceof Date) {
            expireDate = driver.expireLicenseDate;
          } else {
            expireDate = new Date(driver.expireLicenseDate);
          }
          if (isNaN(expireDate.getTime())) {
            isValid = false;
          } else {
            if (driver.issueLicenseDate) {
              let issueDate: Date;
              if (driver.issueLicenseDate instanceof Date) {
                issueDate = driver.issueLicenseDate;
              } else {
                issueDate = new Date(driver.issueLicenseDate);
              }
              if (!isNaN(issueDate.getTime())) {
                isValid = expireDate > issueDate;
              } else {
                isValid = true;
              }
            } else {
              isValid = true;
            }
          }
        }
        break;
      case 'issueLicensePlace':
        if (!driver.issueLicensePlace || driver.issueLicensePlace.trim() === '') {
          isValid = false;
        } else {
          const trimmed = driver.issueLicensePlace.trim();
          isValid = !trimmed.includes('<') && !trimmed.includes('>') && trimmed.length <= 100;
        }
        break;
      case 'licenseType':
        isValid = !!driver.licenseType && driver.licenseType !== 0;
        break;
      default:
        isValid = true;
    }
    return isValid;
  }

  /**
   * Lấy thông báo lỗi cho trường dữ liệu lái xe.
   */
  getFieldError(driver: HrmEmployee, fieldName: string): string {
    const isValid = this.isFieldValid(driver, fieldName);
    if (isValid) {
      return '';
    }
    switch (fieldName) {
      case 'displayName':
        if (!driver.displayName || driver.displayName.trim() === '') {
          return 'Họ và tên không được để trống';
        } else if (driver.displayName.includes('<') || driver.displayName.includes('>')) {
          return 'Họ và tên không được chứa ký tự < >';
        } else {
          return 'Họ và tên quá dài (tối đa 100 ký tự)';
        }
      case 'mobile':
        if (!driver.mobile || driver.mobile.trim() === '') {
          return 'Số điện thoại không được để trống';
        } else {
          return 'Số điện thoại phải có 10-11 chữ số';
        }
      case 'driverLicense':
        if (!driver.driverLicense || driver.driverLicense.trim() === '') {
          return 'Số GPLX không được để trống';
        } else {
          return 'Số GPLX quá dài (tối đa 20 ký tự)';
        }
      case 'issueLicenseDate':
        if (!driver.issueLicenseDate) {
          return 'Ngày cấp không được để trống';
        } else {
          return 'Ngày cấp phải <= ngày hiện tại';
        }
      case 'expireLicenseDate':
        if (!driver.expireLicenseDate) {
          return 'Ngày hết hạn không được để trống';
        } else {
          return 'Ngày hết hạn phải > ngày cấp';
        }
      case 'issueLicensePlace':
        if (!driver.issueLicensePlace || driver.issueLicensePlace.trim() === '') {
          return 'Nơi cấp không được để trống';
        } else if (driver.issueLicensePlace.includes('<') || driver.issueLicensePlace.includes('>')) {
          return 'Nơi cấp không được chứa ký tự < >';
        } else {
          return 'Nơi cấp quá dài (tối đa 100 ký tự)';
        }
      case 'licenseType':
        return 'Vui lòng chọn loại bằng';
      default:
        return '';
    }
  }

  /**
   * Chọn loại bằng cho lái xe trong bảng.
   */
  selectTableLicenseType(driver: HrmEmployee, value: string): void {
    const newValue = parseInt(value) || 0;
    driver.licenseType = newValue;
    this.markFieldAsModified(driver, 'licenseType', newValue);
    this.validateDriver(driver);
    this.markAsEdited(driver);
  }

  /**
   * Lấy giá trị số của loại bằng từ code.
   */
  getLicenseTypeValue(licenseType: BcaLicenseType): number {
    const codeToNumberMap: { [key: string]: number; } = {
      'A1': 1, 'A2': 2, 'A3': 3, 'A4': 4, 'B': 5, 'B.01': 6, 'B.02': 7, 'B.03': 8, 'B.04': 9, 'B.05': 10,
      'B1': 11, 'B11': 12, 'B2': 13, 'BE': 14, 'C': 15, 'C1': 16, 'C1E': 17, 'C2': 18, 'CE': 19, 'D': 20,
      'D1': 21, 'D1E': 22, 'D2': 23, 'E': 24, 'F': 25, 'FB2': 26, 'FC': 27, 'FD': 28, 'FE': 29
    };
    return codeToNumberMap[licenseType.code] || 0;
  }

  /**
   * Lấy giá trị hiển thị cho select loại bằng.
   */
  getSelectValue(licenseType: any): string {
    if (!licenseType || licenseType === 0) {
      return '';
    }
    return licenseType.toString();
  }

  /**
   * Lấy giá trị ngày ở dạng yyyy-MM-dd từ chuỗi hoặc Date.
   */
  getDateValue(dateValue: string | Date | null | undefined): string {
    if (!dateValue) return '';
    try {
      let date: Date;
      if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        date = new Date(dateValue);
      }
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error parsing date:', dateValue, error);
      return '';
    }
  }

  /**
   * Chuyển ngày yyyy-MM-dd sang ISO string.
   */
  setDateValue(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString + 'T00:00:00');
      if (isNaN(date.getTime())) return '';
      return date.toISOString();
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '';
    }
  }

  /**
   * Xử lý khi thay đổi ngày cho lái xe.
   */
  onDateChange(driver: HrmEmployee, field: string, dateString: string): void {
    let isoString: string | null = null;
    if (dateString && dateString.trim() !== '') {
      isoString = this.setDateValue(dateString);
    }
    (driver as any)[field] = isoString;
    this.markFieldAsModified(driver, field, isoString);
    this.validateDriver(driver);
    this.markAsEdited(driver);
  }

  /**
   * Lấy tên loại bằng từ giá trị số.
   */
  getSelectedLicenseTypeName(licenseTypeNumber: any): string {
    if (licenseTypeNumber === null || licenseTypeNumber === undefined || licenseTypeNumber === '') {
      return '';
    }
    const numberToCodeMap: { [key: number]: string; } = {
      1: 'A1', 2: 'A2', 3: 'A3', 4: 'A4', 5: 'B'
    };
    const code = numberToCodeMap[licenseTypeNumber];
    if (!code) {
      return '';
    }
    const licenseType = this.licenseTypes.find(lt => lt.code === code);
    return licenseType ? licenseType.name : '';
  }

  /**
   * Lưu các thay đổi đã chỉnh sửa cho lái xe.
   */
  saveChanges(): void {
    const editedDrivers = this.drivers.filter(d => d.isEditing);
    if (editedDrivers.length === 0) {
      this.showErrorAlert('Không có dữ liệu nào được chỉnh sửa!');
      return;
    }
    const invalidDrivers = editedDrivers.filter(driver => !this.isDriverValid(driver));
    if (invalidDrivers.length > 0) {
      this.showErrorAlert('Vui lòng kiểm tra lại thông tin các trường bắt buộc!');
      return;
    }
    const updateRequest: UpdateDriversRequest = {
      employeeIds: editedDrivers.map(d => d.pkEmployeeId),
      updateData: this.prepareUpdateData(editedDrivers[0])
    };
    this.isLoading = true;
    this.subscriptions.add(
      this.driverService.updateDrivers(updateRequest).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            editedDrivers.forEach(driver => {
              driver.isEditing = false;
              const driverId = driver.pkEmployeeId?.toString() || '';
              this.originalValues[driverId] = { ...driver };
            });
            this.modifiedFields = {};
            this.hasUnsavedChanges = false;
            this.showSuccessAlert(`Cập nhật thành công ${editedDrivers.length} lái xe!`);
            this.isLoading = false;
          } else {
            this.showErrorAlert('Có lỗi xảy ra khi cập nhật dữ liệu!');
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error updating drivers:', error);
          this.showErrorAlert('Có lỗi xảy ra khi cập nhật dữ liệu!');
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Hủy bỏ các thay đổi chưa lưu.
   */
  cancelChanges(): void {
    if (confirm('Bạn có chắc chắn muốn hủy bỏ các thay đổi chưa lưu?')) {
      this.drivers.forEach(driver => {
        if (driver.isEditing) {
          const driverId = driver.pkEmployeeId?.toString() || '';
          if (this.originalValues[driverId]) {
            Object.assign(driver, this.originalValues[driverId]);
          }
          driver.isEditing = false;
        }
      });
      this.modifiedFields = {};
      this.hasUnsavedChanges = false;
      this.showSuccessAlert('Đã hủy bỏ tất cả thay đổi!');
    }
  }

  /**
   * Chuyển trang trong phân trang.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDrivers();
    }
  }

  /**
   * Chuyển trang từ phân trang (có thể là số hoặc dấu ...).
   */
  goToPageFromPagination(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  /**
   * Thay đổi số dòng/trang và load lại dữ liệu.
   */
  onPageSizeChange(): void {
    this.pageSize = Number(this.pageSize);
    this.currentPage = 1;
    this.loadDrivers();
  }

  /**
   * Lấy danh sách số trang để hiển thị phân trang.
   */
  getPageNumbers(): (number | string)[] {
    const totalPages = this.totalPages || 1;
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (this.currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
      }
    }
    return pages;
  }

  /**
   * Xóa một lái xe khỏi danh sách.
   */
  deleteDriver(driver: HrmEmployee): void {
    if (confirm(`Bạn có chắc chắn muốn xóa lái xe "${driver.displayName}"?`)) {
      this.subscriptions.add(
        this.driverService.deleteDriver(driver.pkEmployeeId).subscribe({
          next: (response) => {
            if (response.statusCode === 200) {
              this.drivers = this.drivers.filter(d => d.pkEmployeeId !== driver.pkEmployeeId);
              this.totalCount--;
              this.allDriversForDropdown = this.allDriversForDropdown.filter(d => d.pkEmployeeId !== driver.pkEmployeeId);
              this.filteredDriversForDropdown = this.filteredDriversForDropdown.filter(d => d.pkEmployeeId !== driver.pkEmployeeId);
              this.selectedDrivers = this.selectedDrivers.filter(d => d.pkEmployeeId !== driver.pkEmployeeId);
              this.showSuccessAlert('Xóa lái xe thành công!');
            } else {
              this.showErrorAlert('Có lỗi xảy ra khi xóa lái xe');
            }
          },
          error: (error) => {
            console.error('Error deleting driver:', error);
            this.showErrorAlert('Có lỗi xảy ra khi xóa lái xe');
          }
        })
      );
    }
  }

  /**
   * Cập nhật lại dữ liệu bảng (reload).
   */
  updateGridData(): void {
    this.loadDrivers();
  }

  /**
   * Làm mới lại dữ liệu danh sách lái xe.
   */
  refreshData(): void {
    this.currentPage = 1;
    this.loadDrivers();
    this.showSuccessAlert('Đã làm mới dữ liệu!');
  }

  /**
   * Xuất danh sách lái xe ra file Excel.
   */
  exportToExcel(): void {
    const exportConfig: ExportConfig = {
      title: 'THÔNG TIN LÁI XE',
      licenseCategories: 'A, A1, A2, A3, A4, B1, B2, C, D, E, F, FC, FB2, FI, FD, FE',
      mergeTitleRows: '1:2',
      mergeCategoriesRows: '3:5'
    };
    this.subscriptions.add(
      this.driverService.exportDrivers(exportConfig).subscribe({
        next: (blob: Blob) => {
          this.downloadFile(blob, 'Drivers_Custom.xlsx');
        },
        error: (error) => {
          console.error('Error exporting drivers:', error);
          this.showErrorAlert('Có lỗi xảy ra khi xuất file Excel');
        }
      })
    );
  }

  /**
   * (Dự phòng) Chọn tất cả các thay đổi.
   */
  toggleSelectAllChanges(event: any): void {}

  /* private method */
  /**
   * Lấy danh sách id lái xe đã chọn.
   */
  private getSelectedEmployeeIds(): number[] {
    return this.selectedDrivers.map(driver => driver.pkEmployeeId).filter(id => id !== undefined) as number[];
  }

  /**
   * Lấy danh sách id loại bằng đã chọn.
   */
  private getSelectedLicenseTypes(): number[] {
    const licenseTypeIds = this.selectedLicenseTypes.map(licenseType => {
      if (licenseType.pkLicenseTypeId && licenseType.pkLicenseTypeId !== 0) {
        return licenseType.pkLicenseTypeId;
      }
      const codeToNumberMap: { [key: string]: number; } = {
        'A1': 1, 'A2': 2, 'A3': 3, 'A4': 4, 'B': 5, 'B.01': 6, 'B.02': 7
      };
      return codeToNumberMap[licenseType.code] || 0;
    }).filter(id => id !== undefined && id !== null && id !== 0) as number[];
    return licenseTypeIds;
  }

  /**
   * Chuẩn hóa giá trị để so sánh thay đổi.
   */
  private normalizeValue(value: any): any {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }

  /**
   * Lấy giá trị gốc của trường dữ liệu lái xe.
   */
  private getOriginalValue(driver: HrmEmployee, fieldName: string): any {
    const driverId = driver.pkEmployeeId?.toString() || '';
    if (!this.originalValues[driverId]) {
      this.originalValues[driverId] = { ...driver };
    }
    return this.originalValues[driverId][fieldName as keyof HrmEmployee];
  }

  /**
   * Chuẩn bị dữ liệu cập nhật cho lái xe.
   */
  private prepareUpdateData(driver: HrmEmployee): HrmEmployee {
    return {
      pkEmployeeId: driver.pkEmployeeId,
      employeeCode: driver.employeeCode || '',
      fkCompanyId: driver.fkCompanyId,
      fkDepartmentId: driver.fkDepartmentId,
      name: driver.name || driver.displayName || '',
      displayName: driver.displayName,
      birthday: driver.birthday,
      sex: driver.sex,
      address: driver.address,
      mobile: driver.mobile,
      phoneNumber1: driver.phoneNumber1,
      phoneNumber2: driver.phoneNumber2,
      employeeType: driver.employeeType,
      identityNumber: driver.identityNumber,
      driverLicense: driver.driverLicense,
      issueLicenseDate: driver.issueLicenseDate,
      issueLicensePlace: driver.issueLicensePlace,
      expireLicenseDate: driver.expireLicenseDate,
      createdByUser: driver.createdByUser,
      createdDate: driver.createdDate,
      updatedByUser: driver.updatedByUser,
      updatedDate: driver.updatedDate,
      flags: driver.flags,
      isSent: driver.isSent,
      licenseType: driver.licenseType,
      driverImage: driver.driverImage,
      isLocked: driver.isLocked,
      isDeleted: driver.isDeleted,
      fkUserId: driver.fkUserId,
      driverAvatar: driver.driverAvatar,
      lockDate: driver.lockDate
    };
  }

  /**
   * Kiểm tra tính hợp lệ của các trường đã chỉnh sửa của lái xe.
   */
  private isDriverValid(driver: HrmEmployee): boolean {
    const driverId = driver.pkEmployeeId?.toString() || '';
    const modifiedFields = this.modifiedFields[driverId] || {};
    for (const fieldName in modifiedFields) {
      if (modifiedFields[fieldName]) {
        const isValid = this.isFieldValid(driver, fieldName);
        if (!isValid) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Hiển thị thông báo thành công.
   */
  private showSuccessAlert(message: string): void {
    alert(`✅ ${message}`);
  }

  /**
   * Hiển thị thông báo lỗi.
   */
  private showErrorAlert(message: string): void {
    alert(`❌ ${message}`);
  }

  /**
   * Load danh sách lái xe theo điều kiện tìm kiếm.
   */
  private loadDrivers(): void {
    this.isLoading = true;
    const searchTerm = this.searchType === 'name' ? this.searchKeyword : '';
    const driverLicense = this.searchType === 'license' ? this.searchKeyword : '';
    const selectedEmployeeIds = this.getSelectedEmployeeIds();
    const selectedLicenseTypes = this.getSelectedLicenseTypes();
    const licenseTypes = selectedLicenseTypes.length > 0 ? selectedLicenseTypes : undefined;
    const employeeIds = selectedEmployeeIds.length > 0 ? selectedEmployeeIds : undefined;
    this.subscriptions.add(
      this.driverService.listDrivers(this.currentPage, this.pageSize, searchTerm, driverLicense, licenseTypes, employeeIds).subscribe({
        next: (response) => {
          if (response.statusCode === 200 && response.data) {
            this.drivers = response.data.items || [];
            this.totalCount = response.data.totalCount || 0;
            this.totalPages = response.data.totalPage || 1;
            this.startIndex = this.totalCount === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
            this.endIndex = Math.min(this.currentPage * this.pageSize, this.totalCount);
            this.drivers.forEach(driver => {
              const driverId = driver.pkEmployeeId?.toString() || '';
              this.originalValues[driverId] = { ...driver };
            });
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

  /**
   * Load toàn bộ danh sách lái xe cho dropdown chọn nhanh.
   */
  private loadAllDrivers(): void {
    this.subscriptions.add(
      this.driverService.listDrivers(1, 1000, '', '').subscribe({
        next: (response) => {
          if (response.statusCode === 200 && response.data) {
            this.allDriversForDropdown = (response.data.items || []).map(driver => ({
              ...driver,
              checked: false
            }));
            this.filteredDriversForDropdown = [...this.allDriversForDropdown];
          }
        },
        error: (error) => {
          console.error('Error loading all drivers:', error);
        }
      })
    );
  }

  /**
   * Load danh sách loại bằng lái xe.
   */
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

  /**
   * Tải file về máy người dùng.
   */
  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
