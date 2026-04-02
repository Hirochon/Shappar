import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { ProtectedRoute, PublicRoute } from '@/components/auth-guard';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { PollDetailPage } from '@/pages/PollDetailPage';

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
            path: 'polls/:id',
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
