import BaseballDashboardLayout from "@/components/layout/BaseballDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const channels = [
  { id: 1, name: "General", lastMessage: "Coach: Practice moved to Diamond 2 tomorrow", time: "1h ago", unread: 2 },
  { id: 2, name: "10U Travel", lastMessage: "Game lineup posted for Saturday", time: "3h ago", unread: 1 },
  { id: 3, name: "Tournaments", lastMessage: "Spring Classic registration open", time: "1d ago", unread: 0 },
];

const messages = [
  { id: 1, sender: "Coach Mike", text: "Practice moved to Diamond 2 tomorrow due to field maintenance.", time: "3:00 PM", isOwn: false },
  { id: 2, sender: "You", text: "Got it. Jake will be there.", time: "3:15 PM", isOwn: true },
  { id: 3, sender: "Coach Mike", text: "Great. We're focusing on hitting and base running.", time: "3:20 PM", isOwn: false },
];

export default function BaseballMessages() {
  return (
    <BaseballDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display">MESSAGES</h1>
        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-10" /></div>
            </CardHeader>
            <CardContent className="space-y-2">
              {channels.map(ch => (
                <div key={ch.id} className={`p-3 rounded-lg cursor-pointer transition-colors ${ch.id === 1 ? "bg-[hsl(150,45%,35%)]/10 border border-[hsl(150,45%,35%)]/20" : "hover:bg-secondary/50"}`}>
                  <div className="flex items-center justify-between mb-1"><h4 className="font-semibold text-sm">{ch.name}</h4><span className="text-xs text-muted-foreground">{ch.time}</span></div>
                  <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground truncate flex-1">{ch.lastMessage}</p>{ch.unread > 0 && <Badge className="bg-[hsl(150,45%,35%)] text-white text-xs ml-2">{ch.unread}</Badge>}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 shadow-card flex flex-col">
            <CardHeader className="border-b pb-3"><CardTitle className="text-lg font-display flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[hsl(150,45%,35%)]" /> GENERAL</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${m.isOwn ? "bg-[hsl(150,45%,35%)]/20" : "bg-secondary/50"}`}>
                    {!m.isOwn && <p className="text-xs font-semibold text-[hsl(150,45%,35%)] mb-1">{m.sender}</p>}
                    <p className="text-sm">{m.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t flex gap-2">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white" size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </Card>
        </div>
      </div>
    </BaseballDashboardLayout>
  );
}
