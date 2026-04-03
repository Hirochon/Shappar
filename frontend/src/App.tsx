import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { ToastContextProvider } from '@/hooks/use-toast';
import { router } from '@/router';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    return initAuthListener();
  }, [initAuthListener]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContextProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
          <Toaster />
        </ErrorBoundary>
      </ToastContextProvider>
    </QueryClientProvider>
  );
}

export default App;
