import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Send,
  Search,
} from "lucide-react";

const channels = [
  { id: 1, name: "General", lastMessage: "Coach: Practice tomorrow at 4 PM", time: "2h ago", unread: 3 },
  { id: 2, name: "Youth Wrestling", lastMessage: "Reminder: Bring headgear tomorrow", time: "5h ago", unread: 1 },
  { id: 3, name: "Tournaments", lastMessage: "Austin Youth bracket posted", time: "1d ago", unread: 0 },
];

const messages = [
  { id: 1, sender: "Coach Smith", text: "Practice tomorrow at 4 PM. We'll be working on takedowns.", time: "2:30 PM", isOwn: false },
  { id: 2, sender: "You", text: "Got it! Marcus will be there.", time: "2:45 PM", isOwn: true },
  { id: 3, sender: "Coach Smith", text: "Great. Make sure he brings his headgear.", time: "2:50 PM", isOwn: false },
  { id: 4, sender: "Sarah Williams", text: "Can someone carpool to the tournament Saturday?", time: "3:15 PM", isOwn: false },
  { id: 5, sender: "You", text: "We can take 2 extra kids if needed!", time: "3:20 PM", isOwn: true },
];

export default function ClubParentMessages() {
  const { clubSlug } = useParams();

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display">MESSAGES</h1>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Channels */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {channels.map((ch) => (
                <div key={ch.id} className={`p-3 rounded-lg cursor-pointer transition-colors ${ch.id === 1 ? "bg-gold/10 border border-gold/20" : "hover:bg-secondary/50"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{ch.name}</h4>
                    <span className="text-xs text-muted-foreground">{ch.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate flex-1">{ch.lastMessage}</p>
                    {ch.unread > 0 && <Badge className="bg-gold text-navy text-xs ml-2">{ch.unread}</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="lg:col-span-2 shadow-card flex flex-col">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gold" /> GENERAL
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${m.isOwn ? "bg-gold/20 text-foreground" : "bg-secondary/50"}`}>
                    {!m.isOwn && <p className="text-xs font-semibold text-gold mb-1">{m.sender}</p>}
                    <p className="text-sm">{m.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t flex gap-2">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button variant="hero" size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </Card>
        </div>
      </div>
    </ParentDashboardLayout>
  );
}
