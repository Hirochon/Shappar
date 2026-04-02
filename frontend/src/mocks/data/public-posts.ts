import type { Post } from '@/types/api';

const baseTimestamp = Date.UTC(2026, 3, 2, 12, 0, 0);

export const publicPosts: Post[] = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;
  const voted = number % 3 === 0;

  return {
    post_id: `mock-post-${number}`,
    user_id: `creator_${number}`,
    iconimage: `https://example.com/avatar-${number}.png`,
    question: `週末に撮りたいテーマ ${number} は？`,
    voted,
    options: [
      {
        select_num: 0,
        answer: '街歩き',
        votes: voted ? 8 + number : -1,
      },
      {
        select_num: 1,
        answer: '自然風景',
        votes: voted ? 4 + number : -1,
      },
      {
        select_num: 2,
        answer: 'カフェ',
        votes: voted ? 2 + number : -1,
      },
    ],
    created_at: new Date(baseTimestamp - index * 1000 * 60 * 35).toISOString(),
    selected_num: voted ? number % 3 : -1,
    total: voted ? 14 + number : 0,
  };
});

export function getPublicPostsPage(
  sourcePosts: Post[],
  pid: string | null,
  query: string | null,
  pageSize = 10,
) {
  const trimmedQuery = query?.trim() ?? '';
  const filteredPosts = trimmedQuery
    ? sourcePosts.filter((post) => post.question.includes(trimmedQuery))
    : sourcePosts;

  if (!pid) {
    return filteredPosts.slice(0, pageSize);
  }

  const basisIndex = filteredPosts.findIndex((post) => post.post_id === pid);

  if (basisIndex === -1) {
    return null;
  }

  return filteredPosts.slice(basisIndex + 1, basisIndex + 1 + pageSize);
}
