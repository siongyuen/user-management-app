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
    this.userService.updateUserStatus(userId, 'active').subscribe(() => {
      this.loadUsers();
    });
  }

  deactivateUser(userId: number): void {
    this.userService.updateUserStatus(userId, 'inactive').subscribe(() => {
      this.loadUsers();
    });
  }

  assignUserToGroup(userId: number, groupName: string): void {
    this.userService.updateUserGroup(userId, groupName).subscribe(() => {
      this.loadUsers();
    });
  }

  updateUserGroups(userId: number, groups: string[]): void {
    this.userService.updateUserGroups(userId, groups).subscribe(() => {
      this.loadUsers();
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
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.selectedUsers.delete(userId);
        this.loadUsers();
      });
    }
  }

  deleteSelectedUsers(): void {
    if (this.selectedUsers.size === 0) return;
    
    const count = this.selectedUsers.size;
    if (confirm(`Are you sure you want to delete ${count} selected user(s)?`)) {
      const userIds = Array.from(this.selectedUsers);
      userIds.forEach(userId => {
        this.userService.deleteUser(userId).subscribe(() => {
          this.selectedUsers.delete(userId);
          if (this.selectedUsers.size === 0) {
            this.loadUsers();
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
      alert('Please fill in all required fields.');
      return;
    }

    this.userService.createUser(this.newUser).subscribe(user => {
      this.loadUsers();
      this.closeCreateModal();
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
}
