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

  // Original data for comparison
  private originalAvailableGroups: Group[] = [];
  private originalAssignedGroups: Group[] = [];

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

  // Load assigned groups for selected user
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

  // Assignment actions - chỉ di chuyển UI, chưa lưu database
  assignGroups(): void {
    if (!this.selectedUser || this.selectedAvailableGroups.length === 0) return;

    // Move groups from available to assigned (UI only)
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

  unassignGroups(): void {
    if (!this.selectedUser || this.selectedAssignedGroups.length === 0) return;

    // Move groups from assigned to available (UI only)
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

    this.isLoading = true;

    // Find groups that were moved from available to assigned
    const groupsToAssign = this.originalAvailableGroups.filter(group =>
      !this.availableGroups.some(current => current.pkVehicleGroupId === group.pkVehicleGroupId)
    );

    // Find groups that were moved from assigned to available  
    const groupsToUnassign = this.originalAssignedGroups.filter(group =>
      !this.assignedGroups.some(current => current.pkVehicleGroupId === group.pkVehicleGroupId)
    );

    // Call APIs to save changes
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
      // Update original data after successful save
      this.originalAvailableGroups = [...this.availableGroups];
      this.originalAssignedGroups = [...this.assignedGroups];

      // Show success toast
      this.showToast();
      this.hasUnsavedChanges = false;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error saving changes:', error);
      this.isLoading = false;
    });
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
      // Reset to original data
      this.availableGroups = [...this.originalAvailableGroups];
      this.assignedGroups = [...this.originalAssignedGroups];

      this.updateFilteredLists();
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
