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

  getConversations: (authToken: string) =>
    apiFetch<
      paths["/api/v1/chat/conversations"]["get"]["responses"]["200"]["content"]["application/json"]
    >("/api/v1/chat/conversations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }),

  getConversationMessages: (conversationId: number, authToken: string) =>
    apiFetch<
      paths["/api/v1/chat/conversations/{conversation_id}"]["get"]["responses"]["200"]["content"]["application/json"]
    >(`/api/v1/chat/conversations/${conversationId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }),
};
