import { Component, OnInit } from '@angular/core';
import { User, Group } from '../models/user.interface';
import { UserService } from '../services/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

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
  totalPages = 1;
  paginatedUsers: User[] = [];

  // Notification properties
  notifications: Notification[] = [];
  private notificationId = 0;

  newUser = {
    name: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
    groups: [] as string[],
    joinDate: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  newUserGroups: Set<string> = new Set();

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

  loadGroups(): void {
    this.userService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updatePaginatedUsers();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.updatePaginatedUsers();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Notification methods
  showNotification(message: string, type: 'success' | 'error'): void {
    const notification: Notification = {
      id: ++this.notificationId,
      message,
      type
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

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.selectedUsers = new Set(this.paginatedUsers.map(user => user.id));
    } else {
      this.selectedUsers.clear();
    }
  }

  toggleSelectUser(userId: number): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
    this.updateSelectAllState();
  }

  updateSelectAllState(): void {
    this.allSelected = this.paginatedUsers.length > 0 && 
                      this.paginatedUsers.every(user => this.selectedUsers.has(user.id));
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.has(userId);
  }

  isUserInGroup(user: User, groupName: string): boolean {
    return user.groups.includes(groupName);
  }

  toggleUserGroup(user: User, groupName: string): void {
    this.assignUserToGroup(user.id, groupName);
  }

  activateUser(userId: number): void {
    this.userService.updateUserStatus(userId, 'active')
      .pipe(
        catchError(error => {
          this.showErrorNotification('Failed to activate user');
          return of(false);
        })
      )
      .subscribe(success => {
        if (success) {
          this.showSuccessNotification('User activated successfully');
          this.loadUsers();
        }
      });
  }

  deactivateUser(userId: number): void {
    this.userService.updateUserStatus(userId, 'inactive')
      .pipe(
        catchError(error => {
          this.showErrorNotification('Failed to deactivate user');
          return of(false);
        })
      )
      .subscribe(success => {
        if (success) {
          this.showSuccessNotification('User deactivated successfully');
          this.loadUsers();
        }
      });
  }

  assignUserToGroup(userId: number, groupName: string): void {
    this.userService.updateUserGroup(userId, groupName)
      .pipe(
        catchError(error => {
          this.showErrorNotification('Failed to update user group');
          return of(false);
        })
      )
      .subscribe(success => {
        if (success) {
          this.showSuccessNotification('User group updated successfully');
          this.loadUsers();
        }
      });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId)
        .pipe(
          catchError(error => {
            this.showErrorNotification('Failed to delete user');
            return of(false);
          })
        )
        .subscribe(success => {
          if (success) {
            this.showSuccessNotification('User deleted successfully');
            this.selectedUsers.delete(userId);
            this.loadUsers();
            this.updateSelectAllState();
          }
        });
    }
  }

  deleteSelectedUsers(): void {
    if (this.selectedUsers.size === 0) {
      this.showErrorNotification('Please select users to delete.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedUsers.size} selected user(s)?`)) {
      const userIds = Array.from(this.selectedUsers);
      let deletedCount = 0;
      let failedCount = 0;

      userIds.forEach(userId => {
        this.userService.deleteUser(userId)
          .pipe(
            catchError(error => {
              failedCount++;
              return of(false);
            })
          )
          .subscribe(success => {
            if (success) {
              deletedCount++;
            }
            
            // Check if all deletions are complete
            if (deletedCount + failedCount === userIds.length) {
              if (deletedCount > 0) {
                this.showSuccessNotification(`${deletedCount} user(s) deleted successfully`);
              }
              if (failedCount > 0) {
                this.showErrorNotification(`Failed to delete ${failedCount} user(s)`);
              }
              this.selectedUsers.clear();
              this.loadUsers();
              this.updateSelectAllState();
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
      groups: [],
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.newUserGroups.clear();
  }

  toggleNewUserGroup(groupName: string, event: any): void {
    if (event.target.checked) {
      this.newUserGroups.add(groupName);
    } else {
      this.newUserGroups.delete(groupName);
    }
  }

  isNewUserInGroup(groupName: string): boolean {
    return this.newUserGroups.has(groupName);
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email) {
      this.showErrorNotification('Please fill in all required fields.');
      return;
    }

    // Set the groups from the selected groups
    this.newUser.groups = Array.from(this.newUserGroups);

    this.userService.createUser(this.newUser)
      .pipe(
        catchError(error => {
          this.showErrorNotification('Failed to create user');
          return of(null);
        })
      )
      .subscribe(user => {
        if (user) {
          this.showSuccessNotification('User created successfully');
          this.loadUsers();
          this.closeCreateModal();
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
}