import { useEffect } from 'react';
import { HomePage } from '@/pages/HomePage';
import { useAuthStore } from '@/stores/auth-store';

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    return initAuthListener();
  }, [initAuthListener]);

  return <HomePage />;
}

export default App;
