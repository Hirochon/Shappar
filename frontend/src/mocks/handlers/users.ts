import { HttpResponse, http } from 'msw';
import {
  getMockUserPostedPosts,
  getMockUserProfile,
  getMockUserVotedPosts,
} from '@/mocks/poll-data';

const API_BASE_URL = 'http://localhost:8040';

export const userHandlers = [
  http.get(`${API_BASE_URL}/api/v1/users/:userId`, ({ params }) => {
    return HttpResponse.json(getMockUserProfile(String(params.userId)));
  }),
  http.get(`${API_BASE_URL}/api/v1/users/:userId/posted`, ({ params }) => {
    return HttpResponse.json({
      posts: getMockUserPostedPosts(String(params.userId)),
    });
  }),
  http.get(`${API_BASE_URL}/api/v1/users/:userId/voted`, ({ params }) => {
    return HttpResponse.json({
      posts: getMockUserVotedPosts(String(params.userId)),
    });
  }),
];
