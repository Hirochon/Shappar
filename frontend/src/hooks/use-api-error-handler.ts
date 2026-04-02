import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

const UNAUTHORIZED_MESSAGE =
  '認証の有効期限が切れました。再度ログインしてください。';
const FORBIDDEN_MESSAGE = '権限がありません';
const NOT_FOUND_MESSAGE = '見つかりませんでした';
const SERVER_ERROR_MESSAGE = 'サーバーエラーが発生しました';
const NETWORK_ERROR_MESSAGE = 'ネットワーク接続を確認してください';
const DEFAULT_ERROR_MESSAGE = '予期しないエラーが発生しました';

function isNetworkError(error: unknown) {
  return (
    error instanceof TypeError ||
    (error instanceof ApiError && error.status === 0)
  );
}

function clearAuthSession() {
  useAuthStore.getState().clearUser();
}

function redirectToLogin() {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.pathname === '/login') {
    return;
  }

  window.history.replaceState(null, '', '/login');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function getApiErrorMessage(error: unknown) {
  if (isNetworkError(error)) {
    return NETWORK_ERROR_MESSAGE;
  }

  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return UNAUTHORIZED_MESSAGE;
      case 403:
        return FORBIDDEN_MESSAGE;
      case 404:
        return NOT_FOUND_MESSAGE;
      case 500:
        return SERVER_ERROR_MESSAGE;
      default:
        return error.message || DEFAULT_ERROR_MESSAGE;
    }
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}

export function handleGlobalApiError(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    clearAuthSession();
    redirectToLogin();
  }

  return getApiErrorMessage(error);
}

export function useApiErrorHandler() {
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();

  return useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        clearUser();
        void navigate('/login', { replace: true });
      }

      return getApiErrorMessage(error);
    },
    [clearUser, navigate],
  );
}
