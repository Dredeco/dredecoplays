"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      setToken(res.token);
      router.replace("/painel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-violet-700 rounded flex items-center justify-center">
              <span className="text-white font-black text-lg">D</span>
            </div>
            <span className="font-black text-xl text-white">DREDECO PLAYS</span>
          </Link>
        </div>

        <div className="bg-[#13131a] rounded-xl border border-[#2a2a3a] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Painel Admin</h1>
          <p className="text-gray-400 text-sm mb-6">
            Entre com suas credenciais para acessar o painel
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-600"
                placeholder="admin@exemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/" className="text-violet-400 hover:text-violet-300">
              Voltar ao site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
