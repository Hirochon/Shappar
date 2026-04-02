import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  CreatePostRequest,
  CreatePostResponse,
} from '@/types/api';

export function useCreatePoll() {
  return useMutation({
    mutationFn: async (payload: CreatePostRequest) => {
      return apiClient.post<CreatePostResponse>('/api/v1/posts', payload);
    },
  });
}
