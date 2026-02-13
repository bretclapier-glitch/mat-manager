import { BaseballOnboardingData, BaseballRegistrationField } from "@/types/baseball-onboarding";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface BaseballRegistrationStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

export default function BaseballRegistrationStep({ data, onChange }: BaseballRegistrationStepProps) {
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'select' | 'checkbox'>('text');

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    const field: BaseballRegistrationField = {
      id: Date.now().toString(),
      label: newFieldLabel,
      type: newFieldType,
      required: false,
    };
    onChange({ registrationFields: [...data.registrationFields, field] });
    setNewFieldLabel('');
  };

  const removeField = (id: string) => {
    onChange({ registrationFields: data.registrationFields.filter((f) => f.id !== id) });
  };

  const toggleRequired = (id: string) => {
    onChange({
      registrationFields: data.registrationFields.map((f) =>
        f.id === id ? { ...f, required: !f.required } : f
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">PLAYER REGISTRATION</h2>
        <p className="text-muted-foreground">Customize the information you collect when players register.</p>
      </div>

      {/* Current Fields */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Registration Form Fields</Label>
        {data.registrationFields.map((field) => (
          <div key={field.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <div className="flex-1">
              <span className="font-medium text-sm">{field.label}</span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">{field.type}</Badge>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Required</span>
              <Switch checked={field.required} onCheckedChange={() => toggleRequired(field.id)} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeField(field.id)} className="h-8 w-8">
              <Trash2 className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Field */}
      <div className="flex gap-2">
        <Input
          value={newFieldLabel}
          onChange={(e) => setNewFieldLabel(e.target.value)}
          placeholder="New field name..."
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && addField()}
        />
        <Select value={newFieldType} onValueChange={(v: any) => setNewFieldType(v)}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="select">Dropdown</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addField} className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
