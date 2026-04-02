import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { dismiss, toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast
          duration={toast.duration ?? 4000}
          key={toast.id}
          onOpenChange={(open) => {
            if (!open) {
              dismiss(toast.id);
            }
          }}
          open
        >
          <div className="grid gap-1">
            {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
            {toast.description ? (
              <ToastDescription>{toast.description}</ToastDescription>
            ) : null}
          </div>
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
