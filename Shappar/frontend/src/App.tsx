import { useEffect } from 'react';
import { LoginPage } from '@/pages/login-page';
import { useAuthStore } from '@/stores/auth-store';

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    return initAuthListener();
  }, [initAuthListener]);

  return <LoginPage />;
}

export default App;
