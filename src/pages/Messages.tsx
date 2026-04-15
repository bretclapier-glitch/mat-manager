import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  Send,
  Hash,
  Lock,
  Loader2,
  MessageSquare,
  Trash2,
  Settings,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

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

export default function Messages() {
  const { profile } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  // Channel management dialog
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [cName, setCName] = useState("");
  const [cDescription, setCDescription] = useState("");
  const [cIsPrivate, setCIsPrivate] = useState(false);
  const [savingChannel, setSavingChannel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile?.club_id) loadChannels(profile.club_id);
  }, [profile]);

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
      .channel(`channel-${selectedChannel.id}`)
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

  async function loadChannels(clubId: string) {
    setLoadingChannels(true);
    const { data } = await supabase
      .from('message_channels')
      .select('*')
      .eq('club_id', clubId)
      .order('name');
    const chs = (data ?? []) as Channel[];
    setChannels(chs);
    if (chs.length > 0) setSelectedChannel(chs[0]);
    setLoadingChannels(false);
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

  function openAddChannel() {
    setEditingChannel(null);
    setCName(""); setCDescription(""); setCIsPrivate(false);
    setChannelDialogOpen(true);
  }

  function openEditChannel(channel: Channel) {
    setEditingChannel(channel);
    setCName(channel.name);
    setCDescription(channel.description ?? "");
    setCIsPrivate(channel.is_private);
    setChannelDialogOpen(true);
  }

  async function saveChannel() {
    if (!cName.trim() || !profile?.club_id) return;
    setSavingChannel(true);
    try {
      if (editingChannel) {
        await supabase.from('message_channels').update({
          name: cName, description: cDescription || null, is_private: cIsPrivate,
        }).eq('id', editingChannel.id);
      } else {
        await supabase.from('message_channels').insert({
          name: cName, description: cDescription || null,
          is_private: cIsPrivate, club_id: profile.club_id,
        });
      }
      setChannelDialogOpen(false);
      loadChannels(profile.club_id);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingChannel(false);
    }
  }

  async function deleteChannel(id: string) {
    if (!confirm("Delete this channel and all its messages?")) return;
    await supabase.from('message_channels').delete().eq('id', id);
    if (profile?.club_id) loadChannels(profile.club_id);
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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">MESSAGES</h1>
            <p className="text-muted-foreground">Chat with parents and coaching staff</p>
          </div>
          <Button variant="hero" onClick={openAddChannel}>
            <Plus className="h-4 w-4 mr-2" />New Channel
          </Button>
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
                  <p className="text-xs">No channels yet</p>
                </div>
              ) : (
                <div className="space-y-0.5 p-2">
                  {filteredChannels.map((channel) => (
                    <div key={channel.id} className="group flex items-center gap-1">
                      <button
                        onClick={() => setSelectedChannel(channel)}
                        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          selectedChannel?.id === channel.id
                            ? "bg-gold/10 text-gold font-medium"
                            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {channel.is_private
                          ? <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                          : <Hash className="h-3.5 w-3.5 flex-shrink-0" />}
                        <span className="truncate">{channel.name}</span>
                      </button>
                      <button
                        onClick={() => openEditChannel(channel)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-opacity"
                      >
                        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedChannel.is_private
                        ? <Lock className="h-4 w-4 text-muted-foreground" />
                        : <Hash className="h-4 w-4 text-muted-foreground" />}
                      <CardTitle className="text-lg font-display">{selectedChannel.name.toUpperCase()}</CardTitle>
                      {selectedChannel.is_private && <Badge variant="outline" className="text-xs">Private</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedChannel.description && (
                        <p className="text-sm text-muted-foreground hidden md:block">{selectedChannel.description}</p>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openEditChannel(selectedChannel)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteChannel(selectedChannel.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                        const senderName = msg.profiles?.full_name ?? 'Unknown';
                        return (
                          <div key={msg.id} className={`flex gap-3 ${own ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${own ? 'bg-gold text-navy' : 'bg-navy text-white'}`}>
                              {senderName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div className={`max-w-[70%] ${own ? 'items-end' : 'items-start'} flex flex-col`}>
                              <div className={`flex items-center gap-2 mb-1 ${own ? 'flex-row-reverse' : ''}`}>
                                <span className="text-xs font-semibold">
                                  {senderName}{own ? ' (You)' : ''}
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

      {/* Channel dialog */}
      <Dialog open={channelDialogOpen} onOpenChange={setChannelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingChannel ? "EDIT CHANNEL" : "NEW CHANNEL"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Channel Name *</Label>
              <Input
                placeholder="e.g. announcements, youth-parents"
                value={cName}
                onChange={(e) => setCName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              />
              <p className="text-xs text-muted-foreground">Lowercase, no spaces (use hyphens)</p>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="What is this channel for?"
                value={cDescription}
                onChange={(e) => setCDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-sm">Private Channel</p>
                <p className="text-xs text-muted-foreground">Only coaches can see private channels</p>
              </div>
              <Switch checked={cIsPrivate} onCheckedChange={setCIsPrivate} />
            </div>
            {editingChannel && (
              <Button
                variant="ghost"
                className="w-full text-destructive hover:text-destructive"
                onClick={() => { deleteChannel(editingChannel.id); setChannelDialogOpen(false); }}
              >
                <Trash2 className="h-4 w-4 mr-2" />Delete Channel
              </Button>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setChannelDialogOpen(false)}>Cancel</Button>
              <Button variant="hero" className="flex-1" onClick={saveChannel} disabled={savingChannel || !cName.trim()}>
                {savingChannel ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : editingChannel ? "Update" : "Create Channel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
