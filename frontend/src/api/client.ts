// Re-export all API endpoints organized by router (matching FastAPI structure)
// Import like this: import { authApi, rootApi } from '@/src/api/client';
// Use like this: authApi.checkEmail('user@example.com') or rootApi.getRoot()
// This mirrors the FastAPI router organization for consistency

export { API_CONFIG } from "./config";
export { authApi } from "./endpoints/auth";
// Router-based API exports (matches FastAPI routers)
export { rootApi } from "./endpoints/root";

// Re-export useful types and utilities
export { ApiError } from "./fetch";

import { authApi } from "./endpoints/auth";
// Import for convenience object
import { rootApi } from "./endpoints/root";

// Convenience object for organized access (optional)
export const api = {
  root: rootApi,
  auth: authApi,
} as const;
