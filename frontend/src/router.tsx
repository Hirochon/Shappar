import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { ProtectedRoute, PublicRoute } from '@/components/auth-guard';
import { CreatePollPage } from '@/pages/CreatePollPage';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { PostDetailPage } from '@/pages/post-detail-page';

export const appRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'create',
            element: <CreatePollPage />,
          },
          {
            path: 'posts/:postId',
            element: <PostDetailPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const routes = appRoutes;

export const router = createBrowserRouter(appRoutes);
