export interface AuthUser {
  unique_id: string;
  user_id: string;
  name: string;
  introduction: string;
  iconimage: string;
  homeimage: string;
}

export interface AuthResponse {
  user: AuthUser;
}
