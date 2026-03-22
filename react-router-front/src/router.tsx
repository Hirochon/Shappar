import type { RouteObject } from 'react-router'
import {
  createBrowserRouter,
  createMemoryRouter,
  NavLink,
  Outlet,
  RouterProvider,
} from 'react-router'
import { HomePage } from './routes/home-page'
import { StatusPage } from './routes/status-page'

const navigationItems = [
  { label: 'Overview', to: '/' },
  { label: 'Status', to: '/status' },
]

function Shell() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="panel flex flex-col gap-4 bg-[#fff7ef]/90 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="eyebrow">SHA-13 frontend bootstrap</p>
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                React Router starter for Shappar
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Express runs the development entrypoint, Vite handles assets and
                HMR, and the client stays inside a typed React Router app.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-chip ${isActive ? 'nav-chip-active' : ''}`
                }
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </header>

        <main className="flex-1 py-8">
          <Outlet />
        </main>

        <footer className="flex flex-col gap-2 border-t border-slate-950/10 px-2 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Default dev server: http://localhost:3000</p>
          <p>Health endpoint: /health</p>
        </footer>
      </div>
    </div>
  )
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Shell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'status',
        element: <StatusPage />,
      },
    ],
  },
]

export function createAppRouter(initialEntries?: string[]) {
  if (initialEntries) {
    return createMemoryRouter(routes, { initialEntries })
  }

  return createBrowserRouter(routes)
}

const browserRouter = createAppRouter()

export function AppRouter() {
  return <RouterProvider router={browserRouter} />
}
