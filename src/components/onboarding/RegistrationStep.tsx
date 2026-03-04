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
import { Plus, Trash2, GripVertical, FileText, Upload } from "lucide-react";
import { OnboardingData, RegistrationField, RegistrationPolicy } from "@/types/onboarding";
import { useState } from "react";
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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addStep, setAddStep] = useState<'choose' | 'text' | 'file'>('choose');
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyText, setNewPolicyText] = useState('');
  const [previewPolicy, setPreviewPolicy] = useState<RegistrationPolicy | null>(null);

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
      onChange({ registrationFields: arrayMove(data.registrationFields, oldIndex, newIndex) });
    }
  };

  const openAddDialog = () => {
    setAddStep('choose');
    setNewPolicyName('');
    setNewPolicyText('');
    setShowAddDialog(true);
  };

  const saveTextPolicy = () => {
    if (!newPolicyName.trim() || !newPolicyText.trim()) return;
    const policy: RegistrationPolicy = {
      id: crypto.randomUUID(),
      name: newPolicyName.trim(),
      contentType: 'text',
      textContent: newPolicyText.trim(),
      required: true,
    };
    onChange({ registrationPolicies: [...(data.registrationPolicies || []), policy] });
    setShowAddDialog(false);
  };

  const handleFilePolicy = () => {
    if (!newPolicyName.trim()) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const policy: RegistrationPolicy = {
          id: crypto.randomUUID(),
          name: newPolicyName.trim(),
          contentType: 'file',
          fileName: file.name,
          required: true,
        };
        onChange({ registrationPolicies: [...(data.registrationPolicies || []), policy] });
        setShowAddDialog(false);
      }
    };
    input.click();
  };

  const removePolicy = (id: string) => {
    onChange({ registrationPolicies: (data.registrationPolicies || []).filter(p => p.id !== id) });
  };

  const togglePolicyRequired = (id: string) => {
    onChange({
      registrationPolicies: (data.registrationPolicies || []).map(p =>
        p.id === id ? { ...p, required: !p.required } : p
      ),
    });
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

      {/* Policies & Waivers Section */}
      <div className="pt-4 border-t space-y-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Policies & Waivers
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add documents that parents must acknowledge during registration
          </p>
        </div>

        <div className="space-y-2">
          {(data.registrationPolicies || []).map((policy) => (
            <div key={policy.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card/50">
              {policy.contentType === 'text' ? (
                <Type className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm">{policy.name}</span>
                <p className="text-xs text-muted-foreground truncate">
                  {policy.contentType === 'file' ? policy.fileName : 'Pasted text'}
                </p>
              </div>
              {(policy.textContent || policy.fileName) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPolicy(policy)}
                  className="text-xs flex-shrink-0"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
              )}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch
                  id={`policy-req-${policy.id}`}
                  checked={policy.required}
                  onCheckedChange={() => togglePolicyRequired(policy.id)}
                />
                <Label htmlFor={`policy-req-${policy.id}`} className="text-xs">Required</Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePolicy(policy.id)}
                className="text-destructive hover:text-destructive h-8 w-8 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={openAddDialog} className="w-full border-dashed border-2">
          <Plus className="h-4 w-4 mr-1" />
          Add Policy
        </Button>
      </div>

      {/* Add Policy Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {addStep === 'choose' ? 'Add Policy' : addStep === 'text' ? 'Paste Policy Text' : 'Upload Policy File'}
            </DialogTitle>
          </DialogHeader>

          {addStep === 'choose' && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">How would you like to add your policy document?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAddStep('text')}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed hover:border-primary hover:bg-accent/50 transition-colors"
                >
                  <Type className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Paste Text</p>
                    <p className="text-xs text-muted-foreground mt-1">Copy & paste your policy content</p>
                  </div>
                </button>
                <button
                  onClick={() => setAddStep('file')}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed hover:border-primary hover:bg-accent/50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Upload File</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX file</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {addStep === 'text' && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Policy Name</Label>
                <Input
                  value={newPolicyName}
                  onChange={(e) => setNewPolicyName(e.target.value)}
                  placeholder="e.g., Release of Liability"
                />
              </div>
              <div className="space-y-2">
                <Label>Policy Text</Label>
                <Textarea
                  value={newPolicyText}
                  onChange={(e) => setNewPolicyText(e.target.value)}
                  placeholder="Paste your policy text here..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setAddStep('choose')}>Back</Button>
                <Button onClick={saveTextPolicy} disabled={!newPolicyName.trim() || !newPolicyText.trim()}>
                  Save Policy
                </Button>
              </div>
            </div>
          )}

          {addStep === 'file' && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Policy Name</Label>
                <Input
                  value={newPolicyName}
                  onChange={(e) => setNewPolicyName(e.target.value)}
                  placeholder="e.g., Code of Conduct"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setAddStep('choose')}>Back</Button>
                <Button onClick={handleFilePolicy} disabled={!newPolicyName.trim()}>
                  <Upload className="h-4 w-4 mr-1" />
                  Choose File
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Policy Dialog */}
      <Dialog open={!!previewPolicy} onOpenChange={() => setPreviewPolicy(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewPolicy?.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            {previewPolicy?.contentType === 'text' ? (
              <p className="text-sm whitespace-pre-wrap">{previewPolicy.textContent}</p>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3" />
                <p className="font-medium">{previewPolicy?.fileName}</p>
                <p className="text-xs mt-1">File preview available after upload to storage</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-muted/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          Standard fields like Wrestler Name, Parent Contact, and Program Selection 
          are included automatically. Add any custom fields you need above.
        </p>
      </div>
    </div>
  );
}
