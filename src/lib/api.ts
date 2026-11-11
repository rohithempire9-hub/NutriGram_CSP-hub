import type { AuthUser, ChildRecord, Mandal } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return payload as T;
}

export async function loginAdmin(username: string, password: string): Promise<AuthUser> {
  const result = await request<{ user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return result.user;
}

export async function getCurrentAdmin(): Promise<AuthUser> {
  const result = await request<{ user: AuthUser }>("/auth/me");
  return result.user;
}

export async function logoutAdmin(): Promise<void> {
  await request<{ message: string }>("/auth/logout", { method: "POST" });
}

export const getChildren = () => request<ChildRecord[]>("/children");

export const createChild = (data: Omit<ChildRecord, "id" | "createdAt">) =>
  request<ChildRecord>("/children", { method: "POST", body: JSON.stringify(data) });

export const updateChild = (id: string, data: Omit<ChildRecord, "id" | "createdAt">) =>
  request<ChildRecord>(`/children/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteChild = (id: string) =>
  request<{ message: string }>(`/children/${encodeURIComponent(id)}`, { method: "DELETE" });

export const getMandals = () => request<Mandal[]>("/mandals");

export const createMandal = (data: Mandal) =>
  request<Mandal>("/mandals", { method: "POST", body: JSON.stringify(data) });

export const updateMandal = (id: string, data: Mandal) =>
  request<Mandal>(`/mandals/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteMandal = (id: string) =>
  request<{ message: string }>(`/mandals/${encodeURIComponent(id)}`, { method: "DELETE" });
