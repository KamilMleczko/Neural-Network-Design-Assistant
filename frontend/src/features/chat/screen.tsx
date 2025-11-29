"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Menu } from "lucide-react";
import { Button } from "@/src/ui/button";
import { Input } from "@/src/ui/input";
import { ScrollArea } from "@/src/ui/scroll-area";
import { Card } from "@/src/ui/card";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/src/ui/sheet";
import { chatApi } from "@/src/api/client";
import { createClient } from "@/src/utils/supabase/client";
import { useAuth } from "@/src/providers/auth-provider";
import { Loader } from "@/src/ui/loading-screen";
import { cn } from "@/lib/utils";
import { ChatSidebar } from "./sidebar";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const ChatScreen = () => {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
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

  // Fetch messages when conversationId changes
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

  // Update messages when conversationMessages changes
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

  // Auto-scroll when messages or pending state changes
  const scrollToBottom = useCallback(() => {
    const scrollContainer = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, []);

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

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue("");

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    sendMessageMutation.mutate(userMessage);
  }, [inputValue, conversationId, sendMessageMutation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleNewChat = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  }, []);

  const handleSelectConversation = useCallback((id: number) => {
    setConversationId(id);
    setIsSidebarOpen(false);
  }, []);

  // Auto-scroll when messages or pending state changes
  useEffect(() => {
    if (messages.length > 0 || sendMessageMutation.isPending) {
      scrollToBottom();
    }
  }, [messages.length, sendMessageMutation.isPending, scrollToBottom]);

  if (authLoading) return <Loader />;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:block h-full transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-16" : "w-80",
        )}
      >
        <ChatSidebar
          conversations={conversations}
          selectedId={conversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b flex items-center">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SheetTitle className="sr-only">Chat Sidebar</SheetTitle>
              <ChatSidebar
                conversations={conversations}
                selectedId={conversationId}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
              />
            </SheetContent>
          </Sheet>
          <span className="ml-2 font-semibold">Chat</span>
        </div>

        <ScrollArea className="flex-1 min-h-0" ref={scrollRef}>
          <div className="flex flex-col gap-4 max-w-3xl mx-auto p-4">
            {messages.length === 0 && !isLoadingMessages && (
              <div className="text-center text-muted-foreground mt-20">
                <h2 className="text-2xl font-bold mb-2">Welcome to NNDA Chat</h2>
                <p>Start a conversation with the AI assistant.</p>
              </div>
            )}

            {isLoadingMessages ? (
              <div className="flex justify-center mt-20">
                <Loader />
              </div>
            ) : (
              <>
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
              </>
            )}

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
    </div>
  );
};
