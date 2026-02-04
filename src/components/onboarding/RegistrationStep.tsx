import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { OnboardingData, RegistrationField } from "@/types/onboarding";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface RegistrationStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

interface SortableFieldProps {
  field: RegistrationField;
  updateField: (id: string, updates: Partial<RegistrationField>) => void;
  removeField: (id: string) => void;
}

function SortableField({ field, updateField, removeField }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-xl border bg-card/50 ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="pt-2 text-muted-foreground cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1 grid md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5 space-y-1">
            <Label className="text-xs text-muted-foreground">Field Label</Label>
            <Input
              placeholder="e.g., Emergency Contact"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select
              value={field.type}
              onValueChange={(value: RegistrationField['type']) => 
                updateField(field.id, { type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <Switch
              id={`required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
            />
            <Label htmlFor={`required-${field.id}`} className="text-sm">
              Required
            </Label>
          </div>

          <div className="md:col-span-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeField(field.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {field.type === 'select' && (
        <div className="mt-3 ml-8 space-y-1">
          <Label className="text-xs text-muted-foreground">Options (comma-separated)</Label>
          <Input
            placeholder="Option 1, Option 2, Option 3"
            value={field.options?.join(', ') || ''}
            onChange={(e) => updateField(field.id, { 
              options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
            })}
          />
        </div>
      )}
    </div>
  );
}

export default function RegistrationStep({ data, onChange }: RegistrationStepProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = () => {
    const newField: RegistrationField = {
      id: crypto.randomUUID(),
      label: '',
      type: 'text',
      required: false,
    };
    onChange({ registrationFields: [...data.registrationFields, newField] });
  };

  const updateField = (id: string, updates: Partial<RegistrationField>) => {
    onChange({
      registrationFields: data.registrationFields.map(f => 
        f.id === id ? { ...f, ...updates } : f
      )
    });
  };

  const removeField = (id: string) => {
    onChange({ registrationFields: data.registrationFields.filter(f => f.id !== id) });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.registrationFields.findIndex(f => f.id === active.id);
      const newIndex = data.registrationFields.findIndex(f => f.id === over.id);
      
      onChange({
        registrationFields: arrayMove(data.registrationFields, oldIndex, newIndex)
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">Registration Form</h2>
        <p className="text-muted-foreground">Customize what information you collect from parents</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.registrationFields.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {data.registrationFields.map((field) => (
              <SortableField
                key={field.id}
                field={field}
                updateField={updateField}
                removeField={removeField}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        onClick={addField}
        className="w-full border-dashed border-2 h-12"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Field
      </Button>

      <div className="bg-muted/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          Standard fields like Wrestler Name, Parent Contact, and Program Selection 
          are included automatically. Add any custom fields you need above.
        </p>
      </div>
    </div>
  );
}
