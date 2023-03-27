export interface UserRegisterRequest {
  first_name: string;
  last_name?: string;
  sex: string;
  date_of_birth: string;
  address?: string;
  email: string;
  password: string;
}

export interface UserListRequest {
  email?: string;
  current_page: number;
  take: number;
  cache?: boolean;
}

export interface UserListResponse {
  data: [User];
  total: number;
}

export interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
  sex?: string;
  date_of_birth?: string;
  address?: string;
  email?: string;
}
