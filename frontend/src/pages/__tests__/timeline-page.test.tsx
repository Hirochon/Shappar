import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { type PropsWithChildren } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return {
    auth: mockAuth,
  };
});

import { TimelinePage } from '@/pages/TimelinePage';
import type { Post } from '@/types/api';
import { server } from '@/test/mocks/server';
import { render, screen, userEvent } from '@/test/test-utils';

const API_BASE_URL = 'http://localhost:8040';

function createPost(overrides: Partial<Post> = {}): Post {
  const optionCount = overrides.options?.length ?? 2;

  return {
    post_id: 'post-1',
    user_id: 'photo_lover',
    iconimage: 'https://example.com/icon.png',
    question: '週末はどこで写真を撮る？',
    voted: false,
    options: Array.from({ length: optionCount }, (_, index) => ({
      select_num: index,
      answer: `選択肢 ${index + 1}`,
      votes: 10 - index,
    })),
    created_at: '2026-04-02T03:15:00.000Z',
    selected_num: -1,
    total: 18,
    ...overrides,
  };
}

function mockPublicPollPages(pages: Record<string, Post[]>) {
  server.use(
    http.get(`${API_BASE_URL}/api/v1/posts/public`, ({ request }) => {
      const pid = new URL(request.url).searchParams.get('pid') ?? '__initial__';

      return HttpResponse.json({
        posts: pages[pid] ?? [],
      });
    }),
  );
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function renderTimelinePage() {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <TimelinePage />,
      },
      {
        path: '/polls/:pollId',
        element: <h1>投票詳細</h1>,
      },
      {
        path: '/create',
        element: <h1>投票作成</h1>,
      },
    ],
    {
      initialEntries: ['/'],
    },
  );

  const Wrapper = createWrapper();

  return render(
    <Wrapper>
      <RouterProvider router={router} />
    </Wrapper>,
  );
}

type MockIntersectionObserverEntry = {
  callback: IntersectionObserverCallback;
  element: Element | null;
};

const intersectionObserverEntries: MockIntersectionObserverEntry[] = [];

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [0];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    intersectionObserverEntries.push({
      callback,
      element: null,
    });
  }

  disconnect() {}

  observe(element: Element) {
    intersectionObserverEntries[intersectionObserverEntries.length - 1] = {
      callback: this.callback,
      element,
    };
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve() {}
}

function triggerIntersection(isIntersecting = true) {
  intersectionObserverEntries.forEach(({ callback, element }) => {
    if (!element) {
      return;
    }

    callback(
      [
        {
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: isIntersecting
            ? element.getBoundingClientRect()
            : new DOMRectReadOnly(),
          isIntersecting,
          rootBounds: null,
          target: element,
          time: Date.now(),
        } satisfies IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  });
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    value: MockIntersectionObserver,
  });
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('TimelinePage', () => {
  beforeEach(() => {
    intersectionObserverEntries.length = 0;
  });

  it('renders the public poll timeline with a voted badge and a floating create button', async () => {
    mockPublicPollPages({
      __initial__: [
        createPost({
          post_id: 'post-1',
          question: '今夜見る映画は？',
          voted: true,
        }),
        createPost({
          post_id: 'post-2',
          question: '次の旅行先は？',
        }),
      ],
    });

    renderTimelinePage();

    expect(screen.getByText('公開投票を読み込み中...')).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: '今夜見る映画は？' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '次の旅行先は？' }),
    ).toBeInTheDocument();
    expect(screen.getByText('投票済み')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: '投票を作成',
      }),
    ).toHaveAttribute('href', '/create');
  });

  it('shows the question, option count, vote count, creator name, and created timestamp on each card', async () => {
    mockPublicPollPages({
      __initial__: [
        createPost({
          question: 'どのレンズを持っていく？',
          user_id: 'yamada_taro',
          options: [
            {
              select_num: 0,
              answer: '35mm',
              votes: 8,
            },
            {
              select_num: 1,
              answer: '50mm',
              votes: 5,
            },
            {
              select_num: 2,
              answer: '85mm',
              votes: 3,
            },
          ],
          total: 16,
          created_at: '2026-04-01T20:45:00.000Z',
        }),
      ],
    });

    renderTimelinePage();

    expect(
      await screen.findByRole('heading', { name: 'どのレンズを持っていく？' }),
    ).toBeInTheDocument();
    expect(screen.getByText('選択肢 3件')).toBeInTheDocument();
    expect(screen.getByText('投票 16票')).toBeInTheDocument();
    expect(screen.getByText('投稿者 yamada_taro')).toBeInTheDocument();
    expect(screen.getByText('2026/04/02 05:45')).toBeInTheDocument();
  });

  it('navigates to the poll detail screen when a card is clicked', async () => {
    mockPublicPollPages({
      __initial__: [createPost()],
    });

    renderTimelinePage();

    await userEvent.click(
      await screen.findByRole('link', {
        name: '週末はどこで写真を撮る？',
      }),
    );

    expect(
      await screen.findByRole('heading', { name: '投票詳細' }),
    ).toBeInTheDocument();
  });

  it('shows the loading state while the first page is fetching', async () => {
    let resolveRequest: (() => void) | undefined;
    const requestSettled = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    server.use(
      http.get(`${API_BASE_URL}/api/v1/posts/public`, async () => {
        await requestSettled;

        return HttpResponse.json({
          posts: [createPost()],
        });
      }),
    );

    renderTimelinePage();

    expect(screen.getByText('公開投票を読み込み中...')).toBeInTheDocument();

    resolveRequest?.();

    expect(
      await screen.findByRole('heading', { name: '週末はどこで写真を撮る？' }),
    ).toBeInTheDocument();
  });

  it('shows an empty state message when no public polls exist', async () => {
    mockPublicPollPages({
      __initial__: [],
    });

    renderTimelinePage();

    expect(
      await screen.findByText('公開中の投票はまだありません。'),
    ).toBeInTheDocument();
  });

  it('loads the next page when the sentinel intersects during infinite scroll', async () => {
    const firstPage = Array.from({ length: 10 }, (_, index) =>
      createPost({
        post_id: `post-${index + 1}`,
        question: `質問 ${index + 1}`,
      }),
    );
    const secondPage = [
      createPost({
        post_id: 'post-11',
        question: '質問 11',
      }),
      createPost({
        post_id: 'post-12',
        question: '質問 12',
      }),
    ];

    mockPublicPollPages({
      __initial__: firstPage,
      'post-10': secondPage,
    });

    renderTimelinePage();

    expect(
      await screen.findByRole('heading', { name: '質問 10' }),
    ).toBeInTheDocument();

    triggerIntersection();

    expect(
      await screen.findByRole('heading', { name: '質問 12' }),
    ).toBeInTheDocument();
  });

  it('shows an error message when the API request fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/v1/posts/public`, () => {
        return HttpResponse.json(
          { detail: '投稿一覧の取得に失敗しました。' },
          { status: 500 },
        );
      }),
    );

    renderTimelinePage();

    expect(
      await screen.findByText('投稿一覧の取得に失敗しました。'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '再試行',
      }),
    ).toBeInTheDocument();
  });
});
