import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_USERS, GET_CONVERSATIONS, GET_MESSAGES } from '@/lib/graphql/queries';
import { SEND_MESSAGE } from '@/lib/graphql/mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Search, MessageSquare, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/hooks/use-socket';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { PortalLayout } from '@/components/portal/PortalLayout';

export function Chat() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  
  const { user } = useAuth();
  const socket = useSocket();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: usersData } = useQuery(GET_USERS);
  const { data: conversationsData, refetch: refetchConversations } = useQuery(GET_CONVERSATIONS);
  
  const { data: messagesData, refetch: refetchMessages } = useQuery(GET_MESSAGES, {
    variables: { conversationId: activeConversation },
    skip: !activeConversation || activeConversation === 'new'
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  // Listen for messages via global socket
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (newMessage: any) => {
        if (activeConversation === newMessage.conversationId) {
            refetchMessages(); 
        }
        refetchConversations();
    });

    return () => {
        socket.off('receive_message');
    }
  }, [socket, activeConversation, refetchMessages, refetchConversations]);

  // Sync state
  useEffect(() => {
    if ((conversationsData as any)?.conversations) {
        setConversations((conversationsData as any).conversations);
    }
  }, [conversationsData]);

  useEffect(() => {
    if ((messagesData as any)?.messages) {
        setActiveMessages((messagesData as any).messages);
    }
  }, [messagesData]);
  
  useEffect(() => {
     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleUserSelect = (targetUser: any) => {
      setSelectedUser(targetUser);
      // Check if we already have a conversation with this user
      const existingConv = conversations.find(c => 
          c.participants.some((p: any) => p.id === targetUser.id)
      );
      
      if (existingConv) {
          setActiveConversation(existingConv.id);
      } else {
          setActiveConversation('new');
          setActiveMessages([]);
      }
  };

  const handleSend = async () => {
      if (!message.trim() || !selectedUser) return;
      
      try {
          const content = message;
          setMessage('');
          
          const { data } = await sendMessage({
              variables: { 
                  receiverId: selectedUser.id,
                  content
              }
          });
          
          if (activeConversation === 'new') {
              setActiveConversation((data as any).sendMessage.conversationId);
              refetchConversations();
          }
          
          refetchMessages();

      } catch (err) {
          console.error("Failed to send message", err);
      }
  };

  const myId = user?.id;

  return (
    <PortalLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">
          {/* Sidebar: Users & Conversations */}
          <Card className="w-full lg:w-[380px] border-border/50 flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm shadow-xl">
               <CardHeader className="border-b border-border/50 bg-card/80 p-4 shrink-0">
                  <CardTitle className="text-xl font-heading flex items-center gap-2 text-foreground">
                      <MessageSquare className="h-5 w-5 text-accent" /> Messages
                  </CardTitle>
               </CardHeader>
               
               <div className="p-3 border-b border-border/50 bg-background/30">
                   <div className="relative">
                       <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input placeholder="Search people..." className="pl-9 bg-background/50 border-border/50 rounded-lg focus-visible:ring-accent" />
                   </div>
               </div>

               <ScrollArea className="flex-1">
                   <div className="p-2 space-y-4">
                      {/* Active Chat Conversations First */}
                      {conversations.length > 0 && (
                          <div>
                              <p className="px-3 text-[10px] font-bold text-accent uppercase tracking-wider mb-2">Recent Chats</p>
                              <div className="space-y-1">
                                  {conversations.map((conv: any) => {
                                      const otherUser = conv.participants.find((p: any) => p.id !== myId);
                                      const isActive = activeConversation === conv.id;
                                      return (
                                          <div 
                                              key={conv.id}
                                              onClick={() => {
                                                  setSelectedUser(otherUser);
                                                  setActiveConversation(conv.id);
                                              }}
                                              className={cn(
                                                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent group",
                                                  isActive 
                                                      ? "bg-accent/10 border-accent/20 shadow-sm" 
                                                      : "hover:bg-accent/5 hover:border-border/30"
                                              )}
                                          >
                                              <div className="relative">
                                                  <Avatar className="h-11 w-11 border border-border/50 shadow-sm transition-transform group-hover:scale-105">
                                                      <AvatarFallback className="bg-accent/10 text-accent font-bold">
                                                          {otherUser?.username.substring(0,2).toUpperCase()}
                                                      </AvatarFallback>
                                                  </Avatar>
                                                  {otherUser?.isOnline && (
                                                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></span>
                                                  )}
                                              </div>
                                              <div className="flex-1 overflow-hidden">
                                                  <div className="flex justify-between items-center mb-0.5">
                                                      <h4 className={cn("font-bold text-sm truncate", isActive ? "text-accent" : "text-foreground")}>
                                                          {otherUser?.username}
                                                      </h4>
                                                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                          {conv.lastMessage ? new Date(parseInt(conv.lastMessage.createdAt)).toLocaleDateString([], {month: 'short', day: 'numeric'}) : ''}
                                                      </span>
                                                  </div>
                                                  <p className="text-xs text-muted-foreground truncate leading-snug">
                                                      {conv.lastMessage?.content || 'No messages yet'}
                                                  </p>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      )}

                      {/* All Users Second */}
                      <div>
                          <p className="px-3 text-[10px] font-bold text-accent uppercase tracking-wider mb-2 mt-4">All Contacts</p>
                          <div className="space-y-1">
                              {(usersData as any)?.users?.filter((u: any) => u.id !== myId).map((u: any) => (
                                  <div 
                                      key={u.id}
                                      onClick={() => handleUserSelect(u)}
                                      className={cn(
                                          "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent hover:bg-accent/5 hover:border-border/30 group",
                                          selectedUser?.id === u.id && activeConversation === 'new' ? 'bg-accent/10 border-accent/20' : ''
                                      )}
                                  >
                                      <Avatar className="h-10 w-10 border border-border/50 shadow-sm group-hover:scale-105 transition-transform">
                                          <AvatarFallback className="bg-accent/5 text-accent/60">{u.username.substring(0,2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 overflow-hidden text-left">
                                          <h4 className="font-bold text-sm truncate text-foreground/80">{u.username}</h4>
                                          <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                   </div>
               </ScrollArea>
          </Card>

          {/* Main Chat Area */}
          <Card className="flex-1 border-border/50 flex flex-col overflow-hidden bg-card/30 backdrop-blur-md shadow-xl">
               {selectedUser ? (
                   <>
                      <CardHeader className="bg-card/40 border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between shrink-0">
                          <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border border-accent/20">
                                  <AvatarFallback className="bg-accent text-accent-foreground font-bold">
                                      {selectedUser.username.substring(0,2).toUpperCase()}
                                  </AvatarFallback>
                              </Avatar>
                              <div>
                                  <h3 className="font-heading text-lg font-bold text-foreground">{selectedUser.username}</h3>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className={cn("w-2 h-2 rounded-full", selectedUser.isOnline ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30")}></span>
                                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                                          {selectedUser.isOnline ? 'Online Now' : 'Offline'}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </CardHeader>
                      
                      <CardContent className="flex-1 p-0 overflow-hidden relative bg-background/20">
                          <ScrollArea className="h-full p-6">
                              <div className="flex flex-col gap-6 pb-6">
                                  {activeConversation === 'new' && (
                                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground max-w-sm mx-auto text-center">
                                          <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mb-4">
                                              <MessageSquare className="w-8 h-8 opacity-20" />
                                          </div>
                                          <h4 className="font-heading text-lg font-medium text-foreground mb-1">Start a conversation</h4>
                                          <p className="text-sm">Say hello to {selectedUser.username} and begin your educational journey together.</p>
                                      </div>
                                  )}
                                  
                                  {activeMessages.map((msg: any, idx: number) => {
                                      const isMe = msg.sender.id === myId;
                                      const showDate = idx === 0 || new Date(parseInt(activeMessages[idx-1].createdAt)).toDateString() !== new Date(parseInt(msg.createdAt)).toDateString();
                                      
                                      return (
                                          <div key={msg.id} className="space-y-4">
                                              {showDate && (
                                                  <div className="flex justify-center items-center gap-4 py-2">
                                                      <div className="h-px bg-border/50 flex-1"></div>
                                                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] bg-background/50 px-2 py-1 rounded-full border border-border/30 shadow-sm">
                                                          {new Date(parseInt(msg.createdAt)).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                                      </span>
                                                      <div className="h-px bg-border/50 flex-1"></div>
                                                  </div>
                                              )}
                                              <div className={cn("flex w-full group", isMe ? 'justify-end' : 'justify-start')}>
                                                  <div className={cn(
                                                      "flex flex-col max-w-[75%] lg:max-w-[60%] space-y-1",
                                                      isMe ? "items-end text-right" : "items-start text-left"
                                                  )}>
                                                      <div className={cn(
                                                          "p-3.5 px-5 rounded-2xl text-sm shadow-sm transition-all",
                                                          isMe 
                                                              ? "bg-accent text-accent-foreground rounded-tr-none border border-accent/20" 
                                                              : "bg-card text-card-foreground border border-border/50 rounded-tl-none group-hover:border-accent/30"
                                                      )}>
                                                          <p className="leading-relaxed">{msg.content}</p>
                                                      </div>
                                                      <div className="flex items-center gap-1.5 px-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                          <Clock className="w-3 h-3 text-muted-foreground" />
                                                          <span className="text-[10px] text-muted-foreground font-medium">
                                                              {new Date(parseInt(msg.createdAt)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                          </span>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      )
                                  })}
                                  <div ref={bottomRef} />
                              </div>
                          </ScrollArea>
                      </CardContent>

                      <div className="p-4 lg:p-6 bg-card/40 border-t border-border/50 flex gap-3 items-center shrink-0">
                          <Input 
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                              placeholder="Type your message..."
                              className="flex-1 h-12 rounded-xl bg-background border-border/50 focus-visible:ring-accent px-5"
                          />
                          <Button 
                              onClick={handleSend} 
                              size="icon" 
                              className="h-12 w-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/10 transition-all hover:scale-105 active:scale-95"
                          >
                              <Send className="h-5 w-5" />
                          </Button>
                      </div>
                   </>
               ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background/5">
                       <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6 relative">
                          <MessageSquare className="h-10 w-10 text-accent animate-pulse" />
                          <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping"></div>
                       </div>
                       <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Your Classroom Chat</h3>
                       <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                          Select a fellow student or mentor from the sidebar to begin collaborating in real-time.
                       </p>
                       <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                          <div className="p-4 rounded-xl bg-card border border-border/50 flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center mb-2 text-accent font-bold">1k+</div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Active Users</span>
                          </div>
                          <div className="p-4 rounded-xl bg-card border border-border/50 flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center mb-2 text-accent font-bold">24/7</div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Support</span>
                          </div>
                       </div>
                   </div>
               )}
          </Card>
      </div>
    </PortalLayout>
  );
}
