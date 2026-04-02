import { HttpResponse, http } from 'msw';
import {
  MOCK_AUTH_USER_ID,
  deleteMockPollPost,
  getMockPollPost,
  voteMockPollPost,
} from '@/mocks/poll-data';

const mockAuthUser = {
  unique_id: 'unique-user-123',
  user_id: MOCK_AUTH_USER_ID,
  name: 'Shappar User',
  introduction: 'I love taking pictures with friends.',
  iconimage: 'https://example.com/icon.png',
  homeimage: 'https://example.com/home.png',
};

export const handlers = [
  http.post('http://localhost:8040/api/v1/auth', ({ request }) => {
    const authorization = request.headers.get('authorization');

    if (!authorization || authorization === 'Bearer invalid-id-token') {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(mockAuthUser);
  }),
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
  http.get('http://localhost:8040/api/v1/posts/:id', ({ params }) => {
    const post = getMockPollPost(String(params.id));

    if (!post) {
      return HttpResponse.json(
        { detail: '存在しない投稿IDです。' },
        { status: 404 },
      );
    }

    return HttpResponse.json(post);
  }),
  http.post('http://localhost:8040/api/v1/posts/:id/polls', async ({ params, request }) => {
    const body = (await request.json()) as {
      option?: {
        select_num?: number;
      };
    };
    const selectNum = body.option?.select_num;

    if (typeof selectNum !== 'number') {
      return HttpResponse.json(
        { detail: '選択肢が指定されていません。' },
        { status: 400 },
      );
    }

    const result = voteMockPollPost(String(params.id), selectNum);

    if (result.status !== 201) {
      return HttpResponse.json(
        { detail: result.message ?? '投票に失敗しました。' },
        { status: result.status },
      );
    }

    return HttpResponse.json(result.response, { status: 201 });
  }),
  http.delete('http://localhost:8040/api/v1/posts/:id', ({ params }) => {
    const result = deleteMockPollPost(String(params.id));

    if (result.status === 204) {
      return new HttpResponse(null, { status: 204 });
    }

    return HttpResponse.json(
      { detail: result.message ?? '投稿を削除できませんでした。' },
      { status: result.status },
    );
  }),
];
