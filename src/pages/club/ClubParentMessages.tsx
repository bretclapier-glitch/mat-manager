import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageSquare, Search, Loader2, Hash, Lock, Send,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Channel = {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  club_id: string;
};

type ChannelMessage = {
  id: string;
  channel_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  profiles?: { full_name: string } | null;
};

export default function ClubParentMessages() {
  const { clubSlug } = useParams();
  const { user, profile } = useAuth();

  const [clubId, setClubId] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clubSlug) loadClubAndChannels(clubSlug);
  }, [clubSlug, user]);

  useEffect(() => {
    if (selectedChannel) loadMessages(selectedChannel.id);
  }, [selectedChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    if (!selectedChannel) return;
    const subscription = supabase
      .channel(`parent-channel-${selectedChannel.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'channel_messages',
        filter: `channel_id=eq.${selectedChannel.id}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('channel_messages')
          .select('*, profiles(full_name)')
          .eq('id', payload.new.id)
          .single();
        if (data) setMessages(prev => [...prev, data as ChannelMessage]);
      })
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, [selectedChannel]);

  async function loadClubAndChannels(slug: string) {
    setLoadingChannels(true);
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let club = null;
      if (uuidRegex.test(slug)) {
        const { data } = await supabase.from('clubs').select('id').eq('id', slug).maybeSingle();
        club = data;
      } else {
        const { data } = await supabase.from('clubs').select('id').eq('slug', slug).maybeSingle();
        club = data;
      }
      if (!club) { setLoadingChannels(false); return; }
      setClubId(club.id);

      // Get public channels + private channels parent is a member of
      const [{ data: publicChannels }, { data: privateChannels }] = await Promise.all([
        supabase
          .from('message_channels')
          .select('*')
          .eq('club_id', club.id)
          .eq('is_private', false)
          .order('name'),
        supabase
          .from('message_channels')
          .select('*, channel_members!inner(profile_id)')
          .eq('club_id', club.id)
          .eq('is_private', true)
          .eq('channel_members.profile_id', user?.id ?? ''),
      ]);

      const allChannels = [
        ...(publicChannels ?? []),
        ...(privateChannels ?? []),
      ].sort((a, b) => a.name.localeCompare(b.name)) as Channel[];

      setChannels(allChannels);
      if (allChannels.length > 0) setSelectedChannel(allChannels[0]);
    } catch (err) {
      console.error('Channels load error:', err);
    } finally {
      setLoadingChannels(false);
    }
  }

  async function loadMessages(channelId: string) {
    setLoadingMessages(true);
    const { data } = await supabase
      .from('channel_messages')
      .select('*, profiles(full_name)')
      .eq('channel_id', channelId)
      .order('created_at')
      .limit(50);
    setMessages((data ?? []) as ChannelMessage[]);
    setLoadingMessages(false);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedChannel || !profile) return;
    setSending(true);
    const { error } = await supabase.from('channel_messages').insert({
      channel_id: selectedChannel.id,
      sender_id: profile.id,
      body: newMessage.trim(),
    });
    if (!error) setNewMessage("");
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatTime(iso: string) {
    const date = new Date(iso);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
      date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function isOwnMessage(msg: ChannelMessage) {
    return msg.sender_id === profile?.id;
  }

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display">MESSAGES</h1>
          <p className="text-muted-foreground">Chat with coaches and other club members.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6" style={{ height: 'calc(100vh - 240px)', minHeight: '500px' }}>
          {/* Channels sidebar */}
          <Card className="shadow-card flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-display text-muted-foreground">CHANNELS</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-8 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              {loadingChannels ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-gold" />
                </div>
              ) : filteredChannels.length === 0 ? (
                <div className="text-center py-8 px-4 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No channels available</p>
                </div>
              ) : (
                <div className="space-y-0.5 p-2">
                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        selectedChannel?.id === channel.id
                          ? "bg-gold/10 text-gold font-medium"
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{channel.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="lg:col-span-3 shadow-card flex flex-col">
            {selectedChannel ? (
              <>
                <CardHeader className="border-b py-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg font-display">{selectedChannel.name.toUpperCase()}</CardTitle>
                    {selectedChannel.description && (
                      <p className="text-sm text-muted-foreground hidden md:block">— {selectedChannel.description}</p>
                    )}
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-gold" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Hash className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No messages yet in #{selectedChannel.name}</p>
                        <p className="text-sm mt-1">Be the first to say something!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const own = isOwnMessage(msg);
                        return (
                          <div key={msg.id} className={`flex gap-3 ${own ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${own ? 'bg-gold text-navy' : 'bg-navy text-white'}`}>
                              {(msg.profiles?.full_name ?? 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div className={`max-w-[70%] ${own ? 'items-end' : 'items-start'} flex flex-col`}>
                              <div className={`flex items-center gap-2 mb-1 ${own ? 'flex-row-reverse' : ''}`}>
                                <span className="text-xs font-semibold">
                                  {own ? 'You' : (msg.profiles?.full_name ?? 'Unknown')}
                                </span>
                                <span className="text-xs text-muted-foreground">{formatTime(msg.created_at)}</span>
                              </div>
                              <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                                own
                                  ? 'bg-gold text-navy rounded-tr-sm'
                                  : 'bg-secondary rounded-tl-sm'
                              }`}>
                                {msg.body}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Textarea
                      placeholder={`Message #${selectedChannel.name}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[44px] max-h-32 resize-none flex-1"
                      rows={1}
                    />
                    <Button
                      variant="hero"
                      size="icon"
                      onClick={sendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="flex-shrink-0"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Press Enter to send, Shift+Enter for new line</p>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Select a channel to start chatting</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </ParentDashboardLayout>
  );
}
