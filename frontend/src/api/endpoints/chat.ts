import type { paths } from "../../types/api";
import { apiFetch } from "../fetch";

type ChatRequest =
  paths["/api/v1/chat/message"]["post"]["requestBody"]["content"]["application/json"];
type ChatResponse =
  paths["/api/v1/chat/message"]["post"]["responses"]["200"]["content"]["application/json"];

export const chatApi = {
  sendMessage: (messageData: ChatRequest, authToken: string) =>
    apiFetch<ChatResponse>("/api/v1/chat/message", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    }),
};
