import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

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

const mockMessages = [
  { id: 1, sender: "Jean Baptiste", message: "Hey team! How's the progress?", time: "10:30 AM" },
  { id: 2, sender: "Marie Uwase", message: "Backend API is ready!", time: "10:32 AM" },
  { id: 3, sender: "Emmanuel K.", message: "Great! I'll integrate it with the UI", time: "10:35 AM" },
];

export function TeamChatDialog({ open, onOpenChange, projectTitle, teamMembers }: TeamChatDialogProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      message: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Team Chat - {projectTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3 mt-4 p-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.sender === "You" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-accent/20 text-accent text-xs">
                  {getInitials(msg.sender)}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[70%] ${msg.sender === "You" ? "text-right" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-card-foreground">{msg.sender}</span>
                  <span className="text-xs text-card-foreground/50">{msg.time}</span>
                </div>
                <div className={`p-2 rounded-lg text-sm ${
                  msg.sender === "You" 
                    ? "bg-accent text-accent-foreground" 
                    : "bg-background/50 text-card-foreground"
                }`}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
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
            />
            <Button variant="gold" size="icon" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
