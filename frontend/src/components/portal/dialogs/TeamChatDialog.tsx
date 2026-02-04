import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Wifi, WifiOff } from "lucide-react";
import { useProjectChat } from "@/hooks/useProjectChat";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TeamMember {
  name: string;
  role: string;
}

interface TeamChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  conversationId?: string;
  projectTitle: string;
  teamMembers: TeamMember[];
  mentors?: { id: string; username: string }[];
}

export function TeamChatDialog({ open, onOpenChange, projectId, conversationId, projectTitle, teamMembers, mentors }: TeamChatDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, isConnected } = useProjectChat({
    projectId,
    conversationId,
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
      <DialogContent className="max-w-lg h-[500px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
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
        
        <div className="flex-1 overflow-y-auto space-y-3 px-4 sm:px-6 py-2 custom-scrollbar">
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

        <div className="border-t border-border/50 p-4 sm:p-6 bg-muted/20">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Team</p>
              <div className="flex -space-x-2">
                {teamMembers.map((member, i) => (
                  <TooltipProvider key={i}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="w-6 h-6 border-2 border-background ring-1 ring-border/50">
                          <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs font-semibold">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground">{member.role}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {mentors && mentors.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-px h-4 bg-border hidden sm:block" />
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Mentors</p>
                <div className="flex -space-x-2">
                  {mentors.map((mentor, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="w-6 h-6 border-2 border-background ring-1 ring-border/50">
                            <AvatarFallback className="bg-orange-500/10 text-orange-500 text-[10px] font-bold">
                              {getInitials(mentor.username)}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs font-semibold">{mentor.username}</p>
                          <p className="text-[10px] text-muted-foreground">Mentor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}
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
