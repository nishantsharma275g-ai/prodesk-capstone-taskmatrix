import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold">
              T
            </span>
            <span className="text-xl font-bold tracking-tight">
              TaskMatrix
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_40%)]" />

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Enterprise Agile Project Management
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Plan better.
              <br />
              <span className="text-blue-500">Build together.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
              TaskMatrix gives Agile teams one workspace to manage projects,
              organize tasks, plan sprints, and keep everyone aligned.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-xl bg-blue-600 px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 sm:w-auto"
              >
                Create your workspace →
              </Link>

              <Link
                href="/login"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-center font-semibold text-slate-200 transition hover:bg-white/10 sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Built for Agile teams
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your team needs
            </h2>

            <p className="mt-4 text-slate-400">
              A focused workspace designed around modern project management
              workflows.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="✓"
              title="Project Management"
              description="Create projects, organize work, and give your team a clear view of what matters."
            />

            <FeatureCard
              icon="▦"
              title="Task & Kanban Workflows"
              description="Move work from backlog to completion with simple, visual task management."
            />

            <FeatureCard
              icon="◷"
              title="Sprint Planning"
              description="Plan iterations, track progress, and keep Agile ceremonies connected to delivery."
            />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Full-stack platform
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Designed as a real product, not just a demo.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              TaskMatrix combines a modern Next.js frontend with an Express
              API, JWT authentication, and MongoDB persistence.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                "Next.js",
                "React",
                "Express",
                "MongoDB",
                "JWT",
                "Tailwind CSS",
                "Vercel",
                "Render",
              ].map((technology) => (
                <div
                  key={technology}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-center text-sm font-medium text-slate-300"
                >
                  {technology}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="space-y-4">
              <ArchitectureRow
                number="01"
                title="Authentication"
                description="Secure registration and login"
              />

              <ArchitectureRow
                number="02"
                title="Projects"
                description="Organize workspaces and teams"
              />

              <ArchitectureRow
                number="03"
                title="Tasks"
                description="Manage Agile work items"
              />

              <ArchitectureRow
                number="04"
                title="Sprints"
                description="Plan and track iterations"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-blue-600">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to organize your next project?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Create your TaskMatrix workspace and start managing your Agile
            workflow.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 transition hover:bg-slate-100"
          >
            Get started for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <span className="font-semibold text-slate-300">TaskMatrix</span>
            <span className="ml-2">
              Agile Project Management Platform
            </span>
          </div>

          <span>© 2026 Prodesk IT Capstone</span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-blue-500/30 hover:bg-white/[0.05]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-lg text-blue-400">
        {icon}
      </div>

      <h3 className="mt-6 text-lg font-semibold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </article>
  );
}

function ArchitectureRow({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-sm font-bold text-blue-400">
        {number}
      </span>

      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
