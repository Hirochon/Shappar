import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
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
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
