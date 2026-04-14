import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageSquare,
  Search,
  Loader2,
  Megaphone,
  Bell,
} from "lucide-react";

type Message = {
  id: string;
  subject: string;
  body: string;
  sender_id: string;
  recipient_type: string;
  created_at: string;
  profiles?: { full_name: string } | null;
};

export default function ClubParentMessages() {
  const { clubSlug } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (clubSlug) loadMessages(clubSlug);
  }, [clubSlug, user]);

  async function loadMessages(slug: string) {
    setLoading(true);
    try {
      // Find club by slug or id
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let club = null;
      if (uuidRegex.test(slug)) {
        const { data } = await supabase.from('clubs').select('id').eq('id', slug).maybeSingle();
        club = data;
      } else {
        const { data } = await supabase.from('clubs').select('id').eq('slug', slug).maybeSingle();
        club = data;
      }
      if (!club) { setLoading(false); return; }

      const { data } = await supabase
        .from('messages')
        .select('*, profiles(full_name)')
        .eq('club_id', club.id)
        .order('created_at', { ascending: false });

      const msgs = (data ?? []) as Message[];
      setMessages(msgs);
      if (msgs.length > 0) setSelectedMessage(msgs[0]);
    } catch (err) {
      console.error('Messages load error:', err);
    } finally {
      setLoading(false);
    }
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

  function recipientLabel(type: string) {
    if (type === 'all') return 'All Members';
    if (type === 'parents') return 'Parents';
    if (type === 'coaches') return 'Coaches';
    return type;
  }

  const filtered = messages.filter(m =>
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display">MESSAGES</h1>
          <p className="text-muted-foreground">Club announcements and communications from your coaching staff.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6" style={{ minHeight: '500px' }}>
          {/* Message list */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-gold" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground px-4">
                  <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Messages from your coaching staff will appear here</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filtered.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`w-full text-left p-4 transition-colors ${
                        selectedMessage?.id === msg.id
                          ? "bg-gold/10 border-l-2 border-gold"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm truncate">{msg.subject}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(msg.created_at)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{msg.body}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Bell className="h-3 w-3 text-gold" />
                        <span className="text-xs text-gold">{recipientLabel(msg.recipient_type)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message detail */}
          <Card className="lg:col-span-2 shadow-card flex flex-col">
            {selectedMessage ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                        <span>From: {selectedMessage.profiles?.full_name ?? 'Coach'}</span>
                        <span>To: {recipientLabel(selectedMessage.recipient_type)}</span>
                        <span>{new Date(selectedMessage.created_at).toLocaleDateString([], {
                          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                        })}</span>
                      </div>
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
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Select a message to read it</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </ParentDashboardLayout>
  );
}
