export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  group: string;
  role: string;
  joinDate: string;
  lastLogin: string;
  avatar?: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
}