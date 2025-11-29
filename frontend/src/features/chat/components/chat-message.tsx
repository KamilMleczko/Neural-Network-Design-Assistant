import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Card } from "@/src/ui/card";
import type { Message } from "../hooks/use-chat";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <Card
        className={cn(
          "max-w-[80%] p-3",
          message.role === "user"
            ? "bg-popover text-popover-foreground"
            : "bg-ai-message text-ai-message-foreground",
        )}
      >
        <div className={cn("prose dark:prose-invert max-w-none text-sm")}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
};
