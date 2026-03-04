import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, ChevronDown, ChevronUp, Pencil, Check } from "lucide-react";
import { OnboardingData, Program } from "@/types/onboarding";

interface ScheduleStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleStep({ data, onChange }: ScheduleStepProps) {
  const [expandedProgram, setExpandedProgram] = useState<string | null>(
    data.programs[0]?.id || null
  );

  const updateProgram = (id: string, updates: Partial<Program>) => {
    onChange({
      programs: data.programs.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    });
  };

  const toggleDay = (programId: string, day: string) => {
    const program = data.programs.find(p => p.id === programId);
    if (!program) return;
    
    const currentDays = program.practiceDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    updateProgram(programId, { practiceDays: newDays });
  };

  if (data.programs.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display mb-2">Schedule Setup</h2>
          <p className="text-muted-foreground">Set practice times for each program</p>
        </div>
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            You haven't added any programs yet.<br />
            Go back to add programs first, or skip this step for now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">Schedule Setup</h2>
        <p className="text-muted-foreground">Set practice times for each program</p>
      </div>

      <div className="space-y-4">
        {data.programs.map((program) => (
          <div 
            key={program.id} 
            className="rounded-xl border bg-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedProgram(
                expandedProgram === program.id ? null : program.id
              )}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold">{program.name || 'Unnamed Program'}</h3>
                {program.seasonStart && program.seasonEnd && (
                  <p className="text-sm text-muted-foreground">
                    {program.seasonStart} - {program.seasonEnd}
                  </p>
                )}
              </div>
              {expandedProgram === program.id ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {expandedProgram === program.id && (
              <div className="p-4 pt-0 space-y-6 border-t animate-fade-in">
                {/* Season Dates */}
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label>Season Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={program.seasonStart || ''}
                        onChange={(e) => updateProgram(program.id, { seasonStart: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Season End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={program.seasonEnd || ''}
                        onChange={(e) => updateProgram(program.id, { seasonEnd: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Practice Days */}
                <div className="space-y-3">
                  <Label>Practice Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(program.id, day)}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${(program.practiceDays || []).includes(day)
                            ? "bg-gold text-navy"
                            : "bg-muted hover:bg-muted/80"
                          }
                        `}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Practice Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Practice Start Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={program.practiceTime || ''}
                        onChange={(e) => updateProgram(program.id, { practiceTime: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Practice End Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={program.practiceEndTime || ''}
                        onChange={(e) => updateProgram(program.id, { practiceEndTime: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  You can add competition schedules later from the Schedule page
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't know your schedule yet? No problem — you can set this up later
      </p>
    </div>
  );
}
