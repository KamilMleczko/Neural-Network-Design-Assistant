import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { chatApi } from "@/src/api/client";
import { useAuth } from "@/src/providers/auth-provider";
import { createClient } from "@/src/utils/supabase/client";
import { useSendMessageMutation } from "./use-send-message";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);

  //fetch conversations
  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) return [];
      return chatApi.getConversations(session.access_token);
    },
    enabled: !!user,
  });

  //fetch messages when conversationId changes
  const { data: conversationMessages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) return [];
      return chatApi.getConversationMessages(conversationId, session.access_token);
    },
    enabled: !!conversationId && !!user,
  });

  //update messages when conversationMessages changes
  useEffect(() => {
    if (conversationMessages) {
      setMessages(
        conversationMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      );
    }
  }, [conversationMessages]);

  const sendMessageMutation = useSendMessageMutation({
    conversationId,
    setConversationId,
    setMessages,
    refetchConversations,
  });

  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const userMessage = content;

    //optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    sendMessageMutation.mutate(userMessage);
  }, [conversationId, sendMessageMutation]);

  const handleNewChat = useCallback(() => {
    setConversationId(null);
    setMessages([]);
  }, []);

  const handleSelectConversation = useCallback((id: number) => {
    setConversationId(id);
    setMessages([]);
  }, []);

  return {
    messages,
    conversationId,
    conversations,
    isLoadingMessages,
    sendMessageMutation,
    handleSendMessage,
    handleNewChat,
    handleSelectConversation,
  };
};
