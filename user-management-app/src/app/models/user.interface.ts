export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  groups: string[]; // Changed to support multiple groups
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