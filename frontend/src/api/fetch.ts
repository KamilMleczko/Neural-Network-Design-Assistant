import { API_CONFIG } from "./config";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public response?: Response,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new ApiError(res.status, `API Error: ${res.status} ${res.statusText}`, res);
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    throw new Error(error instanceof Error ? error.message : "Network error");
  }
}
