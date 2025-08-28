import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { Group, Vehicles, VehicleGroup } from '../../../../core/interface';
import { FormBuilder, FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss']
})
export class VehicleManagementComponent implements OnInit, OnDestroy {
  private i18nService = inject(TranslateService);
  private vehicleService = inject(VehicleService);

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

  // ===========================
  // DATE + TIME FILTER
  // ===========================
  selectedDate: string = '';   // ngày được chọn
  startTime: string = '00:00';
  endTime: string = '23:59';
  maxDate: string = '';        // ngày hiện tại
  minDate: string = '';        // ngày hiện tại - 30 ngày
  timeError: boolean = false;

  // ===========================
  // SORT DROPDOWN
  // ===========================
  sortOptions: SortOption[] = [
    { id: 'desc', name: 'Theo ảnh mới nhất' },
    { id: 'asc', name: 'Theo ảnh cũ nhất' }
  ];
  selectedSort: SortOption = this.sortOptions[0];

  // demo list ảnh
  images: { id: number; url: string; createdAt: Date }[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadGroup();
    this.loadVehicles();

    // setup ngày mặc định
    const now = new Date();
    this.maxDate = now.toISOString().split('T')[0];
    this.selectedDate = this.maxDate;

    const past = new Date();
    past.setDate(now.getDate() - 30);
    this.minDate = past.toISOString().split('T')[0];

    // fake dữ liệu ảnh để test
    this.images = [
      { id: 1, url: 'image1.jpg', createdAt: new Date('2024-01-01T10:00') },
      { id: 2, url: 'image2.jpg', createdAt: new Date('2024-05-10T15:30') },
      { id: 3, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 4, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 5, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 6, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 7, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 8, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 9, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 10, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 11, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 12, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 13, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 14, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 15, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 16, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 17, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 18, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 19, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 20, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 21, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 22, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 23, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 24, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 25, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 26, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 27, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 28, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 29, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 30, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 31, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 32, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 33, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 34, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 35, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
      { id: 36, url: 'image3.jpg', createdAt: new Date('2023-12-20T08:45') },
    ];
    this.sortImages();
  }

  ngOnDestroy(): void {}

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
      this.images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      this.images.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
  }

  // ===========================
  // VALIDATE TIME RANGE
  // ===========================
  validateTime() {
    if (!this.startTime || !this.endTime) {
      this.timeError = false;
      return;
    }
    const [sh, sm] = this.startTime.split(':').map(Number);
    const [eh, em] = this.endTime.split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    this.timeError = endMinutes < startMinutes;
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
    this.updateFilteredVehicles();
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedGroupIds = this.groups.map(g => g.pkVehicleGroupId);
    } else {
      this.selectedGroupIds = [];
    }
    this.updateFilteredVehicles();
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
          name: `Kênh ${this.selectedVehicle.pkVehicleId}-${i + 1}`,
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
    this.vehicleService.listVehicles().subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.vehicles = res.data as Vehicles[];
        } else {
          console.error('API error:', res.message);
        }
      },
      error: (err) => {
        console.error('Error fetching vehicles:', err);
      }
    });
  }

  updateFilteredVehicles() {
    if (this.selectedGroupIds.length === 0) {
      this.filteredVehicles = [];
      return;
    }
    this.vehicleService.listVehicles().subscribe(res => {
      if (res.statusCode === 200) {
        this.vehicles = res.data as Vehicles[];
        this.vehicleService.listVehicleGroups().subscribe(vgRes => {
          if (vgRes.statusCode === 200) {
            this.vehicleGroups = vgRes.data as VehicleGroup[];
            this.filteredVehicles = this.vehicles.filter(v =>
              this.vehicleGroups.some(vg =>
                this.selectedGroupIds.includes(vg.fkVehicleGroupId) &&
                vg.fkVehicleId === v.pkVehicleId &&
                !vg.isDeleted &&
                !v.isDeleted
              )
            );
          }
        });
      }
    });
  }

  searchImages() {
    console.log('Tìm kiếm ảnh với các tham số:');
  }

  imagePerRowOptions = [4, 5, 6];
  selectedImagePerRow = 6; // mặc định 6

  setImagePerRow(option: number) {
    this.selectedImagePerRow = option;
    // TODO: gọi hàm cập nhật bố cục lưới ở đây
  }
}
