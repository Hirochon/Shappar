import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/components/auth-guard';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';

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
        index: true,
        element: <HomePage />,
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
