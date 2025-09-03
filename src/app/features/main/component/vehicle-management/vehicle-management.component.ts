import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { Group, Vehicles, VehicleGroup, VehicleImageResponse, VehicleImage, IPaginationResponse } from '../../../../core/interface';
import { FormBuilder, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  private http = inject(HttpClient);
  private subscriptions: Subscription = new Subscription();

  groups: Group[] = [];
  vehicles: Vehicles[] = [];
  filteredVehicles: Vehicles[] = [];
  selectedVehicle: Vehicles | null = null;
  channels: Channel[] = [];
  selectedChannels: number[] = [];

  isGroupDropdownOpen = false;
  isVehicleDropdownOpen = false;
  isChannelDropdownOpen = false;
  isSortDropdownOpen = false;

  searchTerm: string = '';
  selectedGroupIds: number[] = [];

  images: VehicleImageResponse[] = [];
  pagination: IPaginationResponse<any> = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
  currentPage: number = 1;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  selectedPageSize: number = 50;
  startIndex: number = 0;
  endIndex: number = 0;

  imagePerRowOptions = [4, 5, 6];
  selectedImagePerRow = 6;
  itemColClass: string = 'col-lg-2 col-md-2 col-sm-6';

  selectedDate: string = '';
  startTime: string = '00:00';
  endTime: string = '23:59';

  sortOptions: SortOption[] = [
    { id: 'desc', name: 'Theo ảnh mới nhất' },
    { id: 'asc', name: 'Theo ảnh cũ nhất' }
  ];
  selectedSort: SortOption = this.sortOptions[0];

  showModal: boolean = false;
  selectedImageIndex: number = 0;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadGroup();
    this.loadVehicles();

    const now = new Date();
    this.selectedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    this.startTime = '00:00';
    this.endTime = '23:59';

    this.generateDefaultChannels();

    this.updateItemColClass();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Xử lý phần dropdown-menu
  toggleDropdown(type: 'group' | 'vehicle' | 'channel' | 'sort'): void {
    const wasGroupOpen = this.isGroupDropdownOpen;
    const wasVehicleOpen = this.isVehicleDropdownOpen;
    const wasChannelOpen = this.isChannelDropdownOpen;
    const wasSortOpen = this.isSortDropdownOpen;

    this.isGroupDropdownOpen = false;
    this.isVehicleDropdownOpen = false;
    this.isChannelDropdownOpen = false;
    this.isSortDropdownOpen = false;

    switch (type) {
      case 'group':
        this.isGroupDropdownOpen = !wasGroupOpen;
        break;
      case 'vehicle':
        this.isVehicleDropdownOpen = !wasVehicleOpen;
        break;
      case 'channel':
        this.isChannelDropdownOpen = !wasChannelOpen;
        break;
      case 'sort':
        this.isSortDropdownOpen = !wasSortOpen;
        break;
    }
  }

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
    this.currentPage = 1;
    this.updateFilteredVehicles();
    this.isGroupDropdownOpen = false;
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedGroupIds = this.groups.map(g => g.pkVehicleGroupId);
    } else {
      this.selectedGroupIds = [];
    }
    this.currentPage = 1;
    this.updateFilteredVehicles();
    this.isGroupDropdownOpen = false;
  }

  onCheckboxChange(event: Event, groupId: number) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleGroupSelection(groupId, checked);
  }

  selectVehicle(vehicleId: number) {
    const selected = this.vehicles.find(v => v.pkVehicleId === vehicleId);
    if (selected) {
      this.selectedVehicle = selected;
      this.currentPage = 1;
    }
    this.isVehicleDropdownOpen = false;
  }

  selectSort(option: SortOption) {
    this.selectedSort = option;
    this.isSortDropdownOpen = false;
    this.currentPage = 1;
    this.searchImages();
  }

  sortImages() {
    if (this.selectedSort.id === 'desc') {
      this.images.sort((a, b) => b.c.getTime() - a.c.getTime());
    } else {
      this.images.sort((a, b) => a.c.getTime() - b.c.getTime());
    }
  }

  onDateChange() {
    this.currentPage = 1;
  }

  //Thay đổi giờ bắt đầu và kết thúc thì về trang 1 và lấy lại danh sách ảnh
  onTimeChange(type: 'start' | 'end') {
    if (type === 'start' && this.startTime) {
      const match = this.startTime.match(/^(\d{1,2}):?(\d{0,2})$/);
      if (match) {
        const hours = Math.min(23, Math.max(0, parseInt(match[1] || '0'))).toString().padStart(2, '0');
        const minutes = Math.min(59, Math.max(0, parseInt(match[2] || '0'))).toString().padStart(2, '0');
        this.startTime = `${hours}:${minutes}`;
      }
    } else if (type === 'end' && this.endTime) {
      const match = this.endTime.match(/^(\d{1,2}):?(\d{0,2})$/);
      if (match) {
        const hours = Math.min(23, Math.max(0, parseInt(match[1] || '0'))).toString().padStart(2, '0');
        const minutes = Math.min(59, Math.max(0, parseInt(match[2] || '0'))).toString().padStart(2, '0');
        this.endTime = `${hours}:${minutes}`;
      }
    }
    this.currentPage = 1;
  }

  generateDefaultChannels() {
    this.channels = [];
    for (let i = 1; i <= 4; i++) {
      this.channels.push({
        id: i,
        name: `Kênh ${i}`,
        checked: true,
      });
    }
    this.updateSelectedChannels();
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
    this.updateSelectedChannels();
  }

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
    this.vehicles = [];
  }

  updateFilteredVehicles() {
    if (this.selectedGroupIds.length === 0) {
      this.vehicles = [];
      this.filteredVehicles = [];
      this.selectedVehicle = null;
      this.images = [];
      this.generateDefaultChannels();
      return;
    }

    this.vehicleService.listVehicles(this.selectedGroupIds).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.vehicles = res.data as Vehicles[];
          this.filteredVehicles = [...this.vehicles];
          if (this.selectedVehicle && !this.vehicles.some(v => v.pkVehicleId === this.selectedVehicle?.pkVehicleId)) {
            this.selectedVehicle = null;
            this.generateDefaultChannels();
            this.images = [];
          }
        } else {
          console.error('API error:', res.message);
          this.vehicles = [];
          this.filteredVehicles = [];
          this.images = [];
        }
      },
      error: (err) => {
        console.error('Error fetching vehicles by group:', err);
        this.vehicles = [];
        this.filteredVehicles = [];
        this.images = [];
      }
    });
  }

  //Call api lấy danh sách ảnh với các filter đã chọn
  searchImages() {
    if (!this.selectedVehicle) {
      alert('Vui lòng chọn một xe để tìm kiếm.');
      return;
    }

    if (this.selectedChannels.length === 0) {
        this.channels.forEach(channel => channel.checked = true);
        this.updateSelectedChannels();
    }

    const [day, month, year] = this.selectedDate.split('/').map(Number);
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const requestData: VehicleImage = {
      CustomerId: this.selectedVehicle.xncode,
      VehicleName: this.selectedVehicle.vehiclePlate,
      Channels: this.selectedChannels,
      StartTime: `${formattedDate}T${this.startTime}:00`,
      EndTime: `${formattedDate}T${this.endTime}:00`,
      Frequency: 5,
      StorageTime: 90,
      SortOrder: this.selectedSort.id,
    };

    this.subscriptions.add(
      this.vehicleService.listVehicleImages(requestData, this.currentPage, this.selectedPageSize).subscribe({
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
            this.startIndex = this.pagination.totalCount === 0 ? 0 : (this.currentPage - 1) * this.selectedPageSize + 1;
            this.endIndex = Math.min(this.currentPage * this.selectedPageSize, this.pagination.totalCount);
          } else {
            console.error('API error:', res.message);
            this.images = [];
            this.pagination = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
            this.startIndex = 0;
            this.endIndex = 0;
          }
        },
        error: (err) => {
          console.error('Error fetching images:', err);
          this.images = [];
          this.pagination = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
          this.startIndex = 0;
          this.endIndex = 0;
        }
      })
    );
  }

  //Xử lý khi chọn option chế độ hiển thị ảnh
  updateItemColClass() {
    switch (this.selectedImagePerRow) {
      case 4:
        this.itemColClass = 'col-lg-3 col-md-3 col-sm-6';
        break;
      case 5:
        this.itemColClass = 'col-custom-5 col-md-custom-5 col-sm-6';
        break;
      case 6:
        this.itemColClass = 'col-lg-2 col-md-2 col-sm-6';
        break;
      default:
        this.itemColClass = 'col-lg-2 col-md-2 col-sm-6';
    }
  }

  setImagePerRow(option: number) {
    this.selectedImagePerRow = option;
    this.updateItemColClass();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.pagination.totalPage) {
      this.currentPage = page;
      this.searchImages();
    }
  }

  //Xử lý tải ảnh
  downloadImage(index: number) {
    const image = this.images[index];
    if (!image || !image.u) {
      console.error('Invalid image or URL');
      return;
    }
    this.subscriptions.add(
      this.http.get(image.u, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `anh_${image.v}_${image.c.toISOString()}.jpg`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading image:', err);
          alert('Không thể tải ảnh. Vui lòng thử lại sau.');
        }
      })
    );
  }

  //Xử lý phân trang
  changePageSize(size: number) {
    this.selectedPageSize = size;
    this.currentPage = 1;
    this.searchImages();
  }

  getPageNumbers(): number[] {
    const totalPages = this.pagination.totalPage || 1;
    const pages: number[] = [];
    const maxPagesToShow = 5;
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

  //Xử lý mở modal xem chi tiết ảnh
  openImageModal(index: number) {
    this.selectedImageIndex = Math.max(0, Math.min(index, this.images.length - 1));
    this.showModal = true;
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      const modalElement = document.getElementById('vehicleDetailModal');
      if (modalElement) {
        (window as any).jQuery(modalElement).modal('show');
      }
    }, 0);
  }

  closeModal() {
    this.showModal = false;
    const modalElement = document.getElementById('vehicleDetailModal');
    if (modalElement) {
      (window as any).jQuery(modalElement).modal('hide');
    }
  }

  goToPreviousImage() {
    this.selectedImageIndex = (this.selectedImageIndex > 0) ? this.selectedImageIndex - 1 : this.images.length - 1;
    this.updateModalImage();
  }

  goToNextImage() {
    this.selectedImageIndex = (this.selectedImageIndex < this.images.length - 1) ? this.selectedImageIndex + 1 : 0;
    this.updateModalImage();
  }

  private updateModalImage() {
    const modalElement = document.getElementById('vehicleDetailModal');
    if (modalElement) {
      (window as any).jQuery(modalElement).modal('handleUpdate');
    }
  }
}