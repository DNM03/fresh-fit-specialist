import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import specialistService from "@/services/specialist.service";

export default function AddAvailabilityPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const initialDate = params.get("date");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : new Date()
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:45");
  const [isLoading, setIsLoading] = useState(false);

  const [recurringType, setRecurringType] = useState<
    "ONE_MONTH" | "EVERY_MONTH" | "ONE_DAY"
  >("ONE_MONTH");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!selectedDate) {
        toast("", {
          description: "Please select a date",
        });
        return;
      }

      if (!startTime || !endTime) {
        toast("", {
          description: "Please select start and end times",
        });
        return;
      }

      if (startTime >= endTime) {
        toast("", {
          description: "End time must be after start time",
        });
        return;
      }
      const availabilityData = {
        availability: {
          date: format(selectedDate, "yyyy-MM-dd"),
          startTime,
          endTime,
        },
        type: recurringType,
      };

      const response = await specialistService.addAvailableSlot(
        availabilityData
      );
      if (response.status !== 200) {
        toast.error(response.data.message || "Failed to save availability", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
        return;
      }

      toast.success("", {
        description: "Availability has been saved successfully",
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
      navigate("/availability");
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("An error occurred while saving availability", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                    <Label htmlFor="date">Date</Label>
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

                  {/* Time Selection */}
                  <div className="space-y-4">
                    <Label>Time Slot</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 flex-grow">
                        <div className="space-y-1">
                          <Label htmlFor="start-time" className="text-xs">
                            Start Time
                          </Label>
                          <Input
                            id="start-time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="end-time" className="text-xs">
                            End Time
                          </Label>
                          <Input
                            id="end-time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recurring Options */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label>Recurrence Type</Label>
                    <RadioGroup
                      value={recurringType}
                      onValueChange={(value) =>
                        setRecurringType(
                          value as "ONE_MONTH" | "EVERY_MONTH" | "ONE_DAY"
                        )
                      }
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ONE_DAY" id="one-day" />
                        <Label htmlFor="one-day" className="font-normal">
                          One Day Only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ONE_MONTH" id="one-month" />
                        <Label htmlFor="one-month" className="font-normal">
                          One Month Only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="EVERY_MONTH" id="every-month" />
                        <Label htmlFor="every-month" className="font-normal">
                          Every Month
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="availability-form"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Availability"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Availability Preview</CardTitle>
              <CardDescription>Summary of your availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedDate ? (
                  <div className="p-3 border rounded-md mb-2 bg-green-50 border-green-200">
                    <p className="font-medium text-green-800">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm text-green-700 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {startTime} - {endTime}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-green-800 font-medium">
                      Recurrence:{" "}
                      {recurringType === "ONE_DAY"
                        ? "One Day Only"
                        : recurringType === "ONE_MONTH"
                        ? "One Month Only"
                        : "Every Month"}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No date selected</p>
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
