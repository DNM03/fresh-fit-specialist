import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isSameDay, parseISO } from "date-fns";
import {
  Plus,
  Calendar,
  Clock,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Availability() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const [availabilities, setAvailabilities] = useState([
    {
      id: "avail-1",
      date: "2025-04-15",
      startTime: "09:00",
      endTime: "12:00",
      status: "available",
    },
    {
      id: "avail-2",
      date: "2025-04-15",
      startTime: "13:00",
      endTime: "17:00",
      status: "available",
    },
    {
      id: "avail-3",
      date: "2025-04-16",
      startTime: "09:00",
      endTime: "12:00",
      status: "available",
    },
    {
      id: "avail-4",
      date: "2025-04-18",
      startTime: "14:00",
      endTime: "18:00",
      status: "available",
    },
    {
      id: "avail-5",
      date: "2025-04-22",
      startTime: "10:00",
      endTime: "15:00",
      status: "available",
    },
  ]);

  // Function to handle deleting an availability slot
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this availability?")) {
      setAvailabilities(availabilities.filter((avail) => avail.id !== id));
    }
  };

  // Function to check if a date has availability
  const hasAvailability = (date: Date) => {
    return availabilities.some((avail) =>
      isSameDay(parseISO(avail.date), date)
    );
  };

  // Get availabilities for the selected date
  const selectedDateAvailabilities = selectedDate
    ? availabilities.filter((avail) =>
        isSameDay(parseISO(avail.date), selectedDate)
      )
    : [];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Your Availability</h1>
        <Link to="/availability/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Availability
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Select a date to view or add availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const prevMonth = new Date(currentMonth);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setCurrentMonth(prevMonth);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const nextMonth = new Date(currentMonth);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setCurrentMonth(nextMonth);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center mb-4">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border w-full"
                modifiers={{
                  hasAvailability: (date) => hasAvailability(date),
                }}
                modifiersClassNames={{
                  hasAvailability: "bg-blue-100 text-sky-700",
                  selected: "!bg-primary !text-white",
                }}
                components={{
                  Caption: () => null, // hides the header
                }}
                classNames={{
                  root: "w-full",
                  table: "w-full table-fixed",
                  head_row: "w-full",
                  head_cell: "text-center w-full font-medium text-gray-500",
                  row: "w-full",
                  cell: "w-full h-12 p-1",
                  day: "w-full h-full flex items-center justify-center rounded-md",
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center mr-4">
                <div className="w-4 h-4 rounded-full bg-blue-100 mr-2"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-100 mr-2"></div>
                <span className="text-sm">No Availability</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {selectedDate
                    ? format(selectedDate, "EEEE, MMMM d, yyyy")
                    : "Select a Date"}
                </CardTitle>
                <CardDescription>
                  {selectedDateAvailabilities.length > 0
                    ? `${selectedDateAvailabilities.length} availability slots`
                    : "No availability set for this date"}
                </CardDescription>
              </div>
              {selectedDate && (
                <Link
                  to={`/availability/add?date=${format(
                    selectedDate,
                    "yyyy-MM-dd"
                  )}`}
                >
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add for This Date
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <TabsList className="mb-4">
                <TabsTrigger value="daily">Daily View</TabsTrigger>
                <TabsTrigger value="weekly">Weekly View</TabsTrigger>
              </TabsList>

              <TabsContent value="daily">
                {selectedDateAvailabilities.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateAvailabilities.map((avail) => (
                      <div
                        key={avail.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {avail.startTime} - {avail.endTime}
                            </p>
                            <p className="text-sm text-gray-500">
                              {calculateDuration(
                                avail.startTime,
                                avail.endTime
                              )}{" "}
                              hours
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            className="bg-green-100 text-green-800 mr-4"
                            variant="outline"
                          >
                            Available
                          </Badge>
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 mr-1"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleDelete(avail.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      No availability set for this date
                    </p>
                    {selectedDate && (
                      <Link
                        to={`/availability/add?date=${format(
                          selectedDate,
                          "yyyy-MM-dd"
                        )}`}
                      >
                        <Button>Add Availability</Button>
                      </Link>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="weekly">
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <div key={day} className="text-center font-medium">
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-2 h-[300px]">
                      {Array.from({ length: 7 }).map((_, index) => {
                        const date = new Date(selectedDate || new Date());
                        date.setDate(
                          date.getDate() - date.getDay() + index + 1
                        );

                        const dayAvailabilities = availabilities.filter(
                          (avail) => isSameDay(parseISO(avail.date), date)
                        );

                        return (
                          <div
                            key={index}
                            className={`border rounded-lg p-2 overflow-y-auto ${
                              isSameDay(date, selectedDate || new Date())
                                ? "bg-blue-50 border-blue-200"
                                : ""
                            }`}
                          >
                            <div className="text-center text-sm mb-2">
                              {format(date, "d MMM")}
                            </div>
                            {dayAvailabilities.length > 0 ? (
                              <div className="space-y-2">
                                {dayAvailabilities.map((avail) => (
                                  <div
                                    key={avail.id}
                                    className="text-xs p-2 bg-blue-100 rounded"
                                  >
                                    <p className="font-medium">
                                      {avail.startTime} - {avail.endTime}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="h-10 flex items-center justify-center text-xs text-gray-400">
                                No availability
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Available Slots</CardTitle>
          <CardDescription>All your upcoming availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availabilities.length > 0 ? (
              availabilities
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((avail) => (
                  <div
                    key={avail.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {format(parseISO(avail.date), "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {avail.startTime} - {avail.endTime} (
                          {calculateDuration(avail.startTime, avail.endTime)}{" "}
                          hours)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        className="bg-green-100 text-green-800 mr-4"
                        variant="outline"
                      >
                        Available
                      </Badge>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 mr-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDelete(avail.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-10 border rounded-lg">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No availability set</p>
                <Link to="/availability/add">
                  <Button>Add Availability</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to calculate duration between two time strings (HH:MM)
function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  return Math.round(((endTotalMinutes - startTotalMinutes) / 60) * 10) / 10;
}
