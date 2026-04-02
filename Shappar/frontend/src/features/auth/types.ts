export interface AuthUser {
  unique_id: string;
  user_id: string;
  name: string;
  introduction: string;
  iconimage: string;
  homeimage: string;
}

export interface NestedAuthResponse {
  user: AuthUser;
}

export type AuthResponse = AuthUser | NestedAuthResponse;

export function extractAuthUser(response: AuthResponse): AuthUser {
  if ('user' in response) {
    return response.user;
  }

  return response;
}
