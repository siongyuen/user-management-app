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

  newUser = {
    name: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
    group: '',
    role: '',
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
    });
  }

  loadGroups(): void {
    this.userService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.selectedUsers = new Set(this.users.map(user => user.id));
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
    this.allSelected = this.selectedUsers.size === this.users.length && this.users.length > 0;
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.has(userId);
  }

  activateUser(userId: number): void {
    this.userService.updateUserStatus(userId, 'active').subscribe(success => {
      if (success) {
        this.loadUsers();
      }
    });
  }

  deactivateUser(userId: number): void {
    this.userService.updateUserStatus(userId, 'inactive').subscribe(success => {
      if (success) {
        this.loadUsers();
      }
    });
  }

  assignUserToGroup(userId: number, groupName: string): void {
    this.userService.updateUserGroup(userId, groupName).subscribe(success => {
      if (success) {
        this.loadUsers();
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(success => {
        if (success) {
          this.selectedUsers.delete(userId);
          this.loadUsers();
          this.updateSelectAllState();
        }
      });
    }
  }

  deleteSelectedUsers(): void {
    if (this.selectedUsers.size === 0) {
      alert('Please select users to delete.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedUsers.size} selected user(s)?`)) {
      const userIds = Array.from(this.selectedUsers);
      userIds.forEach(userId => {
        this.userService.deleteUser(userId).subscribe();
      });
      this.selectedUsers.clear();
      this.loadUsers();
      this.updateSelectAllState();
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
      group: this.groups.length > 0 ? this.groups[0].name : '',
      role: '',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.role) {
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
}