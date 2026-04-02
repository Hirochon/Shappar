import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

const initialState: ErrorBoundaryState = {
  error: null,
  hasError: false,
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = initialState;

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      error,
      hasError: true,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled render error', error, errorInfo);
  }

  private readonly handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
      this.setState(initialState);
      return;
    }

    window.location.reload();
  };

  override render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.12),_transparent_38%),linear-gradient(180deg,_#fff7ed_0%,_#fffbeb_100%)] px-4 py-10">
        <Card className="w-full max-w-lg border-destructive/20 bg-white/95 shadow-[0_28px_80px_rgba(124,45,18,0.14)]">
          <CardHeader className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Unexpected Error
            </p>
            <CardTitle className="text-3xl text-slate-950">
              エラーが発生しました
            </CardTitle>
            <CardDescription className="text-base leading-7 text-slate-600">
              画面の表示中に問題が発生しました。再試行しても改善しない場合は、
              ページを再読み込みしてください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={this.handleReset} type="button">
              再試行
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }
}
