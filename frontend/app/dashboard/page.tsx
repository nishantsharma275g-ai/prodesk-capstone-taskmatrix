"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
type User = {
  id: string;
  name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("taskmatrix_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("taskmatrix_token");
          localStorage.removeItem("taskmatrix_user");

          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Authentication check failed:", error);

        localStorage.removeItem("taskmatrix_token");
        localStorage.removeItem("taskmatrix_user");

        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("taskmatrix_token");
    localStorage.removeItem("taskmatrix_user");

    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Checking authentication...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold">TaskMatrix</h1>
            <p className="text-sm text-slate-500">
              Agile Project Management Platform
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm font-medium text-blue-400">
            AUTHENTICATED WORKSPACE
          </p>

          <h2 className="mt-3 text-3xl font-bold">Welcome, {user.name}</h2>

          <p className="mt-2 text-slate-400">
            You are successfully authenticated with TaskMatrix.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Name</p>
              <p className="mt-1 font-medium">{user.name}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
