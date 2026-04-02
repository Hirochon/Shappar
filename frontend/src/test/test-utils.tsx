import {
  cleanup,
  fireEvent,
  render as rtlRender,
  renderHook,
  screen,
  waitFor,
  within,
  type RenderOptions,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ToastContextProvider } from '@/hooks/use-toast';
import type { ComponentProps, PropsWithChildren, ReactElement } from 'react';

type ExtendedRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  initialEntries?: ComponentProps<typeof MemoryRouter>['initialEntries'];
  initialIndex?: number;
};

function renderWithProviders(
  ui: ReactElement,
  options: ExtendedRenderOptions = {},
) {
  const { initialEntries, initialIndex, ...renderOptions } = options;

  function Wrapper({ children }: PropsWithChildren) {
    const content = initialEntries ? (
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        {children}
      </MemoryRouter>
    ) : (
      children
    );

    return (
      <ToastContextProvider>
        {content}
        <Toaster />
      </ToastContextProvider>
    );
  }

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
}

const render = renderWithProviders;

export {
  cleanup,
  fireEvent,
  render,
  renderWithProviders,
  renderHook,
  screen,
  userEvent,
  waitFor,
  within,
};
