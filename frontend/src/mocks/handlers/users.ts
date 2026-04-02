import { HttpResponse, http } from 'msw';
import { MOCK_AUTH_USER_ID } from '@/mocks/poll-data';

const API_BASE_URL = 'http://localhost:8040';

const initialMockUser = {
  unique_id: 'unique-user-123',
  user_id: MOCK_AUTH_USER_ID,
  name: 'Shappar User',
  introduction: 'I love taking pictures with friends.',
  iconimage: 'https://example.com/icon.png',
  homeimage: 'https://example.com/home.png',
};

let mockUser = structuredClone(initialMockUser);

export function resetMockUser() {
  mockUser = structuredClone(initialMockUser);
}

export const userHandlers = [
  http.patch(`${API_BASE_URL}/api/v1/users/:userId`, async ({ params, request }) => {
    if (String(params.userId) !== mockUser.user_id) {
      return HttpResponse.json(
        { detail: '見つかりませんでした。' },
        { status: 404 },
      );
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

    mockUser = {
      ...mockUser,
      name: nextName,
      introduction: body.introduction?.trim() ?? '',
    };

    return HttpResponse.json({}, { status: 200 });
  }),
];
