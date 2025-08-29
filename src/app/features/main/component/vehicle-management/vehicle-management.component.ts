import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { Group, Vehicles, VehicleGroup, VehicleImageResponse, VehicleImage, IPaginationResponse } from '../../../../core/interface';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VehicleDetailModalComponent } from './vehicle-detail-modal/vehicle-detail-modal.component';

interface Channel {
  id: number;
  name: string;
  checked: boolean;
}

interface SortOption {
  id: 'desc' | 'asc';
  name: string;
}

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, VehicleDetailModalComponent],
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss']
})
export class VehicleManagementComponent implements OnInit, OnDestroy {
  private i18nService = inject(TranslateService);
  private vehicleService = inject(VehicleService);
  private subscriptions: Subscription = new Subscription();

  groups: Group[] = [];
  vehicles: Vehicles[] = [];
  vehicleGroups: VehicleGroup[] = [];
  filteredVehicles: Vehicles[] = [];
  selectedVehicle: Vehicles | null = null;
  channels: Channel[] = [];
  filteredChannels: Channel[] = [];
  selectedChannels: number[] = [];
  channelSearchTerm: string = '';

  isGroupDropdownOpen = false;
  isVehicleDropdownOpen = false;
  isChannelDropdownOpen = false;
  isSortDropdownOpen = false;

  searchTerm: string = '';
  selectedGroupIds: number[] = [];

  // demo list ảnh
  images: VehicleImageResponse[] = [];
  pagination: IPaginationResponse<any> = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
  currentPage: number = 1;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  selectedPageSize: number = 50;

  imagePerRowOptions = [4, 5, 6];
  selectedImagePerRow = 6; // mặc định 6

  // ===========================
  // DATE + TIME FILTER
  // ===========================
  selectedDate: string = ''; // Ngày được chọn
  startTime: string = '00:00';
  endTime: string = '23:59';
  maxDate: string = '';
  minDate: string = '';
  timeError: boolean = false;
  dateError: boolean = false;
  validationError: boolean = false;

  // ===========================
  // SORT DROPDOWN
  // ===========================
  sortOptions: SortOption[] = [
    { id: 'desc', name: 'Theo ảnh mới nhất' },
    { id: 'asc', name: 'Theo ảnh cũ nhất' }
  ];
  selectedSort: SortOption = this.sortOptions[0];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadGroup();
    this.loadVehicles();

    const now = new Date();
    this.maxDate = now.toISOString().split('T')[0];

    const past = new Date();
    past.setDate(now.getDate() - 30);
    this.minDate = past.toISOString().split('T')[0];

    // Set giá trị mặc định: ngày hiện tại, giờ đầu ngày, giờ cuối ngày
    this.selectedDate = this.maxDate;
    this.startTime = '00:00';
    this.endTime = '23:59';

    // Đảm bảo time được format đúng 24h
    this.startTime = this.formatTimeFor24h(this.startTime);
    this.endTime = this.formatTimeFor24h(this.endTime);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ===========================
  // DROPDOWN TOGGLES
  // ===========================
  toggleGroupDropdown(): void {
    this.isGroupDropdownOpen = !this.isGroupDropdownOpen;
  }

  toggleVehicleDropdown(): void {
    this.isVehicleDropdownOpen = !this.isVehicleDropdownOpen;
  }

  toggleChannelDropdown(): void {
    this.isChannelDropdownOpen = !this.isChannelDropdownOpen;
  }

  toggleSortDropdown(): void {
    this.isSortDropdownOpen = !this.isSortDropdownOpen;
  }

  // ===========================
  // SORT DROPDOWN
  // ===========================
  selectSort(option: SortOption) {
    this.selectedSort = option;
    this.isSortDropdownOpen = false;
    this.sortImages();
  }

  sortImages() {
    if (this.selectedSort.id === 'desc') {
      this.images.sort((a, b) => b.c.getTime() - a.c.getTime());
    }
  }

  // ===========================
  // VALIDATE DATE AND TIME
  // ===========================
  validateDateTime() {
    // Reset errors
    this.dateError = false;
    this.timeError = false;
    this.validationError = false;

    // Validate date
    if (!this.selectedDate) {
      this.dateError = true;
      this.validationError = true;
      return;
    }

    // Validate date range (30 days back from today)
    const selectedDate = new Date(this.selectedDate);
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    if (selectedDate < thirtyDaysAgo || selectedDate > today) {
      this.dateError = true;
      this.validationError = true;
      return;
    }

    // Validate time
    if (!this.startTime || !this.endTime) {
      this.timeError = true;
      this.validationError = true;
      return;
    }

    // Parse time strings to hours and minutes
    const [sh, sm] = this.startTime.split(':').map(Number);
    const [eh, em] = this.endTime.split(':').map(Number);

    // Validate hours are in 24h format (0-23)
    if (sh < 0 || sh > 23 || eh < 0 || eh > 23) {
      this.timeError = true;
      this.validationError = true;
      return;
    }

    // Validate minutes are in range (0-59)
    if (sm < 0 || sm > 59 || em < 0 || em > 59) {
      this.timeError = true;
      this.validationError = true;
      return;
    }

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    this.timeError = endMinutes < startMinutes;
    if (this.timeError) {
      this.validationError = true;
    }
  }

