import type { Post, User, VoteResponse } from '@/types/api';

export const MOCK_AUTH_USER_ID = 'user-123';

const initialPollPosts: Record<string, Post> = {
  'post-unvoted': {
    post_id: 'post-unvoted',
    user_id: 'creator-001',
    iconimage: 'https://example.com/creator-001.png',
    question: '次にみんなで撮りに行くならどこ？',
    voted: false,
    options: [
      { select_num: 0, answer: '海辺', votes: -1 },
      { select_num: 1, answer: '駅前スナップ', votes: -1 },
      { select_num: 2, answer: '夜景スポット', votes: -1 },
    ],
    created_at: '2026-04-01T12:00:00.000Z',
    selected_num: -1,
    total: 0,
  },
  'post-voted': {
    post_id: 'post-voted',
    user_id: 'creator-002',
    iconimage: 'https://example.com/creator-002.png',
    question: '旅行先で撮りたいテーマは？',
    voted: true,
    options: [
      { select_num: 0, answer: '朝焼け', votes: 2 },
      { select_num: 1, answer: '街のディテール', votes: 4 },
      { select_num: 2, answer: 'ポートレート', votes: 2 },
    ],
    created_at: '2026-03-30T09:30:00.000Z',
    selected_num: 1,
    total: 8,
  },
  'post-owned': {
    post_id: 'post-owned',
    user_id: MOCK_AUTH_USER_ID,
    iconimage: 'https://example.com/user-123.png',
    question: '次のオフ会で最初に撮る 1 枚は？',
    voted: true,
    options: [
      { select_num: 0, answer: '集合写真', votes: 3 },
      { select_num: 1, answer: '料理', votes: 5 },
      { select_num: 2, answer: '会場の雰囲気', votes: 2 },
    ],
    created_at: '2026-03-28T18:45:00.000Z',
    selected_num: -1,
    total: 10,
  },
};

const initialUserProfiles: Record<string, User> = {
  [MOCK_AUTH_USER_ID]: {
    unique_id: 'unique-user-123',
    user_id: MOCK_AUTH_USER_ID,
    name: 'Shappar User',
    introduction: 'I love taking pictures with friends.',
    iconimage: 'https://example.com/icon.png',
    homeimage: 'https://example.com/home.png',
    followers: 12,
    follow: 7,
    followed: false,
  },
  'creator-001': {
    unique_id: 'unique-creator-001',
    user_id: 'creator-001',
    name: 'Creator 001',
    introduction: 'ロケーション探しが好きなフォトグラファーです。',
    iconimage: 'https://example.com/creator-001.png',
    homeimage: 'https://example.com/creator-001-home.png',
    followers: 18,
    follow: 6,
    followed: true,
  },
  'creator-002': {
    unique_id: 'unique-creator-002',
    user_id: 'creator-002',
    name: 'Creator 002',
    introduction: '街歩きスナップの投票をよく作っています。',
    iconimage: 'https://example.com/creator-002.png',
    homeimage: 'https://example.com/creator-002-home.png',
    followers: 21,
    follow: 9,
    followed: true,
  },
  'friend-001': {
    unique_id: 'unique-friend-001',
    user_id: 'friend-001',
    name: 'Friend 001',
    introduction: '週末はカメラを持って旅をしています。',
    iconimage: 'https://example.com/friend-001.png',
    homeimage: 'https://example.com/friend-001-home.png',
    followers: 5,
    follow: 11,
    followed: false,
  },
};

let pollPosts = structuredClone(initialPollPosts);
let createdPollCount = 0;

function clonePost(post: Post) {
  return structuredClone(post);
}

function cloneUserProfile(profile: User) {
  return structuredClone(profile);
}

function getNormalizedVotes(votes: number | undefined) {
  return Math.max(votes ?? 0, 0);
}

export function resetMockPollPosts() {
  pollPosts = structuredClone(initialPollPosts);
  createdPollCount = 0;
}

export function getMockPollPost(postId: string) {
  const post = pollPosts[postId];

  return post ? clonePost(post) : null;
}

export function getMockUserProfile(userId: string) {
  const profile = initialUserProfiles[userId];

  if (profile) {
    return cloneUserProfile(profile);
  }

  return {
    unique_id: `unique-${userId}`,
    user_id: userId,
    name: `${userId}さん`,
    introduction: '写真の記録を楽しんでいるユーザーです。',
    iconimage: `https://example.com/${userId}.png`,
    homeimage: `https://example.com/${userId}-home.png`,
    followers: 0,
    follow: 0,
    followed: userId !== MOCK_AUTH_USER_ID,
  };
}

export function getMockUserPostedPosts(userId: string) {
  return Object.values(pollPosts)
    .filter((post) => post.user_id === userId)
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .map((post) => clonePost(post));
}

export function getMockUserVotedPosts(userId: string) {
  if (userId !== MOCK_AUTH_USER_ID) {
    return [];
  }

  return Object.values(pollPosts)
    .filter(
      (post) => post.user_id !== userId && post.voted && post.selected_num >= 0,
    )
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .map((post) => clonePost(post));
}

export function createMockPollPost(
  question: string,
  options: Array<{ answer: string }>,
  postId?: string,
) {
  createdPollCount += 1;

  const resolvedPostId = postId ?? `mock-post-${createdPollCount}`;
  const createdPost: Post = {
    post_id: resolvedPostId,
    user_id: MOCK_AUTH_USER_ID,
    iconimage: 'https://example.com/user-123.png',
    question,
    voted: false,
    options: options.map((option, index) => ({
      select_num: index,
      answer: option.answer,
      votes: 0,
    })),
    created_at: new Date().toISOString(),
    selected_num: -1,
    total: 0,
  };

  pollPosts[resolvedPostId] = createdPost;

  return clonePost(createdPost);
}

export function voteMockPollPost(
  postId: string,
  selectNum: number,
  userId = MOCK_AUTH_USER_ID,
) {
  const post = pollPosts[postId];

  if (!post) {
    return { status: 404 as const };
  }

  if (post.user_id === userId) {
    return {
      status: 400 as const,
      message: '投稿した本人は投票できません。',
    };
  }

  if (post.voted) {
    return {
      status: 409 as const,
      message: 'この投稿にはすでに投票済みです。',
    };
  }

  const targetOption = post.options.find((option) => option.select_num === selectNum);

  if (!targetOption) {
    return {
      status: 400 as const,
      message: '存在しない選択肢です。',
    };
  }

  post.voted = true;
  post.selected_num = selectNum;
  post.total += 1;
  post.options = post.options.map((option) => ({
    ...option,
    votes:
      getNormalizedVotes(option.votes) + (option.select_num === selectNum ? 1 : 0),
  }));

  const response: VoteResponse = {
    options: post.options.map((option) => ({
      select_num: option.select_num,
      votes: getNormalizedVotes(option.votes),
    })),
    selected_num: selectNum,
    total: post.total,
  };

  return {
    status: 201 as const,
    response,
  };
}

export function deleteMockPollPost(postId: string, userId = MOCK_AUTH_USER_ID) {
  const post = pollPosts[postId];

  if (!post) {
    return { status: 404 as const };
  }

  if (post.user_id !== userId) {
    return {
      status: 403 as const,
      message: 'この投稿を削除する権限がありません。',
    };
  }

  delete pollPosts[postId];

  return { status: 204 as const };
}
