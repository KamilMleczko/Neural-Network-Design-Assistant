import { Send } from "lucide-react";
import { Button } from "@/src/ui/button";
import { Input } from "@/src/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatInput = ({ value, onChange, onSend, disabled }: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto flex max-w-5xl gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1"
        />
        <Button onClick={onSend} disabled={!value.trim() || disabled} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
