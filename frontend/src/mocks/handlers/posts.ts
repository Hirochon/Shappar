import { HttpResponse, http } from 'msw';
import { getPublicPostsPage, publicPosts } from '@/mocks/data/public-posts';

const API_BASE_URL = 'http://localhost:8040';

export const publicPostsHandlers = [
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
];
