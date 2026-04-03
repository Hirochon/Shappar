import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

type ToastRecord = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
};

type ToastInput = Omit<ToastRecord, 'id'>;

type ToastContextValue = {
  dismiss: (id: string) => void;
  toast: (input: ToastInput) => string;
  toasts: ToastRecord[];
};

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCount = 0;

export function ToastContextProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  function dismiss(id: string) {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }

  function toast(input: ToastInput) {
    toastCount += 1;

    const id = `toast-${toastCount}`;

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        ...input,
      },
    ]);

    return id;
  }

  return (
    <ToastContext.Provider
      value={{
        dismiss,
        toast,
        toasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastContextProvider');
  }

  return context;
}
