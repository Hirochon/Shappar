import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth, googleProvider } from '@/lib/firebase';

const DEFAULT_ERROR_MESSAGE =
  'Google ログインに失敗しました。時間をおいて再度お試しください。';

function shouldIgnoreAuthError(error: unknown) {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false;
  }

  return String(error.code).endsWith('popup-closed-by-user');
}

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (loginError) {
      if (!shouldIgnoreAuthError(loginError)) {
        setError(DEFAULT_ERROR_MESSAGE);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_42%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <Card className="w-full max-w-md border-white/70 bg-white/90 shadow-[0_28px_80px_rgba(15,23,42,0.16)] backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              Welcome
            </p>
            <CardTitle className="text-4xl font-semibold text-slate-950">
              Shappar
            </CardTitle>
            <CardDescription className="text-base leading-7 text-slate-600">
              Google ログインで Shappar を始めましょう。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-slate-950/10"
              disabled={isLoading}
              onClick={() => {
                void handleGoogleLogin();
              }}
              type="button"
            >
              {isLoading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="size-4 animate-spin"
                    data-testid="google-login-spinner"
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
                  <span>ログイン中...</span>
                </>
              ) : (
                'Google でログイン'
              )}
            </Button>
            {error ? (
              <p
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
