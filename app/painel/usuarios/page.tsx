"use client";

import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { User } from "@/lib/types";
import type { CreateUserDto, UpdateUserDto } from "@/lib/types";

const INPUT_CLASS =
  "w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white focus:outline-none focus:border-violet-600";
const BTN_PRIMARY = "px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium";
const BTN_SECONDARY = "px-4 py-2 rounded-lg bg-[#1c1c28] text-gray-400 hover:text-white";

export default function UsuariosPage() {
  const token = getToken();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor",
  });

  useEffect(() => {
    if (!token) return;
    getUsers(token)
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (form.password.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    try {
      const dto: CreateUserDto = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      const user = await createUser(dto, token);
      setUsers((u) => [...u, user]);
      setCreating(false);
      setForm({ name: "", email: "", password: "", role: "editor" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar usuário");
    }
  }

  async function handleUpdate(e: React.FormEvent, id: number) {
    e.preventDefault();
    if (!token) return;
    try {
      const dto: UpdateUserDto = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (form.password.trim()) {
        dto.password = form.password;
        if (dto.password.length < 6) {
          alert("A senha deve ter no mínimo 6 caracteres");
          return;
        }
      }
      const user = await updateUser(id, dto, token);
      setUsers((u) => u.map((x) => (x.id === id ? user : x)));
      setEditingId(null);
      setForm({ name: "", email: "", password: "", role: "editor" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar usuário");
    }
  }

  async function handleDelete(user: User) {
    if (!confirm(`Excluir usuário "${user.name}"?`)) return;
    if (!token) return;
    try {
      await deleteUser(user.id, token);
      setUsers((u) => u.filter((x) => x.id !== user.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir usuário");
    }
  }

  if (!token) return null;
  if (loading) return <div className="text-gray-500">Carregando...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Usuários</h2>

      {creating ? (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-xl bg-[#13131a] border border-[#2a2a3a] mb-4 space-y-3"
        >
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nome"
            required
            className={INPUT_CLASS}
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Email"
            required
            className={INPUT_CLASS}
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Senha (mínimo 6 caracteres)"
            required
            minLength={6}
            className={INPUT_CLASS}
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "editor" }))}
            className={INPUT_CLASS}
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className={BTN_PRIMARY}>
              Criar
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className={BTN_SECONDARY}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="mb-6 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium"
        >
          Novo usuário
        </button>
      )}

      <div className="space-y-2">
        {users.map((user) =>
          editingId === user.id ? (
            <form
              key={user.id}
              onSubmit={(e) => handleUpdate(e, user.id)}
              className="p-4 rounded-xl bg-[#13131a] border border-[#2a2a3a] space-y-3"
            >
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nome"
                required
                className={INPUT_CLASS}
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Email"
                required
                className={INPUT_CLASS}
              />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Nova senha (deixe vazio para não alterar)"
                className={INPUT_CLASS}
              />
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "editor" }))}
                className={INPUT_CLASS}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className={BTN_PRIMARY}>
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", email: "", password: "", role: "editor" });
                  }}
                  className={BTN_SECONDARY}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-xl bg-[#13131a] border border-[#2a2a3a]"
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{user.name}</span>
                <span className="text-gray-500 text-sm">{user.email}</span>
                <span className="text-gray-400 text-xs px-2 py-0.5 rounded bg-[#1c1c28]">
                  {user.role ?? "editor"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(user.id);
                    setForm({
                      name: user.name,
                      email: user.email ?? "",
                      password: "",
                      role: (user.role as "admin" | "editor") ?? "editor",
                    });
                  }}
                  className="text-sm text-violet-400 hover:text-violet-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Excluir
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
