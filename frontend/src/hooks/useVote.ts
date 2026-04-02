import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { pollDetailQueryKey } from '@/hooks/usePollDetail';
import type { Post, VotePayload, VoteResponse } from '@/types/api';

interface VoteVariables {
  selectNum: number;
}

function getNormalizedVotes(votes: number | undefined) {
  return Math.max(votes ?? 0, 0);
}

function createOptimisticPost(post: Post, selectNum: number): Post {
  return {
    ...post,
    voted: true,
    selected_num: selectNum,
    total: post.total + 1,
    options: post.options.map((option) => ({
      ...option,
      votes:
        getNormalizedVotes(option.votes) + (option.select_num === selectNum ? 1 : 0),
    })),
  };
}

function mergeVoteResponse(post: Post, response: VoteResponse) {
  const votesByOption = new Map(
    response.options.map((option) => [option.select_num, option.votes]),
  );

  return {
    ...post,
    voted: true,
    selected_num: response.selected_num,
    total: response.total,
    options: post.options.map((option) => ({
      ...option,
      votes: votesByOption.get(option.select_num) ?? getNormalizedVotes(option.votes),
    })),
  };
}

export function useVote(postId: string) {
  const queryClient = useQueryClient();
  const queryKey = pollDetailQueryKey(postId);

  return useMutation({
    mutationFn: ({ selectNum }: VoteVariables) =>
      apiClient.post<VoteResponse>(`/api/v1/posts/${postId}/polls`, {
        option: {
          select_num: selectNum,
        },
      } satisfies VotePayload),
    onMutate: async ({ selectNum }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousPost = queryClient.getQueryData<Post>(queryKey);

      if (previousPost) {
        queryClient.setQueryData(queryKey, createOptimisticPost(previousPost, selectNum));
      }

      return { previousPost };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(queryKey, context.previousPost);
      }
    },
    onSuccess: (response) => {
      const currentPost = queryClient.getQueryData<Post>(queryKey);

      if (currentPost) {
        queryClient.setQueryData(queryKey, mergeVoteResponse(currentPost, response));
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}
