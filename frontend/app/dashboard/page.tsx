"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  _id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DashboardPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskmatrix_token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchProjects(token);
  }, [router]);

  async function fetchProjects(token: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load projects.");
      }

      setProjects(data.projects || []);
    } catch (error) {
      console.error("Fetch projects error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load projects.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = localStorage.getItem("taskmatrix_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create project.");
      }

      setProjects((currentProjects) => [data.project, ...currentProjects]);

      setName("");
      setDescription("");
    } catch (error) {
      console.error("Create project error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to create project.",
      );
    } finally {
      setCreating(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("taskmatrix_token");
    localStorage.removeItem("taskmatrix_user");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">TaskMatrix</h1>
            <p className="text-sm text-slate-400">Agile project management</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Your workspace</h2>
          <p className="mt-2 text-slate-400">
            Create and manage your TaskMatrix projects.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <section className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-lg font-semibold">Create a project</h3>

            <p className="mt-1 text-sm text-slate-400">
              Start a new workspace for your team.
            </p>

            <form onSubmit={handleCreateProject} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="project-name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Project name
                </label>

                <input
                  id="project-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Mobile App"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="project-description"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this project about?"
                  maxLength={1000}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create project"}
              </button>
            </form>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Projects</h3>
                <p className="text-sm text-slate-400">
                  {projects.length}{" "}
                  {projects.length === 1 ? "project" : "projects"}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                <h4 className="text-lg font-semibold">No projects yet</h4>

                <p className="mt-2 text-sm text-slate-400">
                  Create your first project using the form.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {projects.map((project) => (
                  <article
                    key={project._id}
                    onClick={() =>
                      router.push(`/dashboard/projects/${project._id}`)
                    }
                    className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-blue-500/30 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-lg font-semibold">{project.name}</h4>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium capitalize text-emerald-400">
                        {project.status}
                      </span>
                    </div>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                      {project.description || "No description provided."}
                    </p>

                    <div className="mt-5 border-t border-white/10 pt-4 text-xs text-slate-500">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
