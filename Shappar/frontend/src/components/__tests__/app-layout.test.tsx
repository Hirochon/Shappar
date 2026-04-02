import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@/test/test-utils';

vi.mock('@/components/header', () => ({
  Header: () => <header data-testid="app-header">Mock Header</header>,
}));

import { AppLayout } from '@/components/app-layout';

describe('AppLayout', () => {
  it('renders the header with the index child content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<p>Home Content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByText('Home Content')).toBeInTheDocument();
  });

  it('renders nested route content through the outlet', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<p>Home Content</p>} />
            <Route path="profile" element={<p>Profile Content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByText('Profile Content')).toBeInTheDocument();
  });
});
