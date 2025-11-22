import type { paths } from "../../types/api";
import { apiFetch } from "../fetch";

// Type definitions based on generated API types
type CheckEmailResponse =
  paths["/api/v1/auth/check-email/{email}"]["get"]["responses"]["200"]["content"]["application/json"];
type CreateUserRequest =
  paths["/api/v1/auth/create-user"]["post"]["requestBody"]["content"]["application/json"];
type CreateUserResponse =
  paths["/api/v1/auth/create-user"]["post"]["responses"]["200"]["content"]["application/json"];
type GetMeResponse =
  paths["/api/v1/auth/me"]["get"]["responses"]["200"]["content"]["application/json"];

export const authApi = {
  // Check if email exists before registration
  checkEmail: (email: string) =>
    apiFetch<CheckEmailResponse>(`/api/v1/auth/check-email/${encodeURIComponent(email)}`),

  // Create user in database after Supabase signup
  createUser: (userData: CreateUserRequest, authToken: string) =>
    apiFetch<CreateUserResponse>("/api/v1/auth/create-user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }),

  // Get current user info
  getMe: (authToken: string) =>
    apiFetch<GetMeResponse>("/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }),
};
