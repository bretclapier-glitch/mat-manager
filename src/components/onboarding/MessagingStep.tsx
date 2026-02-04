import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Hash, MessageSquare, Users, Bell } from "lucide-react";
import { OnboardingData, MessageChannel } from "@/types/onboarding";

interface MessagingStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function MessagingStep({ data, onChange }: MessagingStepProps) {
  const addChannel = () => {
    const newChannel: MessageChannel = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      isPrivate: false,
    };
    onChange({ messageChannels: [...data.messageChannels, newChannel] });
  };

  const updateChannel = (id: string, updates: Partial<MessageChannel>) => {
    onChange({
      messageChannels: data.messageChannels.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    });
  };

  const removeChannel = (id: string) => {
    onChange({ messageChannels: data.messageChannels.filter(c => c.id !== id) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">Messaging Setup</h2>
        <p className="text-muted-foreground">Configure how you'll communicate with parents and athletes</p>
      </div>

      {/* DM Settings */}
      <div className="bg-card rounded-xl border p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Direct Messages</h3>
            <p className="text-sm text-muted-foreground">Allow private conversations between coaches and parents</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Enable Direct Messaging</p>
              <p className="text-sm text-muted-foreground">Parents can message coaches directly</p>
            </div>
          </div>
          <Switch
            checked={data.enableDirectMessages}
            onCheckedChange={(checked) => onChange({ enableDirectMessages: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Send email alerts for new messages</p>
            </div>
          </div>
          <Switch
            checked={data.enableEmailNotifications}
            onCheckedChange={(checked) => onChange({ enableEmailNotifications: checked })}
          />
        </div>
      </div>

      {/* Channels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Channels</h3>
              <p className="text-sm text-muted-foreground">Create group channels for announcements and discussions</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data.messageChannels.map((channel) => (
            <div 
              key={channel.id} 
              className="p-4 rounded-xl border bg-card/50"
            >
              <div className="grid md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-4 space-y-1">
                  <Label className="text-xs text-muted-foreground">Channel Name</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="announcements"
                      value={channel.name}
                      onChange={(e) => updateChannel(channel.id, { name: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="md:col-span-5 space-y-1">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Input
                    placeholder="Club-wide announcements"
                    value={channel.description}
                    onChange={(e) => updateChannel(channel.id, { description: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <Switch
                    id={`private-${channel.id}`}
                    checked={channel.isPrivate}
                    onCheckedChange={(checked) => updateChannel(channel.id, { isPrivate: checked })}
                  />
                  <Label htmlFor={`private-${channel.id}`} className="text-sm">
                    Private
                  </Label>
                </div>

                <div className="md:col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChannel(channel.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addChannel}
            className="w-full border-dashed border-2 h-12"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Channel
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          You can always add more channels and adjust settings later from your dashboard.
        </p>
      </div>
    </div>
  );
}
