import type { paths } from "../../types/api";
import { apiFetch } from "../fetch";

type RootResponse = paths["/"]["get"]["responses"]["200"]["content"]["application/json"];

export const rootApi = {
  getRoot: () => apiFetch<RootResponse>("/"),
};
