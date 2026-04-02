import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signInWithPopup } from 'firebase/auth';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { GoogleAuthProvider, mockAuth } = await import('@/test/mocks/firebase');

  return {
    auth: mockAuth,
    googleProvider: new GoogleAuthProvider(),
  };
});

import { auth, googleProvider } from '@/lib/firebase';
import { LoginPage } from '@/pages/login-page';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';

function createDeferredPromise<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

function createFirebaseError(code: string, message = 'Firebase auth error') {
  return Object.assign(new Error(message), { code });
}

describe('LoginPage', () => {
  beforeEach(async () => {
    const { resetFirebaseAuthMocks } = await import('@/test/mocks/firebase');
    resetFirebaseAuthMocks();
  });

  it('renders the login page', () => {
    render(<LoginPage />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows the app name', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('heading', {
        name: 'Shappar',
      }),
    ).toBeInTheDocument();
  });

  it('shows the Google login button', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('button', {
        name: 'Google でログイン',
      }),
    ).toBeInTheDocument();
  });

  it('calls signInWithPopup when the Google login button is clicked', async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.click(
      screen.getByRole('button', {
        name: 'Google でログイン',
      }),
    );

    expect(signInWithPopup).toHaveBeenCalledTimes(1);
    expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
  });

  it('shows a loading state while login is in progress', async () => {
    const deferred = createDeferredPromise<unknown>();
    const user = userEvent.setup();

    vi.mocked(signInWithPopup).mockReturnValueOnce(deferred.promise as never);

    render(<LoginPage />);

    const loginButton = screen.getByRole('button', {
      name: 'Google でログイン',
    });

    await user.click(loginButton);

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });
    expect(screen.getByText('ログイン中...')).toBeInTheDocument();
    expect(screen.getByTestId('google-login-spinner')).toBeInTheDocument();

    deferred.resolve({});

    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });
  });

  it('shows an error message when login fails', async () => {
    const user = userEvent.setup();

    vi.mocked(signInWithPopup).mockRejectedValueOnce(
      createFirebaseError('auth/internal-error'),
    );

    render(<LoginPage />);

    await user.click(
      screen.getByRole('button', {
        name: 'Google でログイン',
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Google ログインに失敗しました。時間をおいて再度お試しください。',
      );
    });
  });

  it('does not show an error message when the user closes the popup', async () => {
    const user = userEvent.setup();

    vi.mocked(signInWithPopup).mockRejectedValueOnce(
      createFirebaseError('auth/popup-closed-by-user'),
    );

    render(<LoginPage />);

    const loginButton = screen.getByRole('button', {
      name: 'Google でログイン',
    });

    await user.click(loginButton);

    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
