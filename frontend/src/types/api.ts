export interface PostOption {
  select_num: number;
  answer: string;
  votes: number;
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

export interface User {
  user_id: string;
  name: string;
  introduction: string;
  homeImage: string;
  iconimage: string;
  followers: number;
  follow: number;
  followed: boolean;
}
