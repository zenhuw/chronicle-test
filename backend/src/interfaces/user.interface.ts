export interface UsersGetQuery {
  email: string;
  current_page: number;
  take: number;
  cache: boolean;
}

export interface UserPutBody {
  first_name: string;
  last_name: string;
  sex: string;
  date_of_birth: string;
  address: string;
}
