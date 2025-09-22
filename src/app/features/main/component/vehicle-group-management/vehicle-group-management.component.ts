import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VehicleGroupService } from '../../../../core/service/vehicle-group.service';

import { AdminUser, Group, ResponseSingleContentModel } from '../../../../core/interface';

/* Component quản lý nhóm xe - cho phép gán/hủy gán nhóm xe cho người dùng */
@Component({
  selector: 'app-vehicle-group-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [VehicleGroupService],
  templateUrl: './vehicle-group-management.component.html',
  styleUrl: './vehicle-group-management.component.scss'
})
export class VehicleGroupManagementComponent implements OnInit {
  /* Props - Mảng dữ liệu chính */
  users: AdminUser[] = []; // Danh sách tất cả người dùng
  availableGroups: Group[] = []; // Danh sách nhóm xe có thể gán
  assignedGroups: Group[] = []; // Danh sách nhóm xe đã được gán

  /* Props - Mảng dữ liệu đã lọc để hiển thị */
  filteredUsers: AdminUser[] = []; // Danh sách người dùng sau khi tìm kiếm
  filteredAvailableGroups: Group[] = []; // Danh sách nhóm xe có thể gán sau khi tìm kiếm
  filteredAssignedGroups: Group[] = []; // Danh sách nhóm xe đã gán sau khi tìm kiếm

  /* Props - Các từ khóa tìm kiếm */
  userSearchTerm: string = ''; // Từ khóa tìm kiếm người dùng
  availableGroupSearchTerm: string = ''; // Từ khóa tìm kiếm nhóm xe có thể gán
  assignedGroupSearchTerm: string = ''; // Từ khóa tìm kiếm nhóm xe đã gán

  /* Props - Các mục đã được chọn */
  selectedUser: AdminUser | undefined = undefined; // Người dùng đang được chọn
  selectedAvailableGroups: number[] = []; // Các nhóm xe có thể gán đã được chọn
  selectedAssignedGroups: number[] = []; // Các nhóm xe đã gán đã được chọn

  /* Props - Quản lý trạng thái */
  hasUnsavedChanges: boolean = false; // Có thay đổi chưa lưu hay không
  isLoading: boolean = false; // Đang tải dữ liệu hay không

  /* Props - Dữ liệu gốc để so sánh */
  private originalAvailableGroups: Group[] = []; // Dữ liệu gốc của nhóm xe có thể gán
  private originalAssignedGroups: Group[] = []; // Dữ liệu gốc của nhóm xe đã gán

  /* Props - Inject service để gọi API */
  private vehicleGroupService = inject(VehicleGroupService);

  /* Props - Các phương thức xử lý cấu trúc cây cho nhóm xe */
  private expandedGroups: Set<number> = new Set(); // Lưu trữ các nhóm đã được mở rộng

  /* Constructor */
  constructor() {
    // Constructor logic nếu có
  }

  /* ngOnInit - Khởi tạo component - tải danh sách người dùng */
  ngOnInit(): void {
    this.loadUsers();
  }

