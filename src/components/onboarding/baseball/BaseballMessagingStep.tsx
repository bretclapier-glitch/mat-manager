import { BaseballOnboardingData } from "@/types/baseball-onboarding";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Hash } from "lucide-react";
import { useState } from "react";

interface BaseballMessagingStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

export default function BaseballMessagingStep({ data, onChange }: BaseballMessagingStepProps) {
  const [newChannel, setNewChannel] = useState('');

  const addChannel = () => {
    if (!newChannel.trim()) return;
    const channel = {
      id: Date.now().toString(),
      name: newChannel.toLowerCase().replace(/\s+/g, '-'),
      description: '',
      isPrivate: false,
    };
    onChange({ messageChannels: [...data.messageChannels, channel] });
    setNewChannel('');
  };

  const removeChannel = (id: string) => {
    onChange({ messageChannels: data.messageChannels.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">MESSAGING</h2>
        <p className="text-muted-foreground">Set up how you'll communicate with parents and coaches.</p>
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-secondary/50">
        <div className="flex items-center justify-between">
          <div>
            <Label>Direct Messages</Label>
            <p className="text-xs text-muted-foreground">Allow parents to message coaches directly</p>
          </div>
          <Switch checked={data.enableDirectMessages} onCheckedChange={(c) => onChange({ enableDirectMessages: c })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-xs text-muted-foreground">Send email alerts for new messages</p>
          </div>
          <Switch checked={data.enableEmailNotifications} onCheckedChange={(c) => onChange({ enableEmailNotifications: c })} />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Message Channels</Label>
        <div className="flex gap-2">
          <Input
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
            placeholder="e.g., game-day, carpools, fundraising"
            onKeyDown={(e) => e.key === 'Enter' && addChannel()}
          />
          <Button onClick={addChannel} className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {data.messageChannels.map((ch) => (
            <div key={ch.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-[hsl(150,45%,35%)]" />
                <span className="font-medium text-sm">{ch.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeChannel(ch.id)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
