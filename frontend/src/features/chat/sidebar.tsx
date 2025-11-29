import { MessageSquare, PanelLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { components } from "@/src/types/api";
import { Button } from "@/src/ui/button";
import { ScrollArea } from "@/src/ui/scroll-area";

type UserConversation = components["schemas"]["UserConversationRead"];

interface ChatSidebarProps {
  conversations: UserConversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNewChat: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const ChatSidebar = ({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
  isCollapsed = false,
  onToggleCollapse,
  className,
}: ChatSidebarProps) => {
  if (isCollapsed) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center gap-4 border-r bg-muted/10 py-4",
          className,
        )}
      >
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} title="Expand sidebar">
          <PanelLeft className="h-5 w-5" />
        </Button>
        <Button onClick={onNewChat} size="icon" variant="default" title="New Chat">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col border-r bg-muted/10", className)}>
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <Button onClick={onNewChat} className="flex-1 justify-start gap-2" variant="default">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        {onToggleCollapse && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} title="Collapse sidebar">
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-2">
          {conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={selectedId === conv.id ? "secondary" : "ghost"}
              className={cn(
                "h-auto w-full justify-start gap-2 px-4 py-3 text-left font-normal",
                selectedId === conv.id && "bg-accent text-accent-foreground",
              )}
              onClick={() => onSelect(conv.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="truncate font-medium text-sm">{conv.title}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {new Date(conv.created_at).toLocaleDateString()}
                </span>
              </div>
            </Button>
          ))}
          {conversations.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No conversations yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
