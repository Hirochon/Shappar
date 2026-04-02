import { HttpResponse, http } from 'msw';

let createdPollCount = 0;

export const postHandlers = [
  http.post('http://localhost:8040/api/v1/posts', () => {
    createdPollCount += 1;

    return HttpResponse.json(
      {
        post_id: `mock-post-${createdPollCount}`,
      },
      { status: 201 },
    );
  }),
];
