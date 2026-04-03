import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { ProtectedRoute, PublicRoute } from '@/components/auth-guard';
import { CreatePage } from '@/pages/create-page';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { PollDetailPage } from '@/pages/PollDetailPage';
import { ProfileEditPage } from '@/pages/ProfileEditPage';
import { ProfilePage } from '@/pages/ProfilePage';

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
            element: <CreatePage />,
          },
          {
            path: 'polls/:pollId',
            element: <PollDetailPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'profile/edit',
            element: <ProfileEditPage />,
          },
          {
            path: 'profile/:userId',
            element: <ProfilePage />,
          },
          {
            path: 'posts/:postId',
            element: <PollDetailPage />,
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
