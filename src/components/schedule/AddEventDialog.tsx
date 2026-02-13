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
  Users,
  Repeat,
  Calendar,
  Tag,
  Video,
} from "lucide-react";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventTypes = [
  { value: "practice", label: "Practice" },
  { value: "competition", label: "Competition" },
  { value: "meeting", label: "Meeting" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "social", label: "Social Event" },
  { value: "camp", label: "Camp / Clinic" },
  { value: "other", label: "Other" },
];

const repeatOptions = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom..." },
];

const weekDays = [
  { value: "sun", label: "S" },
  { value: "mon", label: "M" },
  { value: "tue", label: "T" },
  { value: "wed", label: "W" },
  { value: "thu", label: "T" },
  { value: "fri", label: "F" },
  { value: "sat", label: "S" },
];

export default function AddEventDialog({ open, onOpenChange }: AddEventDialogProps) {
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
  const [customRepeatInterval, setCustomRepeatInterval] = useState("1");
  const [customRepeatUnit, setCustomRepeatUnit] = useState("week");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [addVideoLink, setAddVideoLink] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [notifyMembers, setNotifyMembers] = useState(true);
  const [program, setProgram] = useState("all");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    // TODO: persist event
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setEventType("practice");
    setDate("");
    setStartTime("");
    setEndTime("");
    setAllDay(false);
    setLocation("");
    setDescription("");
    setRepeat("none");
    setRepeatEndDate("");
    setCustomRepeatInterval("1");
    setCustomRepeatUnit("week");
    setSelectedDays([]);
    setAddVideoLink(false);
    setVideoLink("");
    setNotifyMembers(true);
    setProgram("all");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">ADD EVENT</DialogTitle>
          <DialogDescription>Create a new event for your club calendar.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title */}
          <Input
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
          />

          {/* Event Type */}
          <div className="flex items-center gap-3">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-3 ml-7">
              <div className="flex items-center gap-2 flex-1">
                <Switch checked={allDay} onCheckedChange={setAllDay} />
                <Label className="text-sm text-muted-foreground">All day</Label>
              </div>
            </div>

            {!allDay && (
              <div className="flex items-center gap-3 ml-7">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1"
                />
              </div>
            )}
          </div>

          {/* Repeat */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Repeat className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={repeat} onValueChange={setRepeat}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {repeatOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {repeat === "custom" && (
              <div className="ml-7 space-y-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Every</span>
                  <Input
                    type="number"
                    min="1"
                    value={customRepeatInterval}
                    onChange={(e) => setCustomRepeatInterval(e.target.value)}
                    className="w-16"
                  />
                  <Select value={customRepeatUnit} onValueChange={setCustomRepeatUnit}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">day(s)</SelectItem>
                      <SelectItem value="week">week(s)</SelectItem>
                      <SelectItem value="month">month(s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {customRepeatUnit === "week" && (
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Repeat on</Label>
                    <div className="flex gap-1">
                      {weekDays.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => toggleDay(d.value)}
                          className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                            selectedDays.includes(d.value)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {repeat !== "none" && (
              <div className="flex items-center gap-3 ml-7">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">Ends on</Label>
                <Input
                  type="date"
                  value={repeatEndDate}
                  onChange={(e) => setRepeatEndDate(e.target.value)}
                  className="flex-1"
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Video Link */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Video className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-2">
                <Switch checked={addVideoLink} onCheckedChange={setAddVideoLink} />
                <Label className="text-sm text-muted-foreground">Add video conferencing link</Label>
              </div>
            </div>
            {addVideoLink && (
              <div className="ml-7">
                <Input
                  placeholder="https://zoom.us/j/..."
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Program / Group */}
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="youth">Youth Wrestling</SelectItem>
                <SelectItem value="highschool">High School</SelectItem>
                <SelectItem value="varsity">Varsity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <AlignLeft className="h-4 w-4 text-muted-foreground shrink-0 mt-2.5" />
            <Textarea
              placeholder="Add description or notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Notify */}
          <div className="flex items-center gap-3 ml-7">
            <Switch checked={notifyMembers} onCheckedChange={setNotifyMembers} />
            <Label className="text-sm text-muted-foreground">
              Notify members when event is created
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handleSave} disabled={!title.trim()}>
            Save Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
