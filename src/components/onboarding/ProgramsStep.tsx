import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { OnboardingData, Program } from "@/types/onboarding";

interface ProgramsStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function ProgramsStep({ data, onChange }: ProgramsStepProps) {
  const addProgram = () => {
    const newProgram: Program = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
    };
    onChange({ programs: [...data.programs, newProgram] });
  };

  const updateProgram = (id: string, updates: Partial<Program>) => {
    onChange({
      programs: data.programs.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    });
  };

  const removeProgram = (id: string) => {
    onChange({ programs: data.programs.filter(p => p.id !== id) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">What programs do you offer?</h2>
        <p className="text-muted-foreground">Add each program your club offers</p>
      </div>

      <div className="space-y-4">
        {data.programs.map((program, index) => (
          <div 
            key={program.id} 
            className="p-4 rounded-xl border bg-card/50 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="pt-2 text-muted-foreground">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Program {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProgram(program.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Program Name</Label>
                  <Input
                    placeholder="e.g., Youth Wrestling (K-5), Varsity Team, Adult Open Mat"
                    value={program.name}
                    onChange={(e) => updateProgram(program.id, { name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe this program - who it's for, skill level, what they'll learn..."
                    value={program.description}
                    onChange={(e) => updateProgram(program.id, { description: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addProgram}
          className="w-full border-dashed border-2 h-16"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Program
        </Button>

        {data.programs.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Click "Add Program" to create your first wrestling program
          </p>
        )}
      </div>
    </div>
  );
}