  // ===========================
  // VALIDATE TIME RANGE (Legacy - kept for compatibility)
  // ===========================
  validateTime() {
    this.validateDateTime();
  }

  // ===========================
  // FORMAT TIME FOR 24H
  // ===========================
  formatTimeFor24h(timeString: string): string {
    if (!timeString) return '00:00';

    const [hours, minutes] = timeString.split(':').map(Number);

    // Ensure hours are in 24h format
    let formattedHours = hours;
    if (hours < 0) formattedHours = 0;
    if (hours > 23) formattedHours = 23;

    // Ensure minutes are in valid range
    let formattedMinutes = minutes;
    if (minutes < 0) formattedMinutes = 0;
    if (minutes > 59) formattedMinutes = 59;

    return `${formattedHours.toString().padStart(2, '0')}:${formattedMinutes.toString().padStart(2, '0')}`;
  }

  // ===========================
  // HANDLE DATE INPUT CHANGE
  // ===========================
  onDateChange() {
    this.dateError = false;
    this.validateDateTime();
  }

  // ===========================
  // HANDLE TIME INPUT CHANGE
  // ===========================
  onTimeChange(type: 'start' | 'end') {
    if (type === 'start') {
      this.startTime = this.formatTimeFor24h(this.startTime);
    } else {
      this.endTime = this.formatTimeFor24h(this.endTime);
    }
    this.validateDateTime();
  }

  // ===========================
  // GROUP FILTER
  // ===========================
  filterGroups(): Group[] {
    if (!this.searchTerm) return this.groups;
    const term = this.searchTerm.toLowerCase();
    return this.groups.filter(group => group.name.toLowerCase().includes(term));
  }

  toggleGroupSelection(groupId: number, checked: boolean) {
    if (checked) {
      if (!this.selectedGroupIds.includes(groupId)) {
        this.selectedGroupIds.push(groupId);
      }
    } else {
      this.selectedGroupIds = this.selectedGroupIds.filter(id => id !== groupId);
    }

    // Cập nhật danh sách xe theo nhóm mới
    this.updateFilteredVehicles();

    // Đóng dropdown nhóm
    this.isGroupDropdownOpen = false;
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedGroupIds = this.groups.map(g => g.pkVehicleGroupId);
    } else {
      this.selectedGroupIds = [];
    }

    // Cập nhật danh sách xe theo nhóm mới
    this.updateFilteredVehicles();

