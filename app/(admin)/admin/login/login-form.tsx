"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-[#F5EFE3]/70 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-[#F5EFE3] text-sm focus:outline-none focus:border-[#C9A24B]"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] text-[#F5EFE3]/70 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-[#F5EFE3] text-sm focus:outline-none focus:border-[#C9A24B]"
        />
      </div>
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C9A24B] text-[#0B1B22] py-3 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
