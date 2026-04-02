import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <Alert className="space-y-3" variant="destructive">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
        {onRetry ? (
          <Button
            className="shrink-0 self-start"
            onClick={onRetry}
            type="button"
            variant="outline"
          >
            再試行
          </Button>
        ) : null}
      </div>
    </Alert>
  );
}
