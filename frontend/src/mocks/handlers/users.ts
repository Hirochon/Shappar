import { HttpResponse, http } from 'msw';
import { MOCK_AUTH_USER_ID } from '@/mocks/poll-data';
import type { Post, User } from '@/types/api';

const API_BASE_URL = 'http://localhost:8040';

type MockUserRecord = {
  profile: User;
  posted: Post[];
  voted: Post[];
};

function createMockPost(userId: string, postId: string, question: string): Post {
  return {
    post_id: postId,
    user_id: userId,
    iconimage: 'https://example.com/post-icon.png',
    question,
    voted: true,
    options: [
      {
        select_num: 0,
        answer: '海辺',
        votes: 3,
      },
      {
        select_num: 1,
        answer: '街歩き',
        votes: 2,
      },
    ],
    created_at: '2026-04-02T10:00:00.000Z',
    selected_num: 0,
    total: 5,
  };
}

const initialMockUsers: Record<string, MockUserRecord> = {
  [MOCK_AUTH_USER_ID]: {
    profile: {
      unique_id: 'unique-user-123',
      user_id: MOCK_AUTH_USER_ID,
      name: 'Shappar User',
      introduction: 'I love taking pictures with friends.',
      iconimage: 'https://example.com/icon.png',
      homeimage: 'https://example.com/home.png',
    },
    posted: [
      createMockPost(MOCK_AUTH_USER_ID, 'user-post-1', '次の撮影テーマは？'),
      createMockPost(MOCK_AUTH_USER_ID, 'user-post-2', '一番好きなレンズは？'),
      createMockPost(MOCK_AUTH_USER_ID, 'user-post-3', '朝と夜、どちらを撮る？'),
    ],
    voted: [
      createMockPost('creator-001', 'voted-post-1', '旅行先で撮りたい景色は？'),
      createMockPost('creator-002', 'voted-post-2', '次の現像スタイルは？'),
      createMockPost('creator-003', 'voted-post-3', '休日に撮るならどこ？'),
      createMockPost('creator-004', 'voted-post-4', 'ポートレートと風景、どっち派？'),
    ],
  },
  'other-user-456': {
    profile: {
      unique_id: 'unique-user-456',
      user_id: 'other-user-456',
      name: '別ユーザー',
      introduction: '街角スナップを集めています。',
      iconimage: '',
      homeimage: 'https://example.com/other-home.png',
    },
    posted: [
      createMockPost('other-user-456', 'other-post-1', '今週撮るなら何色？'),
      createMockPost('other-user-456', 'other-post-2', '次の散歩コースは？'),
    ],
    voted: [
      createMockPost('creator-010', 'other-voted-1', '好きな時間帯は？'),
      createMockPost('creator-011', 'other-voted-2', '次の撮影場所は？'),
      createMockPost('creator-012', 'other-voted-3', '現像の好みは？'),
    ],
  },
};

let mockUsers = structuredClone(initialMockUsers);

function getUserRecord(userId: string) {
  return mockUsers[userId] ?? null;
}

function notFoundResponse() {
  return HttpResponse.json(
    { detail: '存在しないユーザーです。' },
    { status: 404 },
  );
}

export function resetMockUsers() {
  mockUsers = structuredClone(initialMockUsers);
}

export const userHandlers = [
  http.get(`${API_BASE_URL}/api/v1/users/:userId`, ({ params }) => {
    const user = getUserRecord(String(params.userId));

    if (!user) {
      return notFoundResponse();
    }

    return HttpResponse.json(user.profile);
  }),
  http.get(`${API_BASE_URL}/api/v1/users/:userId/posted`, ({ params }) => {
    const user = getUserRecord(String(params.userId));

    if (!user) {
      return notFoundResponse();
    }

    return HttpResponse.json({ posts: user.posted });
  }),
  http.get(`${API_BASE_URL}/api/v1/users/:userId/voted`, ({ params }) => {
    const user = getUserRecord(String(params.userId));

    if (!user) {
      return notFoundResponse();
    }

    return HttpResponse.json({ posts: user.voted });
  }),
  http.patch(`${API_BASE_URL}/api/v1/users/:userId`, async ({ params, request }) => {
    const user = getUserRecord(String(params.userId));

    if (!user) {
      return notFoundResponse();
    }

    const body = (await request.json()) as {
      name?: string;
      introduction?: string;
    };
    const nextName = body.name?.trim();

    if (!nextName) {
      return HttpResponse.json(
        { detail: '名前を入力してください。' },
        { status: 400 },
      );
    }

    user.profile = {
      ...user.profile,
      name: nextName,
      introduction: body.introduction?.trim() ?? '',
    };

    return HttpResponse.json({}, { status: 200 });
  }),
];
