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
    groups: [] as string[],
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

  toggleUserSelection(userId: number): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
    this.allSelected = this.selectedUsers.size === this.users.length;
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
        this.loadUsers();
        this.selectedUsers.delete(userId);
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

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.has(userId);
  }

  toggleSelectUser(userId: number): void {
    this.toggleUserSelection(userId);
  }
}
