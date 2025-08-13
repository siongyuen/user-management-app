import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, Group } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'active',
      group: 'Administrators',
      role: 'Admin',
      joinDate: '2023-01-15',
      lastLogin: '2024-08-13 09:30:00',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=007bff&color=fff'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      status: 'active',
      group: 'Developers',
      role: 'Senior Developer',
      joinDate: '2023-02-20',
      lastLogin: '2024-08-12 16:45:00',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=28a745&color=fff'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      status: 'inactive',
      group: 'Support',
      role: 'Support Agent',
      joinDate: '2023-03-10',
      lastLogin: '2024-08-10 14:20:00',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=dc3545&color=fff'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      status: 'active',
      group: 'Developers',
      role: 'Frontend Developer',
      joinDate: '2023-04-05',
      lastLogin: '2024-08-13 08:15:00',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=ffc107&color=000'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      status: 'active',
      group: 'Administrators',
      role: 'System Admin',
      joinDate: '2023-05-12',
      lastLogin: '2024-08-13 07:00:00',
      avatar: 'https://ui-avatars.com/api/?name=David+Brown&background=6f42c1&color=fff'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      status: 'inactive',
      group: 'Support',
      role: 'Customer Success',
      joinDate: '2023-06-18',
      lastLogin: '2024-08-09 12:30:00',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=e83e8c&color=fff'
    },
    {
      id: 7,
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      status: 'active',
      group: 'Developers',
      role: 'Backend Developer',
      joinDate: '2023-07-22',
      lastLogin: '2024-08-13 10:45:00',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=20c997&color=fff'
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      status: 'active',
      group: 'Administrators',
      role: 'Project Manager',
      joinDate: '2023-08-30',
      lastLogin: '2024-08-13 11:20:00',
      avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=fd7e14&color=fff'
    },
    {
      id: 9,
      name: 'Chris Martinez',
      email: 'chris.martinez@example.com',
      status: 'active',
      group: 'Support',
      role: 'Technical Support',
      joinDate: '2023-09-14',
      lastLogin: '2024-08-12 17:30:00',
      avatar: 'https://ui-avatars.com/api/?name=Chris+Martinez&background=6610f2&color=fff'
    },
    {
      id: 10,
      name: 'Amanda White',
      email: 'amanda.white@example.com',
      status: 'inactive',
      group: 'Developers',
      role: 'UI/UX Designer',
      joinDate: '2023-10-08',
      lastLogin: '2024-08-11 13:15:00',
      avatar: 'https://ui-avatars.com/api/?name=Amanda+White&background=d63384&color=fff'
    },
    {
      id: 11,
      name: 'Kevin Garcia',
      email: 'kevin.garcia@example.com',
      status: 'active',
      group: 'Developers',
      role: 'Full Stack Developer',
      joinDate: '2023-11-20',
      lastLogin: '2024-08-13 09:00:00',
      avatar: 'https://ui-avatars.com/api/?name=Kevin+Garcia&background=198754&color=fff'
    },
    {
      id: 12,
      name: 'Michelle Lee',
      email: 'michelle.lee@example.com',
      status: 'active',
      group: 'Support',
      role: 'Quality Assurance',
      joinDate: '2023-12-03',
      lastLogin: '2024-08-13 08:45:00',
      avatar: 'https://ui-avatars.com/api/?name=Michelle+Lee&background=0dcaf0&color=000'
    }
  ];

  private groups: Group[] = [
    {
      id: 1,
      name: 'Administrators',
      description: 'System administrators with full access'
    },
    {
      id: 2,
      name: 'Developers',
      description: 'Development team members'
    },
    {
      id: 3,
      name: 'Support',
      description: 'Customer support and QA team'
    }
  ];

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getGroups(): Observable<Group[]> {
    return of(this.groups);
  }

  updateUserStatus(userId: number, status: 'active' | 'inactive'): Observable<boolean> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = status;
      return of(true);
    }
    return of(false);
  }

  updateUserGroup(userId: number, groupName: string): Observable<boolean> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.group = groupName;
      return of(true);
    }
    return of(false);
  }

  deleteUser(userId: number): Observable<boolean> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index > -1) {
      this.users.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: Math.max(...this.users.map(u => u.id)) + 1,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=007bff&color=fff`
    };
    this.users.push(newUser);
    return of(newUser);
  }
}
