import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleGroupService } from '../../../../core/service/vehicle-group.service';
import { AdminUser, AssignVehicleGroupRequest, Group, ResponseSingleContentModel } from '../../../../core/interface';


@Component({
  selector: 'app-vehicle-group-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [VehicleGroupService],
  templateUrl: './vehicle-group-management.component.html',
  styleUrl: './vehicle-group-management.component.scss'
})
export class VehicleGroupManagementComponent implements OnInit {
  // Data arrays
  users: AdminUser[] = [];
  availableGroups: Group[] = [];
  assignedGroups: Group[] = [];

  // Filtered arrays for display
  filteredUsers: AdminUser[] = [];
  filteredAvailableGroups: Group[] = [];
  filteredAssignedGroups: Group[] = [];

  // Search terms
  userSearchTerm: string = '';
  availableGroupSearchTerm: string = '';
  assignedGroupSearchTerm: string = '';

  // Selected items
  selectedUser: AdminUser | null = null;
  selectedAvailableGroups: number[] = [];
  selectedAssignedGroups: number[] = [];

  // State management
  hasUnsavedChanges: boolean = false;
  isLoading: boolean = false;

  private vehicleGroupService = inject(VehicleGroupService);

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load users
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

  // Load available groups for selected user
  loadAvailableGroups(userId: string): void {
    this.isLoading = true;
    this.vehicleGroupService.listAvailableVehicleGroups(userId).subscribe({
      next: (response: ResponseSingleContentModel<Group[]>) => {
        if (response.statusCode === 200) {
          this.availableGroups = response.data || [];
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

  // Load assigned groups for selected user
  loadAssignedGroups(userId: string): void {
    this.isLoading = true;
    this.vehicleGroupService.listAssignedVehicleGroups(userId).subscribe({
      next: (response: ResponseSingleContentModel<Group[]>) => {
        if (response.statusCode === 200) {
          this.assignedGroups = response.data || [];
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

  // User selection
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

  // Search functions
  onUserSearch(): void {
    this.filteredUsers = this.users.filter(user =>
      user.fullname?.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(this.userSearchTerm.toLowerCase())
    );
  }

  onAvailableGroupSearch(): void {
    this.filteredAvailableGroups = this.availableGroups.filter(group =>
      group.name?.toLowerCase().includes(this.availableGroupSearchTerm.toLowerCase())
    );
  }

  onAssignedGroupSearch(): void {
    this.filteredAssignedGroups = this.assignedGroups.filter(group =>
      group.name?.toLowerCase().includes(this.assignedGroupSearchTerm.toLowerCase())
    );
  }

  // Available groups selection
  isAllAvailableSelected(): boolean {
    return this.filteredAvailableGroups.length > 0 &&
      this.filteredAvailableGroups.every(group =>
        this.selectedAvailableGroups.includes(group.pkVehicleGroupId)
      );
  }

  toggleAllAvailable(event: any): void {
    if (event.target.checked) {
      this.selectedAvailableGroups = this.filteredAvailableGroups.map(group => group.pkVehicleGroupId);
    } else {
      this.selectedAvailableGroups = [];
    }
  }

  isAvailableGroupSelected(groupId: number): boolean {
    return this.selectedAvailableGroups.includes(groupId);
  }

  toggleAvailableGroup(groupId: number, event: any): void {
    if (event.target.checked) {
      this.selectedAvailableGroups.push(groupId);
    } else {
      this.selectedAvailableGroups = this.selectedAvailableGroups.filter(id => id !== groupId);
    }
  }

  // Assigned groups selection
  isAllAssignedSelected(): boolean {
    return this.filteredAssignedGroups.length > 0 &&
      this.filteredAssignedGroups.every(group =>
        this.selectedAssignedGroups.includes(group.pkVehicleGroupId)
      );
  }

  toggleAllAssigned(event: any): void {
    if (event.target.checked) {
      this.selectedAssignedGroups = this.filteredAssignedGroups.map(group => group.pkVehicleGroupId);
    } else {
      this.selectedAssignedGroups = [];
    }
  }

  isAssignedGroupSelected(groupId: number): boolean {
    return this.selectedAssignedGroups.includes(groupId);
  }

  toggleAssignedGroup(groupId: number, event: any): void {
    if (event.target.checked) {
      this.selectedAssignedGroups.push(groupId);
    } else {
      this.selectedAssignedGroups = this.selectedAssignedGroups.filter(id => id !== groupId);
    }
  }

  // Assignment actions
  assignGroups(): void {
    if (!this.selectedUser || this.selectedAvailableGroups.length === 0) return;

    const request: AssignVehicleGroupRequest = {
      userId: this.selectedUser.pkUserId,
      vehicleGroupIds: this.selectedAvailableGroups
    };

    this.vehicleGroupService.assignVehicleGroups(request).subscribe({
      next: (response: ResponseSingleContentModel<string>) => {
        if (response.statusCode === 200) {
          // Move groups from available to assigned
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
      },
      error: (error) => {
        console.error('Error assigning groups:', error);
      }
    });
  }

  unassignGroups(): void {
    if (!this.selectedUser || this.selectedAssignedGroups.length === 0) return;

    const request: AssignVehicleGroupRequest = {
      userId: this.selectedUser.pkUserId,
      vehicleGroupIds: this.selectedAssignedGroups
    };

    this.vehicleGroupService.unassignVehicleGroups(request).subscribe({
      next: (response: ResponseSingleContentModel<string>) => {
        if (response.statusCode === 200) {
          // Move groups from assigned to available
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
      },
      error: (error) => {
        console.error('Error unassigning groups:', error);
      }
    });
  }

  // Helper methods
  updateFilteredLists(): void {
    this.onAvailableGroupSearch();
    this.onAssignedGroupSearch();
  }

  hasChanges(): boolean {
    return this.hasUnsavedChanges;
  }

  saveChanges(): void {
    if (!this.selectedUser || !this.hasUnsavedChanges) return;

    // Show success toast
    this.showToast();
    this.hasUnsavedChanges = false;
    console.log('Changes saved successfully');
  }

  private showToast(): void {
    const toastElement = document.getElementById('saveToast');
    if (toastElement) {
      // Show toast manually
      toastElement.classList.add('show');
      toastElement.style.display = 'block';

      // Auto hide after 3 seconds
      setTimeout(() => {
        toastElement.classList.remove('show');
        setTimeout(() => {
          toastElement.style.display = 'none';
        }, 300);
      }, 3000);
    }
  }

  cancelChanges(): void {
    if (!this.hasUnsavedChanges) return;

    // Confirmation dialog
    if (confirm('Bạn có chắc chắn muốn hủy bỏ các thay đổi chưa lưu?')) {
      if (this.selectedUser) {
        this.loadAvailableGroups(this.selectedUser.pkUserId);
        this.loadAssignedGroups(this.selectedUser.pkUserId);
      }
      this.selectedAvailableGroups = [];
      this.selectedAssignedGroups = [];
      this.hasUnsavedChanges = false;
    }
  }

  // Tree structure methods
  private expandedGroups: Set<number> = new Set();

  getParentGroups(groups: Group[]): Group[] {
    return groups.filter(group => !group.parentVehicleGroupId);
  }

  getChildGroups(parentId: number, groups: Group[]): Group[] {
    return groups.filter(group => group.parentVehicleGroupId === parentId);
  }

  hasChildren(groupId: number, groups: Group[]): boolean {
    return groups.some(group => group.parentVehicleGroupId === groupId);
  }

  isExpanded(groupId: number): boolean {
    return this.expandedGroups.has(groupId);
  }

  toggleExpand(groupId: number): void {
    if (this.expandedGroups.has(groupId)) {
      this.expandedGroups.delete(groupId);
    } else {
      this.expandedGroups.add(groupId);
    }
  }
}
