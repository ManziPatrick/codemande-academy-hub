import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Wifi, WifiOff } from "lucide-react";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useAuth } from "@/contexts/AuthContext";

interface TeamMember {
  name: string;
  role: string;
}

interface TeamChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  teamMembers: TeamMember[];
}

export function TeamChatDialog({ open, onOpenChange, projectTitle, teamMembers }: TeamChatDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Generate a stable room ID from the project title
  const roomId = `project-${projectTitle.toLowerCase().replace(/\s+/g, "-")}`;
  
  const { messages, sendMessage, isConnected } = useRealtimeChat({
    roomId,
    enabled: open,
  });

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isOwnMessage = (senderId: string) => user?.id === senderId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[500px] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Team Chat - {projectTitle}</DialogTitle>
            <div className="flex items-center gap-1 text-xs">
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Connecting...</span>
                </>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3 mt-4 p-2">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${isOwnMessage(msg.senderId) ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-accent/20 text-accent text-xs">
                  {getInitials(msg.sender)}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[70%] ${isOwnMessage(msg.senderId) ? "text-right" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-card-foreground">{msg.sender}</span>
                  <span className="text-xs text-card-foreground/50">{msg.time}</span>
                </div>
                <div className={`p-2 rounded-lg text-sm ${
                  isOwnMessage(msg.senderId)
                    ? "bg-accent text-accent-foreground" 
                    : "bg-background/50 text-card-foreground"
                }`}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border/50 pt-4">
          <div className="flex gap-2 mb-3">
            <p className="text-xs text-card-foreground/60">Team:</p>
            <div className="flex gap-1">
              {teamMembers.map((member, i) => (
                <Avatar key={i} className="w-6 h-6">
                  <AvatarFallback className="bg-accent/20 text-accent text-xs">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={!isConnected}
            />
            <Button variant="gold" size="icon" onClick={handleSend} disabled={!isConnected}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
