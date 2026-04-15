import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Hash, MessageSquare, Users, Bell, Lock } from "lucide-react";
import { OnboardingData, MessageChannel } from "@/types/onboarding";

interface MessagingStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function MessagingStep({ data, onChange }: MessagingStepProps) {

  // Auto-populate channels from programs when this step loads
  useEffect(() => {
    const defaultChannels: MessageChannel[] = [
      { id: 'announcements', name: 'announcements', description: 'Club-wide announcements from coaches', isPrivate: false },
      { id: 'general', name: 'general', description: 'General discussion for all members', isPrivate: false },
      { id: 'coaches', name: 'coaches', description: 'Private channel for coaching staff only', isPrivate: true },
    ];

    // Add a private channel for each program
    const programChannels: MessageChannel[] = (data.programs ?? []).map(p => ({
      id: `program-${p.id}`,
      name: p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: `Private channel for ${p.name} parents`,
      isPrivate: true,
    }));

    // Merge: keep any manually added channels, add defaults + program channels if not already present
    const existingNames = new Set(data.messageChannels.map(c => c.name));
    const toAdd = [...defaultChannels, ...programChannels].filter(c => !existingNames.has(c.name));

    if (toAdd.length > 0) {
      onChange({ messageChannels: [...data.messageChannels, ...toAdd] });
    }
  }, []);

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
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Hash className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Channels</h3>
            <p className="text-sm text-muted-foreground">
              Default channels plus a private channel for each program you created
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.messageChannels.map((channel) => (
            <div key={channel.id} className="p-4 rounded-xl border bg-card/50">
              <div className="grid md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-4 space-y-1">
                  <Label className="text-xs text-muted-foreground">Channel Name</Label>
                  <div className="relative">
                    {channel.isPrivate
                      ? <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      : <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    }
                    <Input
                      placeholder="channel-name"
                      value={channel.name}
                      onChange={(e) => updateChannel(channel.id, { name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="md:col-span-5 space-y-1">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Input
                    placeholder="What is this channel for?"
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
          Program channels are private — only parents registered for that program can see them.
          You can add more channels or adjust settings later from your dashboard.
        </p>
      </div>
    </div>
  );
}
