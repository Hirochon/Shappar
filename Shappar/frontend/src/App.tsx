import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { LoginPage } from '@/pages/login-page';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    return initAuthListener();
  }, [initAuthListener]);

  return (
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
}

export default App;
