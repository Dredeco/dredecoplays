"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, getUser, removeToken, setUser } from "@/lib/auth";
import { getMe } from "@/lib/api";
import AdminSidebar from "@/components/admin/Sidebar";

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [fetchedUserName, setFetchedUserName] = useState<string | null>(null);

  const isLoginPage = pathname === "/painel/login";
  const token = mounted ? getToken() : null;

  const stored = mounted && token && !isLoginPage ? getUser() : null;
  const storedDisplayName = stored?.name || stored?.email || null;
  const userName = storedDisplayName ?? fetchedUserName;

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoginPage && !token) {
      router.replace("/painel/login");
    }
  }, [mounted, isLoginPage, token, router]);

  useEffect(() => {
    if (!mounted || isLoginPage || !token || storedDisplayName) return;
    getMe(token)
      .then((user) => {
        setUser(user);
        setFetchedUserName(user.name || user.email || null);
      })
      .catch(() => setFetchedUserName(null));
  }, [mounted, isLoginPage, token, storedDisplayName]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        {children}
      </div>
    );
  }

  if (!token) {
    return null; // Redirect in progress
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <AdminSidebar userName={userName} />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur border-b border-[#2a2a3a] px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">Painel</h1>
          <div className="flex items-center gap-4">
            {userName && (
              <span className="text-sm font-medium text-violet-300 truncate max-w-[180px]" title={userName}>
                {userName}
              </span>
            )}
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white"
            >
              Ver site
            </Link>
            <button
              onClick={() => {
                removeToken();
                router.replace("/painel/login");
              }}
              className="text-sm text-gray-400 hover:text-red-400"
            >
              Sair
            </button>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