  /* Public Methods - Tải dữ liệu */
  /* Tải danh sách tất cả người dùng từ API */
  loadUsers(): void {
    this.isLoading = true;
    this.vehicleGroupService.listUser().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.users = response.data as AdminUser[];
          this.filteredUsers = [...this.users];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  /* Tải danh sách nhóm xe có thể gán cho người dùng được chọn */
  loadAvailableGroups(userId: string): void {
    this.isLoading = true;
    this.vehicleGroupService.listAvailableVehicleGroups(userId).subscribe({
      next: (response: ResponseSingleContentModel<Group[]>) => {
        if (response.statusCode === 200) {
          this.availableGroups = response.data || [];
          this.originalAvailableGroups = [...this.availableGroups];
          this.filteredAvailableGroups = [...this.availableGroups];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading available groups:', error);
        this.isLoading = false;
      }
    });
  }

  /* Tải danh sách nhóm xe đã được gán cho người dùng được chọn */
  loadAssignedGroups(userId: string): void {
    this.isLoading = true;
    this.vehicleGroupService.listAssignedVehicleGroups(userId).subscribe({
      next: (response: ResponseSingleContentModel<Group[]>) => {
        if (response.statusCode === 200) {
          this.assignedGroups = response.data || [];
          this.originalAssignedGroups = [...this.assignedGroups];
          this.filteredAssignedGroups = [...this.assignedGroups];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading assigned groups:', error);
        this.isLoading = false;
      }
    });
  }

  /* Public Methods - Chọn người dùng */
  /* Chọn người dùng và tải dữ liệu nhóm xe tương ứng */
  selectUser(user: AdminUser): void {
    this.selectedUser = user;
    this.selectedAvailableGroups = [];
    this.selectedAssignedGroups = [];
    this.hasUnsavedChanges = false;

    if (user.pkUserId) {
      this.loadAvailableGroups(user.pkUserId);
      this.loadAssignedGroups(user.pkUserId);
    }
  }

  /* Public Methods - Tìm kiếm */
  /* Tìm kiếm người dùng theo tên hoặc username */
  onUserSearch(): void {
    this.filteredUsers = this.users.filter(user =>
      user.fullname?.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(this.userSearchTerm.toLowerCase())
    );
  }

  /* Tìm kiếm nhóm xe có thể gán theo tên */
  onAvailableGroupSearch(): void {
    this.filteredAvailableGroups = this.availableGroups.filter(group =>
      group.name?.toLowerCase().includes(this.availableGroupSearchTerm.toLowerCase())
    );
  }

  /* Tìm kiếm nhóm xe đã gán theo tên */
  onAssignedGroupSearch(): void {
    this.filteredAssignedGroups = this.assignedGroups.filter(group =>
      group.name?.toLowerCase().includes(this.assignedGroupSearchTerm.toLowerCase())
    );
  }

  /* Public Methods - Quản lý lựa chọn nhóm xe có thể gán */
  /* Kiểm tra xem tất cả nhóm xe có thể gán đã được chọn chưa */
  isAllAvailableSelected(): boolean {
    return this.filteredAvailableGroups.length > 0 &&
      this.filteredAvailableGroups.every(group =>
        this.selectedAvailableGroups.includes(group.pkVehicleGroupId)
      );
  }

  /* Chọn/bỏ chọn tất cả nhóm xe có thể gán */
  toggleAllAvailable(event: any): void {
    if (event.target.checked) {
      this.selectedAvailableGroups = this.filteredAvailableGroups.map(group => group.pkVehicleGroupId);
    } else {
      this.selectedAvailableGroups = [];
    }
  }

  /* Kiểm tra xem một nhóm xe có thể gán đã được chọn chưa */
  isAvailableGroupSelected(groupId: number): boolean {
    return this.selectedAvailableGroups.includes(groupId);
  }

  /* Chọn/bỏ chọn một nhóm xe có thể gán */
  toggleAvailableGroup(groupId: number, event: any): void {
    if (event.target.checked) {
      this.selectedAvailableGroups.push(groupId);
    } else {
      this.selectedAvailableGroups = this.selectedAvailableGroups.filter(id => id !== groupId);
    }
  }

  /* Public Methods - Quản lý lựa chọn nhóm xe đã gán */
  /* Kiểm tra xem tất cả nhóm xe đã gán đã được chọn chưa */
  isAllAssignedSelected(): boolean {
    return this.filteredAssignedGroups.length > 0 &&
      this.filteredAssignedGroups.every(group =>
        this.selectedAssignedGroups.includes(group.pkVehicleGroupId)
      );
  }

  /* Chọn/bỏ chọn tất cả nhóm xe đã gán */
  toggleAllAssigned(event: any): void {
    if (event.target.checked) {
      this.selectedAssignedGroups = this.filteredAssignedGroups.map(group => group.pkVehicleGroupId);
    } else {
      this.selectedAssignedGroups = [];
    }
  }

  /* Kiểm tra xem một nhóm xe đã gán đã được chọn chưa */
  isAssignedGroupSelected(groupId: number): boolean {
    return this.selectedAssignedGroups.includes(groupId);
  }

  /* Chọn/bỏ chọn một nhóm xe đã gán */
  toggleAssignedGroup(groupId: number, event: any): void {
    if (event.target.checked) {
      this.selectedAssignedGroups.push(groupId);
    } else {
      this.selectedAssignedGroups = this.selectedAssignedGroups.filter(id => id !== groupId);
    }
  }

  /* Public Methods - Hành động gán/hủy gán */
  /* Gán nhóm xe cho người dùng (chỉ thay đổi UI) */
  assignGroups(): void {
    if (!this.selectedUser || this.selectedAvailableGroups.length === 0) return;

    /* Di chuyển nhóm xe từ danh sách có thể gán sang danh sách đã gán (chỉ UI) */
    const groupsToMove = this.availableGroups.filter(group =>
      this.selectedAvailableGroups.includes(group.pkVehicleGroupId)
    );

    this.assignedGroups.push(...groupsToMove);
    this.availableGroups = this.availableGroups.filter(group =>
      !this.selectedAvailableGroups.includes(group.pkVehicleGroupId)
    );

    this.updateFilteredLists();
    this.selectedAvailableGroups = [];
    this.hasUnsavedChanges = true;
  }

  /* Hủy gán nhóm xe cho người dùng (chỉ thay đổi UI) */
  unassignGroups(): void {
    if (!this.selectedUser || this.selectedAssignedGroups.length === 0) return;

    /* Di chuyển nhóm xe từ danh sách đã gán sang danh sách có thể gán (chỉ UI) */
    const groupsToMove = this.assignedGroups.filter(group =>
      this.selectedAssignedGroups.includes(group.pkVehicleGroupId)
    );

    this.availableGroups.push(...groupsToMove);
    this.assignedGroups = this.assignedGroups.filter(group =>
      !this.selectedAssignedGroups.includes(group.pkVehicleGroupId)
    );

    this.updateFilteredLists();
    this.selectedAssignedGroups = [];
    this.hasUnsavedChanges = true;
  }

  /* Public Methods - Lưu và hủy thay đổi */
  /* Kiểm tra xem có thay đổi chưa lưu hay không */
  hasChanges(): boolean {
    return this.hasUnsavedChanges;
  }

  /* Lưu các thay đổi vào database */
  saveChanges(): void {
    if (!this.selectedUser || !this.hasUnsavedChanges) return;

    this.isLoading = true;

    /* Tìm các nhóm xe đã được di chuyển từ có thể gán sang đã gán */
    const groupsToAssign = this.originalAvailableGroups.filter(group =>
      !this.availableGroups.some(current => current.pkVehicleGroupId === group.pkVehicleGroupId)
    );

    /* Tìm các nhóm xe đã được di chuyển từ đã gán sang có thể gán */
    const groupsToUnassign = this.originalAssignedGroups.filter(group =>
      !this.assignedGroups.some(current => current.pkVehicleGroupId === group.pkVehicleGroupId)
    );

    /* Gọi API để lưu thay đổi */
    const assignPromise = groupsToAssign.length > 0 ?
      this.vehicleGroupService.assignVehicleGroups({
        userId: this.selectedUser.pkUserId,
        vehicleGroupIds: groupsToAssign.map(g => g.pkVehicleGroupId)
      }).toPromise() : Promise.resolve();

    const unassignPromise = groupsToUnassign.length > 0 ?
      this.vehicleGroupService.unassignVehicleGroups({
        userId: this.selectedUser.pkUserId,
        vehicleGroupIds: groupsToUnassign.map(g => g.pkVehicleGroupId)
      }).toPromise() : Promise.resolve();

    Promise.all([assignPromise, unassignPromise]).then(() => {
      /* Cập nhật dữ liệu gốc sau khi lưu thành công */
      this.originalAvailableGroups = [...this.availableGroups];
      this.originalAssignedGroups = [...this.assignedGroups];

      /* Hiển thị thông báo thành công */
      this.showToast();
      this.hasUnsavedChanges = false;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error saving changes:', error);
      this.isLoading = false;
    });
  }

  /* Hủy bỏ các thay đổi chưa lưu */
  cancelChanges(): void {
    if (!this.hasUnsavedChanges) return;

    /* Hiển thị hộp thoại xác nhận */
    if (confirm('Bạn có chắc chắn muốn hủy bỏ các thay đổi chưa lưu?')) {
      /* Khôi phục về dữ liệu gốc */
      this.availableGroups = [...this.originalAvailableGroups];
      this.assignedGroups = [...this.originalAssignedGroups];

      this.updateFilteredLists();
      this.selectedAvailableGroups = [];
      this.selectedAssignedGroups = [];
      this.hasUnsavedChanges = false;
    }
  }

  /* Public Methods - Cấu trúc cây */
  /* Lấy danh sách các nhóm cha (không có parentVehicleGroupId) */
  getParentGroups(groups: Group[]): Group[] {
    return groups.filter(group => !group.parentVehicleGroupId);
  }

  /* Lấy danh sách các nhóm con của một nhóm cha */
  getChildGroups(parentId: number, groups: Group[]): Group[] {
    return groups.filter(group => group.parentVehicleGroupId === parentId);
  }

  /* Kiểm tra xem một nhóm có nhóm con hay không */
  hasChildren(groupId: number, groups: Group[]): boolean {
    return groups.some(group => group.parentVehicleGroupId === groupId);
  }

  /* Kiểm tra xem một nhóm đã được mở rộng hay chưa */
  isExpanded(groupId: number): boolean {
    return this.expandedGroups.has(groupId);
  }

  /* Chuyển đổi trạng thái mở rộng/thu gọn của một nhóm */
  toggleExpand(groupId: number): void {
    if (this.expandedGroups.has(groupId)) {
      this.expandedGroups.delete(groupId);
    } else {
      this.expandedGroups.add(groupId);
    }
  }

  /* Private Methods - Các phương thức hỗ trợ */
  /* Cập nhật danh sách đã lọc sau khi thay đổi */
  private updateFilteredLists(): void {
    this.onAvailableGroupSearch();
    this.onAssignedGroupSearch();
  }

  /* Hiển thị thông báo thành công */
  private showToast(): void {
    const toastElement = document.getElementById('saveToast');
    if (toastElement) {
      /* Hiển thị toast thủ công */
      toastElement.classList.add('show');
      toastElement.style.display = 'block';

      /* Tự động ẩn sau 3 giây */
      setTimeout(() => {
        toastElement.classList.remove('show');
        setTimeout(() => {
          toastElement.style.display = 'none';
        }, 300);
      }, 3000);
    }
  }
}