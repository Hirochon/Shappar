import { HttpResponse, http } from 'msw';
import { postHandlers } from '@/mocks/handlers/posts';
import { MOCK_AUTH_USER_ID } from '@/mocks/poll-data';

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
  http.get('/api/v1/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
  ...postHandlers,
];
