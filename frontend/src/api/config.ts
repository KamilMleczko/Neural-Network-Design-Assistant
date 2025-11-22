import { env } from "@/src/config/env";

export const API_CONFIG = {
  BASE_URL: env.NEXT_PUBLIC_API_BASE_URL,
  TIMEOUT: 10000,
} as const;
