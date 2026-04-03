export interface PostOption {
  select_num: number;
  answer: string;
  votes: number;
}

export interface CreatePostOptionRequest {
  answer: string;
}

export interface CreatePostRequest {
  question: string;
  options: CreatePostOptionRequest[];
}

export interface CreatePostResponse {
  post_id: string;
}

export interface Post {
  post_id: string;
  user_id: string;
  iconimage: string;
  question: string;
  voted: boolean;
  options: PostOption[];
  created_at: string;
  selected_num: number;
  total: number;
}

export interface User {
  unique_id?: string;
  user_id: string;
  name: string;
  introduction: string;
  homeimage?: string;
  homeImage?: string;
  iconimage: string;
  followers?: number;
  follow?: number;
  followed?: boolean;
}

export interface UserPostsResponse {
  posts: Post[];
}

export interface UserProfile extends User {
  postedCount: number;
  votedCount: number;
}

export interface VoteOption {
  select_num: number;
  votes: number;
}

export interface VotePayload {
  option: {
    select_num: number;
  };
}

export interface VoteResponse {
  options: VoteOption[];
  selected_num: number;
  total: number;
}
