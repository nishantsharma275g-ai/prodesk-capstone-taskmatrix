"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
};

type Project = {
  _id: string;
  name: string;
  description: string;
  status: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const columns = [
  { key: "todo", title: "To Do" },
  { key: "in-progress", title: "In Progress" },
  { key: "done", title: "Done" },
] as const;

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Create task state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  // Edit task state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium",
  );
  const [editStatus, setEditStatus] = useState<"todo" | "in-progress" | "done">(
    "todo",
  );
  const [editDueDate, setEditDueDate] = useState("");

  // Delete confirmation state
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("taskmatrix_token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadProject(token);
    loadTasks(token);
  }, [projectId, router]);

  async function loadProject(token: string) {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Project not found.");
      }

      setProject(data.project);
    } catch (error) {
      console.error("Load project error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load project.",
      );
    }
  }

  async function loadTasks(token: string) {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/tasks?projectId=${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load tasks.");
      }

      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Load tasks error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load tasks.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = localStorage.getItem("taskmatrix_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          status: "todo",
          projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create task.");
      }

      setTasks((current) => [data.task, ...current]);

      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (error) {
      console.error("Create task error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to create task.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function updateTaskStatus(
    taskId: string,
    status: "todo" | "in-progress" | "done",
  ) {
    const token = localStorage.getItem("taskmatrix_token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update task.");
      }

      setTasks((current) =>
        current.map((task) => (task._id === taskId ? data.task : task)),
      );
    } catch (error) {
      console.error("Update task error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to update task.",
      );
    }
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    );
    setError("");
  }

  function closeEditModal() {
    if (saving) {
      return;
    }

    setEditingTask(null);
  }

  async function handleEditTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingTask) {
      return;
    }

    const token = localStorage.getItem("taskmatrix_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!editTitle.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          priority: editPriority,
          status: editStatus,
          dueDate: editDueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update task.");
      }

      setTasks((current) =>
        current.map((task) =>
          task._id === editingTask._id ? data.task : task,
        ),
      );

      setEditingTask(null);
    } catch (error) {
      console.error("Edit task error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to update task.",
      );
    } finally {
      setSaving(false);
    }
  }

  function openDeleteModal(task: Task) {
    setDeleteError("");
    setDeletingTask(task);
  }

  function closeDeleteModal() {
    setDeletingTask(null);
    setDeleteError("");
  }

  async function confirmDeleteTask() {
    if (!deletingTask) {
      return;
    }

    const token = localStorage.getItem("taskmatrix_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const taskToDelete = deletingTask;

    // Optimistic UI:
    // remove the task immediately before waiting for the API.
    setTasks((current) =>
      current.filter((task) => task._id !== taskToDelete._id),
    );

    setDeletingTask(null);
    setDeleteError("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/tasks/${taskToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete task.");
      }
    } catch (error) {
      console.error("Delete task error:", error);

      // Roll back the optimistic update if the API fails.
      setTasks((current) => {
        if (current.some((task) => task._id === taskToDelete._id)) {
          return current;
        }

        return [...current, taskToDelete];
      });

      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete task.",
      );
      setError(
        error instanceof Error ? error.message : "Unable to delete task.",
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem("taskmatrix_token");
    localStorage.removeItem("taskmatrix_user");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {project && (
          <div className="mb-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-blue-400">Project</p>

                <h1 className="mt-2 text-3xl font-bold">{project.name}</h1>

                <p className="mt-2 max-w-2xl text-slate-400">
                  {project.description || "No description provided."}
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium capitalize text-emerald-400">
                {project.status}
              </span>
            </div>
          </div>
        )}

        <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold">Create task</h2>

          <form
            onSubmit={handleCreateTask}
            className="mt-5 grid gap-4 md:grid-cols-2"
          >
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              required
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as "low" | "medium" | "high")
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Task description"
              rows={3}
              className="resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 md:col-span-2"
            />

            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {creating ? "Creating..." : "Create task"}
            </button>
          </form>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-slate-400">
            Loading tasks...
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {columns.map((column) => {
              const columnTasks = tasks.filter(
                (task) => task.status === column.key,
              );

              return (
                <section
                  key={column.key}
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();

                    if (draggedTaskId) {
                      updateTaskStatus(draggedTaskId, column.key);
                      setDraggedTaskId(null);
                    }
                  }}
                  className="min-h-[400px] rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold">{column.title}</h2>

                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <article
                        key={task._id}
                        draggable
                        onDragStart={() => setDraggedTaskId(task._id)}
                        onDragEnd={() => setDraggedTaskId(null)}
                        className={`cursor-grab rounded-xl border border-white/10 bg-slate-900 p-4 transition ${
                          draggedTaskId === task._id
                            ? "scale-[0.98] opacity-50"
                            : "hover:border-blue-500/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-medium">{task.title}</h3>

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-medium uppercase ${
                              task.priority === "high"
                                ? "bg-red-500/10 text-red-400"
                                : task.priority === "medium"
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="mt-2 text-sm leading-5 text-slate-400">
                            {task.description}
                          </p>
                        )}

                        {task.dueDate && (
                          <p className="mt-3 text-xs text-slate-500">
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {column.key !== "todo" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateTaskStatus(
                                  task._id,
                                  column.key === "done"
                                    ? "in-progress"
                                    : "todo",
                                )
                              }
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                              ← Move back
                            </button>
                          )}

                          {column.key !== "done" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateTaskStatus(
                                  task._id,
                                  column.key === "todo"
                                    ? "in-progress"
                                    : "done",
                                )
                              }
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                              {column.key === "todo" ? "Start →" : "Complete →"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openEditModal(task)}
                            className="rounded-lg border border-blue-500/20 px-3 py-1.5 text-xs text-blue-400 transition hover:bg-blue-500/10"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(task)}
                            className="ml-auto rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-600">
                        No tasks
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>

      {/* Edit Task Modal */}
      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-task-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="edit-task-title" className="text-xl font-semibold">
                  Edit task
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update the task details and save your changes.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                aria-label="Close edit task modal"
                className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditTask} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="edit-task-title"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Title
                </label>

                <input
                  id="edit-task-title"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  maxLength={150}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-task-description"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Description
                </label>

                <textarea
                  id="edit-task-description"
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="edit-task-priority"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Priority
                  </label>

                  <select
                    id="edit-task-priority"
                    value={editPriority}
                    onChange={(event) =>
                      setEditPriority(
                        event.target.value as "low" | "medium" | "high",
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-task-status"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Status
                  </label>

                  <select
                    id="edit-task-status"
                    value={editStatus}
                    onChange={(event) =>
                      setEditStatus(
                        event.target.value as "todo" | "in-progress" | "done",
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-task-due-date"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Due date
                  </label>

                  <input
                    id="edit-task-due-date"
                    type="date"
                    value={editDueDate}
                    onChange={(event) => setEditDueDate(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-task-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 id="delete-task-title" className="text-xl font-semibold">
              Delete task?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                "{deletingTask.title}"
              </span>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteTask}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Delete task
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
