import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, HostListener } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { Group, Vehicles, VehicleGroup, VehicleImageResponse, VehicleImage, IPaginationResponse } from '../../../../core/interface';
import { FormsModule } from '@angular/forms';
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

  // props
  private vehicleService = inject(VehicleService);
  private http = inject(HttpClient);
  private subscriptions: Subscription = new Subscription();

  groups: Group[] = [];
  hierarchicalGroups: Group[] = [];
  expandedGroupIds: Set<number> = new Set();
  vehicles: Vehicles[] = [];
  filteredVehicles: Vehicles[] = [];
  vehicleGroups: VehicleGroup[] = [];
  selectedVehicle: Vehicles | null = null;
  channels: Channel[] = [];
  selectedChannels: number[] = [];
  searchTerm: string = '';
  vehicleSearchTerm: string = '';
  channelSearchTerm: string = '';
  selectedGroupIds: number[] = [];

  isGroupDropdownOpen = false;
  isVehicleDropdownOpen = false;
  isChannelDropdownOpen = false;
  isSortDropdownOpen = false;

  images: VehicleImageResponse[] = [];
  allImages: VehicleImageResponse[] = [];
  pagination: IPaginationResponse<any> = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
  currentPage: number = 1;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  selectedPageSize: number = 50;
  startIndex: number = 0;
  endIndex: number = 0;

  imagePerRowOptions = [4, 5, 6];
  selectedImagePerRow = 6;
  itemColClass: string = 'col-lg-2 col-md-2 col-sm-6';

  selectedDateISO: string = '';
  startTime: string = '00:00';
  endTime: string = '23:59';

  sortOptions: SortOption[] = [
    { id: 'desc', name: 'Theo ảnh mới nhất' },
    { id: 'asc', name: 'Theo ảnh cũ nhất' }
  ];
  selectedSort: SortOption = this.sortOptions[0];

  showModal: boolean = false;
  selectedImageIndex: number = 0;
  isSearchingImages: boolean = false;

  // constructor
  constructor() { }

  // ngOnInit
  ngOnInit(): void {
    this.loadGroup();
    this.loadVehicles();
    this.loadVehicleGroups();

    const now = new Date();
    this.selectedDateISO = now.toISOString().split('T')[0];
    this.startTime = '00:00';
    this.endTime = '23:59';

    this.initializeChannels();
    this.updateItemColClass();
  }

  // ngOnDestroy
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // public methods

  /**
   * Đóng tất cả dropdown khi click ra ngoài
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.dropdown');
    const clickedCopyIcon = target.closest('.dropdown-copy-icon') ||
      target.classList.contains('bi-copy');

    if (!clickedInsideDropdown && !clickedCopyIcon) {
      this.closeAllDropdowns();
    }
  }

  /**
   * Mở/đóng dropdown theo loại
   */
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

  /**
   * Lọc danh sách nhóm xe theo từ khóa tìm kiếm
   */
  filterGroups(): Group[] {
    if (!this.searchTerm) return this.hierarchicalGroups;
    const term = this.searchTerm.toLowerCase();
    return this.groups.filter(group => group.name.toLowerCase().includes(term));
  }

  /**
   * Lọc danh sách xe theo từ khóa tìm kiếm
   */
  filterVehicles(): Vehicles[] {
    if (!this.vehicleSearchTerm) return this.filteredVehicles;
    const term = this.vehicleSearchTerm.toLowerCase();
    return this.filteredVehicles.filter(vehicle =>
      vehicle.privateCode.toLowerCase().includes(term) ||
      vehicle.vehiclePlate.toLowerCase().includes(term)
    );
  }

  /**
   * Lọc danh sách kênh theo từ khóa tìm kiếm
   */
  filterChannels(): Channel[] {
    if (!this.channelSearchTerm) return this.channels;
    const term = this.channelSearchTerm.toLowerCase();
    return this.channels.filter(channel =>
      channel.name.toLowerCase().includes(term)
    );
  }

  /**
   * Xử lý nhập liệu trực tiếp trên dropdown button
   */
  onDropdownKeydown(event: KeyboardEvent, type: 'vehicle' | 'channel'): void {
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey) {
      event.preventDefault();

      if (type === 'vehicle') {
        this.vehicleSearchTerm += event.key;
        this.isVehicleDropdownOpen = true;
      } else if (type === 'channel') {
        this.channelSearchTerm += event.key;
        this.isChannelDropdownOpen = true;
      }
    }
    else if (event.key === 'Backspace') {
      event.preventDefault();

      if (type === 'vehicle') {
        this.vehicleSearchTerm = this.vehicleSearchTerm.slice(0, -1);
        this.isVehicleDropdownOpen = true;
      } else if (type === 'channel') {
        this.channelSearchTerm = this.channelSearchTerm.slice(0, -1);
        this.isChannelDropdownOpen = true;
      }
    }
    else if (event.key === 'Escape') {
      this.closeAllDropdowns();
    }
  }

  /**
   * Tạo cấu trúc phân cấp cho nhóm xe (parent-child)
   */
  buildHierarchicalGroups(): void {
    const parentGroups = this.groups.filter(g => !g.parentVehicleGroupId || g.parentVehicleGroupId === 0);
    const childGroups = this.groups.filter(g => g.parentVehicleGroupId && g.parentVehicleGroupId > 0);

    const childrenMap = new Map<number, Group[]>();
    childGroups.forEach(child => {
      if (!childrenMap.has(child.parentVehicleGroupId)) {
        childrenMap.set(child.parentVehicleGroupId, []);
      }
      childrenMap.get(child.parentVehicleGroupId)!.push(child);
    });

    this.hierarchicalGroups = [];

    parentGroups.forEach(parent => {
      this.hierarchicalGroups.push(parent);

      if (this.expandedGroupIds.has(parent.pkVehicleGroupId)) {
        const children = childrenMap.get(parent.pkVehicleGroupId) || [];
        children.forEach(child => {
          this.hierarchicalGroups.push(child);
        });
      }
    });
  }

  /**
   * Kiểm tra nhóm xe có nhóm con không
   */
  hasChildren(groupId: number): boolean {
    return this.groups.some(g => g.parentVehicleGroupId === groupId);
  }

  /**
   * Mở/thu gọn nhóm xe cha để hiển thị nhóm con
   */
  toggleGroupExpansion(groupId: number, event: Event): void {
    event.stopPropagation();

    if (this.expandedGroupIds.has(groupId)) {
      this.expandedGroupIds.delete(groupId);
    } else {
      this.expandedGroupIds.add(groupId);
    }

    this.buildHierarchicalGroups();
  }

  /**
   * Kiểm tra nhóm xe có đang được mở rộng không
   */
  isGroupExpanded(groupId: number): boolean {
    return this.expandedGroupIds.has(groupId);
  }

  /**
   * Kiểm tra nhóm xe có phải là nhóm con không
   */
  isChildGroup(group: Group): boolean {
    return !!(group.parentVehicleGroupId && group.parentVehicleGroupId > 0);
  }

  /**
   * Chọn/bỏ chọn nhóm xe
   */
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
  }

  /**
   * Chọn/bỏ chọn tất cả nhóm xe
   */
  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedGroupIds = this.groups.map(g => g.pkVehicleGroupId);
    } else {
      this.selectedGroupIds = [];
    }
    this.currentPage = 1;
    this.updateFilteredVehicles();
  }

  /**
   * Xử lý thay đổi checkbox nhóm xe
   */
  onCheckboxChange(event: Event, groupId: number) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleGroupSelection(groupId, checked);
  }

  /**
   * Chọn xe từ danh sách
   */
  selectVehicle(vehicleId: number) {
    const selected = this.vehicles.find(v => v.pkVehicleId === vehicleId);
    if (selected) {
      this.selectedVehicle = selected;
      this.currentPage = 1;
      this.vehicleSearchTerm = '';
    }
    this.isVehicleDropdownOpen = false;
  }

  /**
   * Copy tên xe vào clipboard
   */
  copyVehicleName(event: Event) {
    event.stopPropagation();

    if (this.selectedVehicle) {
      const vehicleName = `${this.selectedVehicle.privateCode} (${this.selectedVehicle.vehiclePlate})`;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(vehicleName).then(() => {
          console.log('Đã copy tên xe:', vehicleName);
        }).catch(err => {
          console.error('Lỗi khi copy:', err);
          this.fallbackCopyTextToClipboard(vehicleName);
        });
      } else {
        this.fallbackCopyTextToClipboard(vehicleName);
      }
    }
  }

  /**
   * Chọn kiểu sắp xếp ảnh
   */
  selectSort(option: SortOption) {
    this.selectedSort = option;
    this.isSortDropdownOpen = false;
    this.currentPage = 1;
  }

  /**
   * Xử lý thay đổi ngày được chọn
   */
  onDatePickerChange() {
    this.currentPage = 1;
  }

  /**
   * Xử lý thay đổi giờ bắt đầu hoặc kết thúc
   */
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

  /**
   * Tạo 4 kênh mặc định khi chọn xe
   */
  generateDefaultChannels() {
    this.channels = [];
    this.channelSearchTerm = '';

    for (let i = 1; i <= 4; i++) {
      this.channels.push({
        id: i,
        name: `Kênh ${i}`,
        checked: false,
      });
    }
    this.updateSelectedChannels();
  }

  /**
   * Khởi tạo 4 kênh ban đầu (chưa chọn xe)
   */
  initializeChannels() {
    this.channels = [];
    this.channelSearchTerm = '';

    for (let i = 1; i <= 4; i++) {
      this.channels.push({
        id: i,
        name: `Kênh ${i}`,
        checked: false,
      });
    }
    this.updateSelectedChannels();
  }

  /**
   * Cập nhật danh sách kênh được chọn
   */
  updateSelectedChannels() {
    this.selectedChannels = this.channels
      .filter(channel => channel.checked)
      .map(channel => channel.id);
  }

  /**
   * Chọn/bỏ chọn tất cả kênh
   */
  toggleAllChannels(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.channels.forEach(channel => {
      channel.checked = checked;
    });
    this.updateSelectedChannels();
  }

  /**
   * Tải danh sách nhóm xe từ API
   */
  loadGroup() {
    this.vehicleService.listGroups().subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.groups = res.data as Group[];
          this.buildHierarchicalGroups();
        } else {
          console.error('API error:', res.message);
        }
      },
      error: (err) => {
        console.error('Error fetching groups:', err);
      }
    });
  }

  /**
   * Tải danh sách tất cả xe từ API
   */
  loadVehicles() {
    this.vehicleService.listVehicles([]).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.vehicles = res.data as Vehicles[];
          this.filteredVehicles = [...this.vehicles];
        } else {
          console.error('API error:', res.message);
          this.vehicles = [];
          this.filteredVehicles = [];
        }
      },
      error: (err) => {
        console.error('Error fetching all vehicles:', err);
        this.vehicles = [];
        this.filteredVehicles = [];
      }
    });
  }

  /**
   * Tải mapping giữa xe và nhóm xe
   */
  loadVehicleGroups() {
    this.vehicleService.listVehicleGroups().subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.vehicleGroups = res.data as VehicleGroup[];
        } else {
          console.error('API error:', res.message);
          this.vehicleGroups = [];
        }
      },
      error: (err) => {
        console.error('Error fetching vehicle groups:', err);
        this.vehicleGroups = [];
      }
    });
  }

  /**
   * Cập nhật danh sách xe đã lọc theo nhóm được chọn
   */
  updateFilteredVehicles() {
    if (this.selectedGroupIds.length === 0) {
      this.filteredVehicles = [...this.vehicles];
    } else {
      const vehicleIdsInSelectedGroups = this.vehicleGroups
        .filter(vg => this.selectedGroupIds.includes(vg.fkVehicleGroupId) && !vg.isDeleted)
        .map(vg => vg.fkVehicleId);

      this.filteredVehicles = this.vehicles.filter(vehicle =>
        vehicleIdsInSelectedGroups.includes(vehicle.pkVehicleId)
      );

      if (this.selectedVehicle && !this.filteredVehicles.some(v => v.pkVehicleId === this.selectedVehicle?.pkVehicleId)) {
        this.selectedVehicle = null;
        this.channels.forEach(channel => channel.checked = false);
        this.updateSelectedChannels();
        this.images = [];
        this.allImages = [];
      }
    }
  }

  /**
   * Tìm kiếm ảnh xe với các bộ lọc đã chọn
   */
  searchImages() {
    if (!this.selectedVehicle) {
      alert('Vui lòng chọn một xe để tìm kiếm.');
      return;
    }

    if (this.selectedChannels.length === 0) {
      this.channels.forEach(channel => channel.checked = true);
      this.updateSelectedChannels();
    }

    this.isSearchingImages = true;

    const formattedDate = this.selectedDateISO || new Date().toISOString().split('T')[0];

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
          this.isSearchingImages = false;

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

            if (this.currentPage === 1) {
              this.loadAllImagesForCarousel(requestData);
            }

            this.startIndex = this.pagination.totalCount === 0 ? 0 : (this.currentPage - 1) * this.selectedPageSize + 1;
            this.endIndex = Math.min(this.currentPage * this.selectedPageSize, this.pagination.totalCount);
          } else {
            console.error('API error:', res.message);
            this.images = [];
            this.allImages = [];
            this.pagination = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
            this.startIndex = 0;
            this.endIndex = 0;
          }
        },
        error: (err) => {
          this.isSearchingImages = false;
          console.error('Error fetching images:', err);
          this.images = [];
          this.allImages = [];
          this.pagination = { page: 1, pageSize: 10, totalCount: 0, totalPage: 0, items: [] };
          this.startIndex = 0;
          this.endIndex = 0;
        }
      })
    );
  }

  /**
   * Tải tất cả ảnh cho carousel (không phân trang)
   */
  loadAllImagesForCarousel(requestData: VehicleImage) {
    const allImagesRequest = { ...requestData };

    this.subscriptions.add(
      this.vehicleService.listVehicleImages(allImagesRequest, 1, 1000).subscribe({
        next: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.allImages = res.data.items.map((item: any) => ({
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
          }
        },
        error: (err) => {
          console.error('Error fetching all images for carousel:', err);
          this.allImages = [...this.images];
        }
      })
    );
  }

  /**
   * Cập nhật class CSS cho số ảnh trên mỗi hàng
   */
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

  /**
   * Đặt số ảnh hiển thị trên mỗi hàng
   */
  setImagePerRow(option: number) {
    this.selectedImagePerRow = option;
    this.updateItemColClass();
  }

  /**
   * Chuyển trang trong danh sách ảnh
   */
  changePage(page: number) {
    if (page >= 1 && page <= this.pagination.totalPage) {
      this.currentPage = page;
      this.searchImages();
    }
  }

  /**
   * Tải ảnh về máy tính
   */
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

  /**
   * Thay đổi số ảnh mỗi trang
   */
  changePageSize(size: number) {
    this.selectedPageSize = size;
    this.currentPage = 1;
    this.searchImages();
  }

  /**
   * Lấy danh sách số trang để hiển thị pagination
   */
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

  /**
   * Mở modal xem chi tiết ảnh
   */
  openImageModal(index: number) {
    const imagesToUse = this.allImages.length > 0 ? this.allImages : this.images;

    if (this.allImages.length > 0) {
      const actualIndex = (this.currentPage - 1) * this.selectedPageSize + index;
      this.selectedImageIndex = Math.max(0, Math.min(actualIndex, this.allImages.length - 1));
    } else {
      this.selectedImageIndex = Math.max(0, Math.min(index, this.images.length - 1));
    }

    this.showModal = true;
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      const modalElement = document.getElementById('vehicleDetailModal');
      if (modalElement) {
        (window as any).jQuery(modalElement).modal('show');
      }
    }, 0);
  }

  /**
   * Đóng modal xem chi tiết ảnh
   */
  closeModal() {
    this.showModal = false;
    const modalElement = document.getElementById('vehicleDetailModal');
    if (modalElement) {
      (window as any).jQuery(modalElement).modal('hide');
    }
  }

  /**
   * Chuyển đến ảnh trước đó trong modal
   */
  goToPreviousImage() {
    const imagesToUse = this.allImages.length > 0 ? this.allImages : this.images;
    this.selectedImageIndex = (this.selectedImageIndex > 0) ? this.selectedImageIndex - 1 : imagesToUse.length - 1;
    this.updateModalImage();
  }

  /**
   * Chuyển đến ảnh tiếp theo trong modal
   */
  goToNextImage() {
    const imagesToUse = this.allImages.length > 0 ? this.allImages : this.images;
    this.selectedImageIndex = (this.selectedImageIndex < imagesToUse.length - 1) ? this.selectedImageIndex + 1 : 0;
    this.updateModalImage();
  }

  // private methods

  /**
   * Đóng tất cả dropdown
   */
  private closeAllDropdowns(): void {
    this.isGroupDropdownOpen = false;
    this.isVehicleDropdownOpen = false;
    this.isChannelDropdownOpen = false;
    this.isSortDropdownOpen = false;
  }

  /**
   * Phương án dự phòng cho copy clipboard (browser cũ)
   */
  private fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        console.log('Đã copy tên xe (fallback):', text);
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
  }

  /**
   * Cập nhật hiển thị ảnh trong modal
   */
  private updateModalImage() {
    const modalElement = document.getElementById('vehicleDetailModal');
    if (modalElement) {
      (window as any).jQuery(modalElement).modal('handleUpdate');
    }
  }
}