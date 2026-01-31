import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface ChatMessage {
  id: string;
  sender: string;
  senderId: string;
  message: string;
  time: string;
  timestamp: number;
}

interface UseRealtimeChatOptions {
  roomId: string;
  enabled?: boolean;
}

export function useRealtimeChat({ roomId, enabled = true }: UseRealtimeChatOptions) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Initialize channel and subscribe to messages
  useEffect(() => {
    if (!enabled || !roomId) return;

    const channelName = `chat:${roomId}`;
    const newChannel = supabase.channel(channelName, {
      config: {
        broadcast: { self: true },
        presence: { key: user?.id || "anonymous" },
      },
    });

    // Listen for broadcast messages
    newChannel
      .on("broadcast", { event: "message" }, ({ payload }) => {
        const newMessage = payload as ChatMessage;
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      })
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
      setChannel(null);
      setIsConnected(false);
    };
  }, [roomId, enabled, user?.id]);

  // Send a message to the channel
  const sendMessage = useCallback(
    async (text: string) => {
      if (!channel || !text.trim() || !user) return;

      const newMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: user.fullName,
        senderId: user.id,
        message: text.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: Date.now(),
      };

      await channel.send({
        type: "broadcast",
        event: "message",
        payload: newMessage,
      });
    },
    [channel, user]
  );

  // Clear messages (useful when switching rooms)
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isConnected,
  };
}
