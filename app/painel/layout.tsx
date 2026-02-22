"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, removeToken } from "@/lib/auth";
import AdminSidebar from "@/components/admin/Sidebar";

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === "/painel/login";
  const token = mounted ? getToken() : null;

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
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur border-b border-[#2a2a3a] px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">Painel</h1>
          <div className="flex items-center gap-4">
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
