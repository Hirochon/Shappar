import { HttpResponse, http } from 'msw';
import { getPublicPostsPage, publicPosts } from '@/mocks/data/public-posts';
import {
  createMockPollPost,
  deleteMockPollPost,
  getMockPollPost,
  voteMockPollPost,
} from '@/mocks/poll-data';

const API_BASE_URL = 'http://localhost:8040';

export const postHandlers = [
  http.get(`${API_BASE_URL}/api/v1/posts/public`, ({ request }) => {
    const url = new URL(request.url);
    const posts = getPublicPostsPage(
      publicPosts,
      url.searchParams.get('pid'),
      url.searchParams.get('q'),
    );

    if (posts === null) {
      return HttpResponse.json(
        { detail: '存在しない投稿IDです。' },
        { status: 404 },
      );
    }

    return HttpResponse.json({ posts });
  }),
  http.post(`${API_BASE_URL}/api/v1/posts`, async ({ request }) => {
    const body = (await request.json()) as {
      question?: string;
      options?: Array<{ answer?: string }>;
    };
    const question = body.question?.trim() ?? '';
    const options =
      body.options?.map((option) => ({
        answer: option.answer?.trim() ?? '',
      })) ?? [];

    if (!question || options.length < 2 || options.some((option) => !option.answer)) {
      return HttpResponse.json(
        { detail: '入力内容を確認してください。' },
        { status: 400 },
      );
    }

    const createdPost = createMockPollPost(question, options);

    return HttpResponse.json(
      {
        post_id: createdPost.post_id,
      },
      { status: 201 },
    );
  }),
  http.get(`${API_BASE_URL}/api/v1/posts/:id`, ({ params }) => {
    const post = getMockPollPost(String(params.id));

    if (!post) {
      return HttpResponse.json(
        { detail: '存在しない投稿IDです。' },
        { status: 404 },
      );
    }

    return HttpResponse.json(post);
  }),
  http.post(`${API_BASE_URL}/api/v1/posts/:id/polls`, async ({ params, request }) => {
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
  http.delete(`${API_BASE_URL}/api/v1/posts/:id`, ({ params }) => {
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
