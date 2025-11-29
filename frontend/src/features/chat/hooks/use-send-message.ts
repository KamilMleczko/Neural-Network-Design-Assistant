import { useMutation } from "@tanstack/react-query";
import { chatApi } from "@/src/api/client";
import { createClient } from "@/src/utils/supabase/client";
import { simulateStreaming } from "../utils";
import type { Message } from "./use-chat";

interface UseSendMessageProps {
  conversationId: number | null;
  setConversationId: (id: number) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  refetchConversations: () => void;
}

export const useSendMessageMutation = ({
  conversationId,
  setConversationId,
  setMessages,
  refetchConversations,
}: UseSendMessageProps) => {
  return useMutation({
    mutationFn: async (content: string) => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("Not authenticated");
      }

      return chatApi.sendMessage(
        {
          content,
          conversation_id: conversationId,
          role: "user",
        },
        token,
      );
    },
    onSuccess: (data) => {
      if (data) {
        //add empty assistant message first
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        simulateStreaming(
          data.content,
          (currentContent) => {
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg.role === "assistant") {
                lastMsg.content = currentContent;
              }
              return newMessages;
            });
          },
          () => {
            //ensure full content is set at the end
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg.role === "assistant") {
                lastMsg.content = data.content;
              }
              return newMessages;
            });
          },
        );

        if (data.conversation_id) {
          const isNewConversation = !conversationId;
          setConversationId(data.conversation_id);
          if (isNewConversation) {
            refetchConversations();
          }
        }
      }
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
  });
};
