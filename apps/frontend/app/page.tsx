export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black text-white">
      <main className="container flex flex-col items-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Gym Exercices
        </h1>

        <p className="text-center text-xl text-zinc-400">
          Full-stack gym exercises management
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="/tasks"
            className="rounded-lg bg-zinc-800 px-8 py-3 font-semibold transition hover:bg-zinc-700"
          >
            View Tasks
          </a>

          <a
            href="http://localhost:3001/graphql"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-700 px-8 py-3 font-semibold transition hover:bg-zinc-800"
          >
            GraphQL Playground
          </a>

          <a
            href="http://localhost:3001/tasks"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-700 px-8 py-3 font-semibold transition hover:bg-zinc-800"
          >
            REST API
          </a>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="text-lg font-semibold">Next.js 16</h3>
            <p className="text-sm text-zinc-400">
              React framework with App Router
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="text-lg font-semibold">Tailwind CSS</h3>
            <p className="text-sm text-zinc-400">Utility-first CSS framework</p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="text-lg font-semibold">Shadcn/ui</h3>
            <p className="text-sm text-zinc-400">Ready to use UI components</p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="text-lg font-semibold">TypeScript</h3>
            <p className="text-sm text-zinc-400">Type-safe development</p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-zinc-500">
          <p>Backend: http://localhost:3001</p>
          <p>Frontend: http://localhost:3000</p>
        </div>
      </main>
    </div>
  );
}
