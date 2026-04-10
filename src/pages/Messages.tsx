import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Send,
  Users,
  User,
  Clock,
  Loader2,
  Megaphone,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type Message = {
  id: string;
  subject: string;
  body: string;
  sender_id: string;
  club_id: string;
  recipient_type: string;
  created_at: string;
  profiles?: { full_name: string } | null;
};

export default function Messages() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "parents" | "coaches">("all");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (profile?.club_id) loadMessages(profile.club_id);
  }, [profile]);

  async function loadMessages(clubId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles(full_name)')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false });

    if (!error) setMessages((data ?? []) as Message[]);
    setLoading(false);
  }

  async function sendMessage() {
    if (!newSubject.trim() || !newBody.trim() || !profile) return;
    setSending(true);

    const { error } = await supabase.from('messages').insert({
      subject: newSubject,
      body: newBody,
      sender_id: profile.id,
      club_id: profile.club_id,
      recipient_type: recipientType,
    });

    if (!error) {
      setComposeOpen(false);
      setNewSubject("");
      setNewBody("");
      setRecipientType("all");
      if (profile.club_id) loadMessages(profile.club_id);
    }
    setSending(false);
  }

  function formatTime(iso: string) {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  const filteredMessages = messages.filter(m =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recipientLabel = (type: string) => {
    if (type === 'all') return 'All Parents & Staff';
    if (type === 'parents') return 'Parents Only';
    if (type === 'coaches') return 'Coaches Only';
    return type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">MESSAGES</h1>
            <p className="text-muted-foreground">Communicate with parents and staff</p>
          </div>
          <Button variant="hero" onClick={() => setComposeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
          {/* Messages List */}
          <Card className="shadow-card lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-gold" />
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground px-4">
                    <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No messages yet</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setComposeOpen(true)}>
                      Send your first message
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1 px-4 pb-4">
                    {filteredMessages.map((message) => (
                      <button
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedMessage?.id === message.id
                            ? "bg-gold/10 border border-gold"
                            : "hover:bg-secondary"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0">
                            {message.recipient_type === 'all' || message.recipient_type === 'parents'
                              ? <Users className="h-5 w-5" />
                              : <User className="h-5 w-5" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate text-sm">{message.subject}</span>
                              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                {formatTime(message.created_at)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{message.body}</p>
                            <p className="text-xs text-gold mt-1">{recipientLabel(message.recipient_type)}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="shadow-card lg:col-span-2 flex flex-col">
            {selectedMessage ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        To: {recipientLabel(selectedMessage.recipient_type)} •{" "}
                        {new Date(selectedMessage.created_at).toLocaleDateString([], {
                          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-6">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.body}</p>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Select a message to read it</p>
                  <p className="text-sm mt-1">Or send a new message to your club</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">NEW MESSAGE</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Send To</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'parents', 'coaches'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setRecipientType(type)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-colors capitalize ${
                      recipientType === type
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    {type === 'all' ? 'Everyone' : type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Practice cancelled tomorrow"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                placeholder="Write your message here..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setComposeOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={sendMessage}
                disabled={sending || !newSubject.trim() || !newBody.trim()}
              >
                {sending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" />Send Message</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
