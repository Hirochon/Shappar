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
import type { PropsWithChildren, ReactElement } from 'react';

function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>;
  }

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...options,
  });
}

export {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  userEvent,
  waitFor,
  within,
};
