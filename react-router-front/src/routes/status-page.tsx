import { Link } from 'react-router'

const checks = [
  {
    title: 'Install the workspace',
    detail:
      'Use `pnpm install` from this directory before doing any local work.',
  },
  {
    title: 'Start the app server',
    detail:
      '`pnpm dev` starts Express on port 3000 and attaches Vite middleware.',
  },
  {
    title: 'Open the router views',
    detail:
      'Visit `/` for the landing page and `/status` for this checklist page.',
  },
  {
    title: 'Verify the server edge',
    detail: 'Call `/health` and expect a small JSON payload from Express.',
  },
]

const commandSummary = [
  'pnpm install',
  'pnpm dev',
  'pnpm test --run',
  'pnpm build',
]

export function StatusPage() {
  return (
    <div className="space-y-6">
      <section className="panel bg-[#fff7ee]">
        <p className="eyebrow">Runtime status</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900">
              Environment status
            </h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              This route exists to confirm React Router navigation after the
              Express development server is up. If you can see this page, both
              the Node entrypoint and client routing are alive.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex w-fit items-center rounded-full border border-slate-950/10 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to overview
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel">
          <p className="eyebrow">Checklist</p>
          <ol className="mt-5 space-y-4">
            {checks.map((check, index) => (
              <li
                key={check.title}
                className="flex gap-4 rounded-2xl border border-slate-900/8 bg-[#f8f4ee] p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
                    {check.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{check.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="panel bg-[#10212b] text-[#edf2ef]">
          <p className="eyebrow text-[#9ad7ca]">Reference</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            Exposed paths
          </h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-[#ffcf8b]">/</p>
              <p className="mt-1 text-[#d1d8d5]">
                Landing page with stack summary
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-[#ffcf8b]">/status</p>
              <p className="mt-1 text-[#d1d8d5]">
                Client-side verification page
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-[#ffcf8b]">/health</p>
              <p className="mt-1 text-[#d1d8d5]">
                Express JSON health response
              </p>
            </div>
          </div>

          <h3 className="mt-8 text-lg font-semibold tracking-[-0.03em]">
            Command summary
          </h3>
          <ul className="mt-4 space-y-2 font-mono text-sm text-[#d7e1de]">
            {commandSummary.map((command) => (
              <li key={command}>{command}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