    // Đóng dropdown nhóm
    this.isGroupDropdownOpen = false;
  }

  onCheckboxChange(event: Event, groupId: number) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleGroupSelection(groupId, checked);
  }

  // ===========================
  // VEHICLE SELECTION
  // ===========================
  selectVehicle(vehicleId: number) {
    const selected = this.vehicles.find(v => v.pkVehicleId === vehicleId);
    if (selected) {
      this.selectedVehicle = selected;
      this.generateRandomChannels();
    }
    this.isVehicleDropdownOpen = false;
  }

  generateRandomChannels() {
    this.channels = [];
    if (this.selectedVehicle) {
      const channelCount = 4;
      for (let i = 0; i < channelCount; i++) {
        this.channels.push({
          id: i + 1,
          name: `Kênh ${i + 1}`,
          checked: false
        });
      }
    }
    this.filterChannels();
    this.updateSelectedChannels();
  }

  // ===========================
  // CHANNEL FILTER + TOGGLE
  // ===========================
  filterChannels() {
    if (!this.channelSearchTerm) {
      this.filteredChannels = [...this.channels];
    } else {
      const term = this.channelSearchTerm.toLowerCase();
      this.filteredChannels = this.channels.filter(channel =>
        channel.name.toLowerCase().includes(term)
      );
    }
  }

  updateSelectedChannels() {
    this.selectedChannels = this.channels
      .filter(channel => channel.checked)
      .map(channel => channel.id);
  }

  toggleAllChannels(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.channels.forEach(channel => {
      channel.checked = checked;
    });
    this.filterChannels();
    this.updateSelectedChannels();
  }

  // ===========================
  // LOAD DATA
  // ===========================
  loadGroup() {
    this.vehicleService.listGroups().subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.groups = res.data as Group[];
        } else {
          console.error('API error:', res.message);
        }
      },
      error: (err) => {
        console.error('Error fetching groups:', err);
      }
    });
  }

  loadVehicles() {
    // Không load tất cả xe nữa, chỉ load khi có nhóm được chọn
    this.vehicles = [];
  }

  updateFilteredVehicles() {
    if (this.selectedGroupIds.length === 0) {
      this.vehicles = [];
      this.filteredVehicles = [];
      this.selectedVehicle = null; // Reset xe đã chọn
      this.channels = []; // Reset kênh
      this.selectedChannels = []; // Reset kênh đã chọn
      return;
    }

    // Load xe theo nhóm đã chọn
    this.vehicleService.listVehicles(this.selectedGroupIds).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.vehicles = res.data as Vehicles[];
          this.filteredVehicles = [...this.vehicles];

          // Reset xe đã chọn nếu xe hiện tại không thuộc nhóm mới
          if (this.selectedVehicle && !this.vehicles.some(v => v.pkVehicleId === this.selectedVehicle?.pkVehicleId)) {
            this.selectedVehicle = null;
            this.channels = [];
            this.selectedChannels = [];
          }
        } else {
          console.error('API error:', res.message);
          this.vehicles = [];
          this.filteredVehicles = [];
        }
      },
      error: (err) => {
        console.error('Error fetching vehicles by group:', err);
        this.vehicles = [];
        this.filteredVehicles = [];
      }
    });
  }

  searchImages() {
    if (!this.selectedVehicle) return;

    // Validate date and time before making API call
    this.validateDateTime();
    if (this.validationError) {
      console.error('Validation failed. Please check date and time inputs.');
      return;
    }

    // Map ngày từ selectedDate cho cả StartTime và EndTime
    const requestData: VehicleImage = {
      CustomerId: this.selectedVehicle.xncode,
      VehicleName: this.selectedVehicle.vehiclePlate,
      Channels: this.selectedChannels,
      StartTime: `${this.selectedDate}T${this.startTime}:00`,
      EndTime: `${this.selectedDate}T${this.endTime}:00`,
      Frequency: 5,
      StorageTime: 90,
      SortOrder: this.selectedSort.id,
    };

    console.log('API Request Body:', requestData); // Debug log

    this.subscriptions.add(
      this.vehicleService.listVehicleImages(requestData).subscribe({
        next: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.pagination = res.data;
            this.images = res.data.items.map((item: any) => ({
              v: item.v || '',
              c: new Date(item.c),
              u: item.u || '',
              s: item.s || 0,
              k: item.k || 0,
              w: item.w || 0,
              h: item.h || 0,
              i: item.i || 0,
              t: item.t || 0,
              l: item.l || '',
              n: item.n || ''
            }));
          } else {
            console.error('API error:', res.message);
            this.images = [];
            this.pagination = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
          }
        },
        error: (err) => {
          console.error('Error fetching images:', err);
          this.images = [];
          this.pagination = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
        }
      })
    );
  }

  setImagePerRow(option: number) {
    this.selectedImagePerRow = option;
    // TODO: gọi hàm cập nhật bố cục lưới ở đây
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.pagination.totalPage) {
      this.searchImages();
    }
  }

  // Xử lý thay đổi pageSize
  changePageSize(size: number) {
    this.selectedPageSize = size;
    this.currentPage = 1; // Reset về trang 1 khi thay đổi pageSize
    this.searchImages();
  }

  // Tải ảnh
  downloadImage(index: number) {
    const image = this.images[index];
    if (image) {
      const link = document.createElement('a');
      link.href = image.u;
      link.download = `anh_${image.v}_${image.c.toISOString()}.jpg`;
      link.click();
    }
  }

  // Lấy danh sách số trang để hiển thị
  getPageNumbers(): number[] {
    const totalPages = this.pagination.totalPage || 1;
    const pages: number[] = [];
    const maxPagesToShow = 5; // Số trang tối đa hiển thị
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Mở modal khi click ảnh
  showModal: boolean = false;
  selectedImageIndex: number = 0;

  openImageModal(index: number) {
    this.selectedImageIndex = index;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  goToPreviousImage() {
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    } else if (this.images.length > 0) {
      this.selectedImageIndex = this.images.length - 1;
    }
  }

  goToNextImage() {
    if (this.selectedImageIndex < this.images.length - 1) {
      this.selectedImageIndex++;
    } else if (this.images.length > 0) {
      this.selectedImageIndex = 0;
    }
  }
}
