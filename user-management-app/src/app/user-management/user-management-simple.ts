import { Component, OnInit } from '@angular/core';
import { User, Group } from '../models/user.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  groups: Group[] = [];
  selectedUsers: Set<number> = new Set();
  allSelected = false;
  showCreateModal = false;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  paginatedUsers: User[] = [];

  // Notification properties
  notifications: Array<{id: number, message: string, type: 'success' | 'error', timestamp: number}> = [];
  private notificationId = 0;

  newUser = {
    name: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
    groups: [] as string[],
    joinDate: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  loadGroups(): void {
    this.userService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      // Select all users on current page
      this.paginatedUsers.forEach(user => this.selectedUsers.add(user.id));
    } else {
      // Deselect all users on current page
      this.paginatedUsers.forEach(user => this.selectedUsers.delete(user.id));
    }
    this.updateSelectAllState();
  }

  updateSelectAllState(): void {
    const currentPageUserIds = this.paginatedUsers.map(user => user.id);
    const selectedOnCurrentPage = currentPageUserIds.filter(id => this.selectedUsers.has(id)).length;
    this.allSelected = selectedOnCurrentPage === currentPageUserIds.length && currentPageUserIds.length > 0;
  }

  toggleUserSelection(userId: number): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
    this.updateSelectAllState();
  }

  activateUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    const userName = user ? user.name : `User ${userId}`;
    
    this.userService.updateUserStatus(userId, 'active').subscribe({
      next: (success) => {
        if (success) {
          this.loadUsers();
          this.showSuccessNotification(`Successfully activated ${userName}`);
        } else {
          this.showErrorNotification(`Failed to activate ${userName}`);
        }
      },
      error: (error) => {
        this.showErrorNotification(`Error activating ${userName}: ${error.message || 'Unknown error'}`);
      }
    });
  }

  deactivateUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    const userName = user ? user.name : `User ${userId}`;
    
    this.userService.updateUserStatus(userId, 'inactive').subscribe({
      next: (success) => {
        if (success) {
          this.loadUsers();
          this.showSuccessNotification(`Successfully deactivated ${userName}`);
        } else {
          this.showErrorNotification(`Failed to deactivate ${userName}`);
        }
      },
      error: (error) => {
        this.showErrorNotification(`Error deactivating ${userName}: ${error.message || 'Unknown error'}`);
      }
    });
  }

  assignUserToGroup(userId: number, groupName: string): void {
    const user = this.users.find(u => u.id === userId);
    const userName = user ? user.name : `User ${userId}`;
    
    // Determine action before the update (since updateUserGroup toggles membership)
    const wasInGroup = user && user.groups.includes(groupName);
    
    this.userService.updateUserGroup(userId, groupName).subscribe({
      next: (success) => {
        if (success) {
          this.loadUsers();
          if (wasInGroup) {
            this.showSuccessNotification(`Successfully removed ${userName} from ${groupName} group`);
          } else {
            this.showSuccessNotification(`Successfully added ${userName} to ${groupName} group`);
          }
        } else {
          this.showErrorNotification(`Failed to update group assignment for ${userName}`);
        }
      },
      error: (error) => {
        this.showErrorNotification(`Error updating group assignment for ${userName}: ${error.message || 'Unknown error'}`);
      }
    });
  }

  updateUserGroups(userId: number, groups: string[]): void {
    const user = this.users.find(u => u.id === userId);
    const userName = user ? user.name : `User ${userId}`;
    
    this.userService.updateUserGroups(userId, groups).subscribe({
      next: (success) => {
        if (success) {
          this.loadUsers();
          this.showSuccessNotification(`Successfully updated group assignments for ${userName}`);
        } else {
          this.showErrorNotification(`Failed to update group assignments for ${userName}`);
        }
      },
      error: (error) => {
        this.showErrorNotification(`Error updating group assignments for ${userName}: ${error.message || 'Unknown error'}`);
      }
    });
  }

  isUserInGroup(user: User, groupName: string): boolean {
    return user.groups.includes(groupName);
  }

  toggleUserGroup(user: User, groupName: string): void {
    this.assignUserToGroup(user.id, groupName);
  }

  toggleNewUserGroup(groupName: string, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.newUser.groups.includes(groupName)) {
        this.newUser.groups.push(groupName);
      }
    } else {
      this.newUser.groups = this.newUser.groups.filter(g => g !== groupName);
    }
  }

  deleteUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    const userName = user ? user.name : `User ${userId}`;
    
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      this.userService.deleteUser(userId).subscribe({
        next: (success) => {
          if (success) {
            this.selectedUsers.delete(userId);
            this.loadUsers();
            this.showSuccessNotification(`Successfully deleted ${userName}`);
          } else {
            this.showErrorNotification(`Failed to delete ${userName}`);
          }
        },
        error: (error) => {
          this.showErrorNotification(`Error deleting ${userName}: ${error.message || 'Unknown error'}`);
        }
      });
    }
  }

  deleteSelectedUsers(): void {
    if (this.selectedUsers.size === 0) return;
    
    const count = this.selectedUsers.size;
    if (confirm(`Are you sure you want to delete ${count} selected user(s)?`)) {
      const userIds = Array.from(this.selectedUsers);
      let deletedCount = 0;
      let errorCount = 0;
      
      userIds.forEach(userId => {
        const user = this.users.find(u => u.id === userId);
        const userName = user ? user.name : `User ${userId}`;
        
        this.userService.deleteUser(userId).subscribe({
          next: (success) => {
            if (success) {
              deletedCount++;
              this.selectedUsers.delete(userId);
            } else {
              errorCount++;
            }
            
            // Check if all deletions are complete
            if (deletedCount + errorCount === userIds.length) {
              this.loadUsers();
              if (deletedCount > 0) {
                this.showSuccessNotification(`Successfully deleted ${deletedCount} user(s)`);
              }
              if (errorCount > 0) {
                this.showErrorNotification(`Failed to delete ${errorCount} user(s)`);
              }
            }
          },
          error: (error) => {
            errorCount++;
            if (deletedCount + errorCount === userIds.length) {
              this.loadUsers();
              if (deletedCount > 0) {
                this.showSuccessNotification(`Successfully deleted ${deletedCount} user(s)`);
              }
              this.showErrorNotification(`Failed to delete ${errorCount} user(s)`);
            }
          }
        });
      });
    }
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.resetNewUser();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetNewUser();
  }

  resetNewUser(): void {
    this.newUser = {
      name: '',
      email: '',
      status: 'active',
      groups: this.groups.length > 0 ? [this.groups[0].name] : [],
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email) {
      this.showErrorNotification('Please fill in all required fields (Name and Email)');
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: (user) => {
        this.loadUsers();
        this.closeCreateModal();
        this.showSuccessNotification(`Successfully created user: ${user.name}`);
      },
      error: (error) => {
        this.showErrorNotification(`Error creating user: ${error.message || 'Unknown error'}`);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.has(userId);
  }

  toggleSelectUser(userId: number): void {
    this.toggleUserSelection(userId);
  }

  // Helper method for template
  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Notification methods
  showNotification(message: string, type: 'success' | 'error'): void {
    const notification = {
      id: ++this.notificationId,
      message: message,
      type: type,
      timestamp: Date.now()
    };
    this.notifications.push(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  showSuccessNotification(message: string): void {
    this.showNotification(message, 'success');
  }

  showErrorNotification(message: string): void {
    this.showNotification(message, 'error');
  }
}
