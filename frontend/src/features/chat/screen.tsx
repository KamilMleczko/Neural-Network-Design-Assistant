"use client";

import { Menu } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/src/providers/auth-provider";
import { Button } from "@/src/ui/button";
import { Card } from "@/src/ui/card";
import { Loader } from "@/src/ui/loading-screen";
import { ScrollArea } from "@/src/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/src/ui/sheet";
import { ChatInput } from "./components/chat-input";
import { ChatMessage } from "./components/chat-message";
import { useChat } from "./hooks/use-chat";
import { ChatSidebar } from "./sidebar";

export const ChatScreen = () => {
  const { loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    conversationId,
    conversations,
    isLoadingMessages,
    sendMessageMutation,
    handleSendMessage,
    handleNewChat,
    handleSelectConversation,
  } = useChat();

  //auto-scroll when messages or pending state changes
  const scrollToBottom = useCallback(() => {
    const scrollContainer = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 || sendMessageMutation.isPending) {
      scrollToBottom();
    }
  }, [messages.length, sendMessageMutation.isPending, scrollToBottom]);

  //wrap handlers to close mobile sidebar
  const onSelectConversation = (id: number) => {
    handleSelectConversation(id);
    setIsSidebarOpen(false);
  };

  const onNewChat = () => {
    handleNewChat();
    setIsSidebarOpen(false);
  };

  if (authLoading) return <Loader />;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden h-full transition-all duration-300 ease-in-out md:block",
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
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <div className="flex items-center border-b p-4 md:hidden">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetTitle className="sr-only">Chat Sidebar</SheetTitle>
              <ChatSidebar
                conversations={conversations}
                selectedId={conversationId}
                onSelect={onSelectConversation}
                onNewChat={onNewChat}
              />
            </SheetContent>
          </Sheet>
          <span className="ml-2 font-semibold">Chat</span>
        </div>

        <ScrollArea className="min-h-0 flex-1" ref={scrollRef}>
          <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
            {messages.length === 0 && !isLoadingMessages && (
              <div className="mt-20 text-center text-muted-foreground">
                <h2 className="mb-2 font-bold text-2xl">Welcome to NNDA Chat</h2>
                <p>Start a conversation with the AI assistant.</p>
              </div>
            )}

            {isLoadingMessages && messages.length === 0 ? (
              <div className="mt-20 flex justify-center">
                <Loader />
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <ChatMessage key={index} message={msg} />
                ))}
              </>
            )}

            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <Card className="bg-muted p-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 delay-75" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 delay-150" />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        <ChatInput
          onSend={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
};
