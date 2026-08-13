"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-red-300">
        Secure desk
      </p>
      <h1 className="mt-2 font-serif text-4xl text-sheet">Admin sign in</h1>
      <p className="mt-2 text-sm text-slate-400">
        Email and password come from the server env. Nothing is stored in the browser except an
        httpOnly cookie.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <label className="block text-sm">
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-slate-600 bg-slate-900 px-3 py-2 text-sheet"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-slate-600 bg-slate-900 px-3 py-2 text-sheet"
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-red-700 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {busy ? "Checking…" : "Unlock desk"}
        </button>
      </form>
    </div>
  );
}
