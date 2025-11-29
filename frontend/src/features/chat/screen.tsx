"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Button } from "@/src/ui/button";
import { Input } from "@/src/ui/input";
import { ScrollArea } from "@/src/ui/scroll-area";
import { Card } from "@/src/ui/card";
import { chatApi } from "@/src/api/client";
import { createClient } from "@/src/utils/supabase/client";
import { useAuth } from "@/src/providers/auth-provider";
import { Loader } from "@/src/ui/loading-screen";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const ChatScreen = () => {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useMutation({
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
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        if (data.conversation_id) {
          setConversationId(data.conversation_id);
        }
      }
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      // Optionally handle error state (e.g. toast)
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue("");

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    sendMessageMutation.mutate(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, sendMessageMutation.isPending]);

  if (authLoading) return <Loader />;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-20">
              <h2 className="text-2xl font-bold mb-2">Welcome to NNDA Chat</h2>
              <p>Start a conversation with the AI assistant.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-3 ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </Card>
            </div>
          ))}

          {sendMessageMutation.isPending && (
            <div className="flex justify-start">
              <Card className="bg-muted p-3">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-150" />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={sendMessageMutation.isPending}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || sendMessageMutation.isPending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
