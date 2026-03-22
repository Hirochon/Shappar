import { render, screen } from '@testing-library/react'
import { RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { createAppRouter } from '../router'

describe('app router', () => {
  it('renders the overview page on the root route', async () => {
    const router = createAppRouter(['/'])

    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', {
        name: /frontend scaffolding with a real router/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /open setup status/i }),
    ).toBeVisible()
  })

  it('renders the status page on the status route', async () => {
    const router = createAppRouter(['/status'])

    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', { name: /environment status/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('/health')).toBeVisible()
  })
})
