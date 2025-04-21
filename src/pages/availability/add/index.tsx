import type React from "react";

import { useState, useEffect } from "react";
import { format, addDays, addWeeks } from "date-fns";
import {
  CalendarIcon,
  Clock,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
};

type AvailabilityPattern = {
  type: "single" | "weekly" | "custom";
  weekdays: number[];
  interval: number;
  endDate: Date | null;
  occurrences: number | null;
};

export default function AddAvailabilityPage() {
  const navigate = useNavigate();

  // State for date selection
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", startTime: "09:00", endTime: "10:00" },
  ]);

  // State for recurrence pattern
  const [isRecurring, setIsRecurring] = useState(false);
  const [pattern, setPattern] = useState<AvailabilityPattern>({
    type: "weekly",
    weekdays: selectedDate ? [selectedDate.getDay()] : [1], // Default to Monday if no date selected
    interval: 1, // Every week
    endDate: addWeeks(new Date(), 8), // Default to 8 weeks
    occurrences: 8, // Default to 8 occurrences
  });

  // State for end type (by date or by occurrences)
  const [endType, setEndType] = useState<"date" | "occurrences">("occurrences");

  // State for notes
  const [notes, setNotes] = useState("");

  // State for availability preview
  const [previewDates, setPreviewDates] = useState<Date[]>([]);

  // Update weekdays when selected date changes
  useEffect(() => {
    if (selectedDate && !isRecurring) {
      setPattern((prev) => ({
        ...prev,
        weekdays: [selectedDate.getDay()],
      }));
    }
  }, [selectedDate, isRecurring]);

  // Generate preview dates when pattern changes
  useEffect(() => {
    if (!selectedDate || !isRecurring) {
      setPreviewDates(selectedDate ? [selectedDate] : []);
      return;
    }

    const dates: Date[] = [];
    let currentDate = new Date(selectedDate);

    if (pattern.type === "weekly") {
      const maxDates = pattern.occurrences || 50; // Limit to avoid infinite loops
      const endDateLimit = pattern.endDate || addWeeks(currentDate, 52); // Max 1 year

      let occurrenceCount = 0;

      while (
        (endType === "occurrences"
          ? occurrenceCount < (pattern.occurrences || 0)
          : currentDate <= endDateLimit) &&
        dates.length < maxDates
      ) {
        const dayOfWeek = currentDate.getDay();

        if (pattern.weekdays.includes(dayOfWeek)) {
          dates.push(new Date(currentDate));
          occurrenceCount++;
        }

        currentDate = addDays(currentDate, 1);
      }
    }

    setPreviewDates(dates);
  }, [selectedDate, isRecurring, pattern, endType]);

  // Add a new time slot
  const addTimeSlot = () => {
    const lastSlot = timeSlots[timeSlots.length - 1];
    const newId = String(Number.parseInt(lastSlot.id) + 1);

    // Default to 1-hour slots starting after the last slot
    const newStartTime = lastSlot.endTime;
    const [hours, minutes] = newStartTime.split(":").map(Number);
    let newEndHour = hours + 1;
    let newEndMinutes = minutes;

    if (newEndHour > 23) {
      newEndHour = 23;
      newEndMinutes = 59;
    }

    const newEndTime = `${newEndHour
      .toString()
      .padStart(2, "0")}:${newEndMinutes.toString().padStart(2, "0")}`;

    setTimeSlots([
      ...timeSlots,
      { id: newId, startTime: newStartTime, endTime: newEndTime },
    ]);
  };

  // Remove a time slot
  const removeTimeSlot = (id: string) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    }
  };

  // Update a time slot
  const updateTimeSlot = (
    id: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  // Toggle a weekday in the pattern
  const toggleWeekday = (day: number) => {
    setPattern((prev) => {
      const weekdays = prev.weekdays.includes(day)
        ? prev.weekdays.filter((d) => d !== day)
        : [...prev.weekdays, day];

      return { ...prev, weekdays };
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      toast("", {
        description: "Please select a date",
      });
      return;
    }

    if (timeSlots.some((slot) => !slot.startTime || !slot.endTime)) {
      toast("", {
        description: "Please fill in all time slots",
      });
      return;
    }

    // Validate time slots (end time should be after start time)
    for (const slot of timeSlots) {
      if (slot.startTime >= slot.endTime) {
        toast("", {
          description: "End time must be after start time",
        });
        return;
      }
    }

    if (isRecurring && pattern.weekdays.length === 0) {
      toast("", {
        description:
          "Please select at least one day of the week for recurring availability",
      });
      return;
    }

    // Create availability data
    const availabilityData = {
      startDate: format(selectedDate, "yyyy-MM-dd"),
      timeSlots,
      isRecurring,
      pattern: isRecurring ? pattern : null,
      notes,
      previewDates: previewDates.map((date) => format(date, "yyyy-MM-dd")),
    };

    console.log("Availability data:", availabilityData);

    // In a real app, you would save this data to your backend
    toast("", {
      description: "Availability has been saved successfully",
    });

    // Then redirect to the availability page
    navigate("/availability");
  };

  // Weekday labels
  const weekdays = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add Availability</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Availability</CardTitle>
              <CardDescription>
                Define when you're available for consultations
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form id="availability-form" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Time Slots</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTimeSlot}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Slot
                      </Button>
                    </div>

                    {timeSlots.map((slot, _index) => (
                      <div
                        key={slot.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 flex-grow">
                          <div className="space-y-1">
                            <Label
                              htmlFor={`start-time-${slot.id}`}
                              className="text-xs"
                            >
                              Start Time
                            </Label>
                            <Input
                              id={`start-time-${slot.id}`}
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  slot.id,
                                  "startTime",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label
                              htmlFor={`end-time-${slot.id}`}
                              className="text-xs"
                            >
                              End Time
                            </Label>
                            <Input
                              id={`end-time-${slot.id}`}
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  slot.id,
                                  "endTime",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        {timeSlots.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-600 flex-shrink-0"
                            onClick={() => removeTimeSlot(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Recurring Options */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="recurring">Recurring Availability</Label>
                      <Switch
                        id="recurring"
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                      />
                    </div>

                    {isRecurring && (
                      <div className="space-y-6 pl-0 mt-4 pt-4 border-t border-dashed">
                        {/* Recurrence Pattern */}
                        <div className="space-y-4">
                          <Label>Repeat on</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                            {weekdays.map((day) => (
                              <div
                                key={day.id}
                                className={cn(
                                  "flex items-center justify-center p-2 rounded-md cursor-pointer border",
                                  pattern.weekdays.includes(day.id)
                                    ? "bg-green-100 border-green-300 text-green-800"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                                onClick={() => toggleWeekday(day.id)}
                              >
                                <span className="text-sm font-medium">
                                  {day.name.substring(0, 3)}
                                </span>
                                {pattern.weekdays.includes(day.id) && (
                                  <Check className="h-3 w-3 ml-1 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Repeat Frequency */}
                        <div className="space-y-2">
                          <Label htmlFor="interval">Repeat every</Label>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={pattern.interval.toString()}
                              onValueChange={(value) =>
                                setPattern({
                                  ...pattern,
                                  interval: Number.parseInt(value),
                                })
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="1" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>week(s)</span>
                          </div>
                        </div>

                        {/* End Options */}
                        <div className="space-y-4">
                          <Label>End</Label>
                          <RadioGroup
                            value={endType}
                            onValueChange={(value) =>
                              setEndType(value as "date" | "occurrences")
                            }
                            className="space-y-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="occurrences"
                                id="end-occurrences"
                              />
                              <div className="flex items-center space-x-2">
                                <Label
                                  htmlFor="end-occurrences"
                                  className="font-normal"
                                >
                                  After
                                </Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="52"
                                  className="w-20"
                                  value={pattern.occurrences || ""}
                                  onChange={(e) =>
                                    setPattern({
                                      ...pattern,
                                      occurrences:
                                        Number.parseInt(e.target.value) || null,
                                    })
                                  }
                                  disabled={endType !== "occurrences"}
                                />
                                <span>occurrences</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="date" id="end-date" />
                              <div className="flex items-center space-x-2">
                                <Label
                                  htmlFor="end-date"
                                  className="font-normal"
                                >
                                  On date
                                </Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-[180px] justify-start text-left font-normal",
                                        !pattern.endDate &&
                                          "text-muted-foreground"
                                      )}
                                      disabled={endType !== "date"}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {pattern.endDate ? (
                                        format(pattern.endDate, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={pattern.endDate || undefined}
                                      onSelect={(date) =>
                                        setPattern({
                                          ...pattern,
                                          endDate: date || null,
                                        })
                                      }
                                      disabled={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return (
                                          date < today ||
                                          (selectedDate
                                            ? date < selectedDate
                                            : false)
                                        );
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional information about this availability"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" form="availability-form">
                Save Availability
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Availability Preview</CardTitle>
              <CardDescription>
                {previewDates.length} date{previewDates.length !== 1 ? "s" : ""}{" "}
                selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previewDates.length > 0 ? (
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    {previewDates.map((date, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-md mb-2 bg-green-50 border-green-200"
                      >
                        <p className="font-medium text-green-800">
                          {format(date, "EEEE, MMMM d, yyyy")}
                        </p>
                        <div className="mt-2 space-y-1">
                          {timeSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="text-sm text-green-700 flex items-center"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {slot.startTime} - {slot.endTime}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No dates selected</p>
                    <p className="text-sm mt-1">
                      Select a date and time to see a preview
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
