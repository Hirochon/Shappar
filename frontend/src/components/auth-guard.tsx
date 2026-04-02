import {
  Navigate,
  Outlet,
  useLocation,
  type Location,
} from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

type RedirectState = {
  from: Location;
};

function AuthLoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div
        aria-live="polite"
        className="flex flex-col items-center gap-4 text-center text-slate-700"
        role="status"
      >
        <svg
          aria-hidden="true"
          className="size-8 animate-spin text-sky-600"
          data-testid="auth-guard-spinner"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-90"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
            fill="currentColor"
          />
        </svg>
        <p className="text-sm font-medium">認証状態を確認しています...</p>
      </div>
    </main>
  );
}

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location } satisfies RedirectState}
        to="/login"
      />
    );
  }

  return <Outlet />;
}

export function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}
