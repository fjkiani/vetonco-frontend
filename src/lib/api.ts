/**
 * VetOnco API client — typed fetch wrapper for vetonco-backend
 */
const API_BASE = import.meta.env.VITE_API_URL || "https://vetonco-backend.onrender.com";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => apiFetch<{ status: string; version: string }>("/health"),

  // Canine endpoints
  score: (body: object, token?: string | null) =>
    apiFetch("/api/canine/tcc/score", { method: "POST", body: JSON.stringify(body) }, token),

  dosagePanel: (body: object, token?: string | null) =>
    apiFetch("/api/canine/tcc/dosage/panel", { method: "POST", body: JSON.stringify(body) }, token),

  recipe: (body: object, token?: string | null) =>
    apiFetch("/api/canine/tcc/recipe", { method: "POST", body: JSON.stringify(body) }, token),

  compounds: (body: object, token?: string | null) =>
    apiFetch("/api/canine/tcc/compounds", { method: "POST", body: JSON.stringify(body) }, token),

  logTest: (body: object, token?: string | null) =>
    apiFetch("/api/canine/tcc/tests", { method: "POST", body: JSON.stringify(body) }, token),

  analyzeTest: (body: object, token?: string | null) =>
    apiFetch("/api/canine/tcc/analyze-tests", { method: "POST", body: JSON.stringify(body) }, token),

  // Agent endpoints
  agentMonitor: (body: object, token?: string | null) =>
    apiFetch("/api/canine/agent/monitor", { method: "POST", body: JSON.stringify(body) }, token),

  agentHealth: () => apiFetch("/api/canine/agent/health"),
};

export { API_BASE };
