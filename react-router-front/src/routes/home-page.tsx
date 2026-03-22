import { Link } from 'react-router'

const stackCards = [
  {
    name: 'TypeScript + Vite',
    summary: 'Strict typing with fast client bundling and HMR.',
  },
  {
    name: 'React Router',
    summary: 'Route structure is already wired for `/` and `/status`.',
  },
  {
    name: 'Tailwind + Biome',
    summary: 'Styling and lint or format tooling are ready on day one.',
  },
  {
    name: 'Vitest + Express',
    summary: 'Tests and a Node entrypoint live in the same workspace.',
  },
]

const scripts = [
  {
    command: 'pnpm install',
    detail: 'install dependencies into the workspace',
  },
  { command: 'pnpm dev', detail: 'start Express with Vite middleware' },
  { command: 'pnpm test --run', detail: 'run the router smoke tests once' },
  {
    command: 'pnpm build',
    detail: 'typecheck and emit the Vite production bundle',
  },
]

export function HomePage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="panel relative overflow-hidden bg-[#10212b] text-[#f5efe6]">
          <div className="absolute -right-10 top-0 h-44 w-44 rounded-full bg-[#ff9f43]/30 blur-3xl" />
          <div className="absolute bottom-4 right-12 h-28 w-28 rounded-full border border-white/10 bg-[#1d7f6c]/25" />

          <p className="eyebrow text-[#9ad7ca]">Ready for the first feature</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Frontend scaffolding with a real router and a real Node edge.
          </h2>
          <p className="mt-5 max-w-2xl text-base text-[#d9e3df] sm:text-lg">
            This starter keeps the client-side experience in React Router while
            letting Express own the runtime entrypoint. It is a practical base
            for later API integration without hiding the server layer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/status"
              className="rounded-full bg-[#ff9f43] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-[#ff9f43]/20"
            >
              Open setup status
            </Link>
            <a
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
              href="/health"
            >
              Check /health
            </a>
          </div>
        </div>

        <aside className="panel bg-[#fffaf4]">
          <p className="eyebrow">Workflow</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
            What is already wired
          </h2>

          <ol className="mt-6 space-y-4">
            {scripts.map((script, index) => (
              <li
                key={script.command}
                className="flex gap-4 rounded-2xl border border-slate-900/8 bg-white/70 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d7f6c] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-slate-900">
                    {script.command}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{script.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stackCards.map((card) => (
          <article
            key={card.name}
            className="panel flex h-full flex-col justify-between bg-white/75"
          >
            <div>
              <p className="eyebrow">Stack piece</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-900">
                {card.name}
              </h3>
            </div>
            <p className="mt-6 text-sm text-slate-600">{card.summary}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
