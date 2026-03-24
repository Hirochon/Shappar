import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('/api/v1/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
];
