import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  AlignLeft,
  Repeat,
  Calendar,
  Tag,
  Video,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventTypes = [
  { value: "practice", label: "Practice" },
  { value: "tournament", label: "Tournament" },
  { value: "meeting", label: "Meeting" },
  { value: "event", label: "Other Event" },
];

const repeatOptions = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
];

export default function AddEventDialog({ open, onOpenChange }: AddEventDialogProps) {
  const { profile } = useAuth();
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("practice");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [repeatEndDate, setRepeatEndDate] = useState("");
  const [addVideoLink, setAddVideoLink] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim() || !date || !profile?.club_id) return;
    setError(null);
    setSaving(true);

    try {
      const startDateTime = allDay ? `${date}T00:00:00` : `${date}T${startTime || '00:00'}:00`;
      const endDateTime = allDay ? `${date}T23:59:59` : `${date}T${endTime || startTime || '00:00'}:00`;

      const eventsToInsert: any[] = [];

      if (repeat === 'none') {
        eventsToInsert.push({
          title, event_type: eventType,
          start_time: startDateTime, end_time: endDateTime,
          location: location || null, description: description || null,
          club_id: profile.club_id,
        });
      } else {
        const startDate = new Date(startDateTime);
        const endDate = repeatEndDate ? new Date(repeatEndDate) : new Date(startDate);
        if (!repeatEndDate) endDate.setMonth(endDate.getMonth() + 3);
        const diffMs = new Date(endDateTime).getTime() - startDate.getTime();
        let current = new Date(startDate);

        while (current <= endDate && eventsToInsert.length < 52) {
          eventsToInsert.push({
            title, event_type: eventType,
            start_time: current.toISOString(),
            end_time: new Date(current.getTime() + diffMs).toISOString(),
            location: location || null, description: description || null,
            club_id: profile.club_id,
          });
          const next = new Date(current);
          if (repeat === 'daily') next.setDate(next.getDate() + 1);
          else if (repeat === 'weekly') next.setDate(next.getDate() + 7);
          else if (repeat === 'biweekly') next.setDate(next.getDate() + 14);
          else if (repeat === 'monthly') next.setMonth(next.getMonth() + 1);
          current = next;
        }
      }

      const { error: insertError } = await supabase.from('events').insert(eventsToInsert);
      if (insertError) throw insertError;

      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      setError('Failed to save event. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const resetForm = () => {
    setTitle(""); setEventType("practice"); setDate("");
    setStartTime(""); setEndTime(""); setAllDay(false);
    setLocation(""); setDescription(""); setRepeat("none");
    setRepeatEndDate(""); setAddVideoLink(false); setVideoLink(""); setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetForm(); }}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">ADD EVENT</DialogTitle>
          <DialogDescription>Create a new event for your club calendar.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <Input
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
          />

          <div className="flex items-center gap-3">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {eventTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1" />
            </div>
            <div className="flex items-center gap-3 ml-7">
              <Switch checked={allDay} onCheckedChange={setAllDay} />
              <Label className="text-sm text-muted-foreground">All day</Label>
            </div>
            {!allDay && (
              <div className="flex items-center gap-3 ml-7">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="flex-1" />
                <span className="text-muted-foreground text-sm">to</span>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="flex-1" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Repeat className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={repeat} onValueChange={setRepeat}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {repeatOptions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {repeat !== "none" && (
              <div className="flex items-center gap-3 ml-7">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">Ends on</Label>
                <Input type="date" value={repeatEndDate} onChange={(e) => setRepeatEndDate(e.target.value)} className="flex-1" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input placeholder="Add location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Video className="h-4 w-4 text-muted-foreground shrink-0" />
              <Switch checked={addVideoLink} onCheckedChange={setAddVideoLink} />
              <Label className="text-sm text-muted-foreground">Add video conferencing link</Label>
            </div>
            {addVideoLink && (
              <div className="ml-7">
                <Input placeholder="https://zoom.us/j/..." value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
              </div>
            )}
          </div>

          <div className="flex items-start gap-3">
            <AlignLeft className="h-4 w-4 text-muted-foreground shrink-0 mt-2.5" />
            <Textarea placeholder="Add description or notes" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-wrestling-red/10 border border-wrestling-red/20 text-wrestling-red text-sm">{error}</div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button variant="hero" onClick={handleSave} disabled={!title.trim() || !date || saving}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
