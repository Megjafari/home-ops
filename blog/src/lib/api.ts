// Empty base means same-origin (API served behind the same ingress).
export const API_BASE: string =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:5062" : "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function errorMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  try {
    const body = JSON.parse(text);
    if (body?.errors) return Object.values<string[]>(body.errors).flat().join(" ");
    if (typeof body === "string") return body;
  } catch {
    // not JSON, fall through
  }
  return text || `Request failed (${res.status})`;
}

export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && token) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!res.ok) {
    throw new ApiError(res.status, await errorMessage(res));
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export async function publicFetch(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}