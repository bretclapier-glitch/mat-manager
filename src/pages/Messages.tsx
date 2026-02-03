import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  Send,
  Paperclip,
  Users,
  User,
  Clock,
  CheckCheck
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const conversations = [
  { 
    id: 1, 
    name: "All Parents", 
    type: "group",
    lastMessage: "Practice schedule has been updated for next week",
    time: "2m ago",
    unread: 3 
  },
  { 
    id: 2, 
    name: "Youth Team Parents", 
    type: "group",
    lastMessage: "Don't forget to bring water bottles tomorrow!",
    time: "1h ago",
    unread: 0 
  },
  { 
    id: 3, 
    name: "Sarah Johnson", 
    type: "direct",
    lastMessage: "Thank you for the quick response",
    time: "2h ago",
    unread: 1 
  },
  { 
    id: 4, 
    name: "Mike Chen", 
    type: "direct",
    lastMessage: "Is there makeup practice this Saturday?",
    time: "3h ago",
    unread: 0 
  },
  { 
    id: 5, 
    name: "Coaching Staff", 
    type: "group",
    lastMessage: "Meeting confirmed for 6pm",
    time: "Yesterday",
    unread: 0 
  },
];

const messages = [
  { id: 1, sender: "You", content: "Hi everyone! Just a reminder that practice has been moved to 5pm tomorrow due to facility scheduling.", time: "10:30 AM", isOwn: true },
  { id: 2, sender: "Sarah J.", content: "Thank you for the heads up! We'll be there.", time: "10:32 AM", isOwn: false },
  { id: 3, sender: "Mike C.", content: "Got it, thanks!", time: "10:35 AM", isOwn: false },
  { id: 4, sender: "Lisa W.", content: "Will there be any changes to the end time?", time: "10:40 AM", isOwn: false },
  { id: 5, sender: "You", content: "Practice will still end at the normal time, 6:30pm. Just the start time is different.", time: "10:42 AM", isOwn: true },
  { id: 6, sender: "Lisa W.", content: "Perfect, thank you!", time: "10:43 AM", isOwn: false },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">MESSAGES</h1>
            <p className="text-muted-foreground">Communicate with parents and staff</p>
          </div>
          <Button variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>

        {/* Messages Grid */}
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
          {/* Conversations List */}
          <Card className="shadow-card lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="space-y-1 px-4 pb-4">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedConversation.id === conversation.id 
                          ? "bg-gold/10 border border-gold" 
                          : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          conversation.type === "group" 
                            ? "bg-navy text-white" 
                            : "bg-gold text-navy"
                        }`}>
                          {conversation.type === "group" ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{conversation.name}</span>
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-wrestling-red text-white text-xs flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="shadow-card lg:col-span-2 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedConversation.type === "group" 
                    ? "bg-navy text-white" 
                    : "bg-gold text-navy"
                }`}>
                  {selectedConversation.type === "group" ? (
                    <Users className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.type === "group" ? "45 members" : "Direct message"}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] ${message.isOwn ? "order-2" : ""}`}>
                        {!message.isOwn && (
                          <span className="text-xs font-medium text-muted-foreground mb-1 block">
                            {message.sender}
                          </span>
                        )}
                        <div className={`p-3 rounded-2xl ${
                          message.isOwn 
                            ? "bg-gold text-navy rounded-br-md" 
                            : "bg-secondary rounded-bl-md"
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? "justify-end" : ""}`}>
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                          {message.isOwn && <CheckCheck className="h-3 w-3 text-gold" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button variant="hero" size="icon" className="flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
