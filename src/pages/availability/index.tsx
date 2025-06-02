import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, isSameDay, parseISO } from "date-fns";
import {
  Plus,
  Calendar,
  Clock,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import specialistService from "@/services/specialist.service";
import { toast } from "sonner";

function formatDateTime(isoString: string, formatStr: string = "PPpp"): string {
  try {
    return format(parseISO(isoString), formatStr);
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
}

function calculateDuration(startTime: string, endTime: string): number {
  const startDate = parseISO(startTime);
  const endDate = parseISO(endTime);

  const diffInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

  return diffInMinutes;
}

export default function Availability() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [specialist, setSpecialist] = useState<any>();
  const [availabilities, setAvailabilities] = useState<any>([]);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const response = await specialistService.getSpecialistByAccessToken();
        setSpecialist(response.data.data.expertInfo);
      } catch (error) {
        console.error("Error fetching specialist profile:", error);
      }
    };

    fetchSpecialist();
  }, []);

  const fetchAvailabilities = async () => {
    if (!specialist?.id) return;

    try {
      const response = await specialistService.getSpecialistAvailableSlots({
        specialistId: specialist.id,
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      });
      setAvailabilities(response.data.data.availabilities || []);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  useEffect(() => {
    if (specialist) {
      fetchAvailabilities();
    }
  }, [specialist, currentMonth]);

  const handleEdit = (slot: any) => {
    // Format the date to YYYY-MM-DD for the date input
    const slotDate = parseISO(slot.startTime);
    const formattedDate = format(slotDate, "yyyy-MM-dd");

    // Format times to HH:MM for time inputs
    const formattedStartTime = format(parseISO(slot.startTime), "HH:mm");
    const formattedEndTime = format(parseISO(slot.endTime), "HH:mm");

    setEditingSlotId(slot.id);
    setEditFormData({
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
  };

  const handleCancelEdit = () => {
    setEditingSlotId(null);
    setEditFormData({ date: "", startTime: "", endTime: "" });
  };

  const handleSaveEdit = async (slotId: string) => {
    if (
      !editFormData.date ||
      !editFormData.startTime ||
      !editFormData.endTime
    ) {
      toast.error("All fields are required", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
      return;
    }

    if (editFormData.startTime >= editFormData.endTime) {
      toast.error("End time must be after start time", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
      return;
    }

    setIsUpdating(true);
    try {
      const startDate = new Date(
        `${editFormData.date}T${editFormData.startTime}:00`
      );
      const endDate = new Date(
        `${editFormData.date}T${editFormData.endTime}:00`
      );

      const startDateTime = startDate.toISOString();
      const endDateTime = endDate.toISOString();

      const dateObj = new Date(editFormData.date);

      const finalData = {
        date: dateObj.toISOString(),
        startTime: startDateTime,
        endTime: endDateTime,
      };
      console.log("Updating slot with data:", finalData);

      const respose = await specialistService.updateAvailableSlot(
        slotId,
        finalData
      );
      if (respose.status !== 200) {
        toast.error("Failed to update availability", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
        throw new Error("Failed to update availability");
      }

      toast.success("Availability updated successfully", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
      setEditingSlotId(null);
      fetchAvailabilities();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (slotId: string) => {
    setSlotToDelete(slotId);
    setIsDeleting(true);
  };

  const handleConfirmDelete = async () => {
    if (!slotToDelete) return;

    try {
      const response = await specialistService.deleteAvailableSlot(
        slotToDelete
      );
      if (response.status !== 200) {
        toast.error("Failed to delete availability", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
        throw new Error("Failed to delete availability");
      }
      toast.success("Availability deleted successfully", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
      fetchAvailabilities(); // Refetch data after deletion
    } catch (error) {
      console.error("Error deleting availability:", error);
      toast.error("Failed to delete availability", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsDeleting(false);
      setSlotToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setSlotToDelete(null);
  };

  // Function to check if a date has availability
  const hasAvailability = (date: Date) => {
    return (
      availabilities.find((avail: any) => isSameDay(parseISO(avail.date), date))
        ?.slots?.length > 0
    );
  };

  // Get availabilities for the selected date
  const selectedDateAvailabilities = selectedDate
    ? availabilities.filter((avail: any) =>
        isSameDay(parseISO(avail.date), selectedDate)
      )[0]?.slots || []
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
                    {selectedDateAvailabilities?.map((avail: any) => (
                      <div
                        key={avail.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {formatDateTime(avail.startTime, "h:mm a")} -{" "}
                                {formatDateTime(avail.endTime, "h:mm a")}
                              </p>
                              <p className="text-sm text-gray-500">
                                {calculateDuration(
                                  avail.startTime,
                                  avail.endTime
                                )}{" "}
                                minutes
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              className={`${
                                avail.isAvailable
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              } mr-4`}
                              variant="outline"
                            >
                              {avail.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                            {avail.isAvailable && (
                              <div className="flex">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 mr-1"
                                  onClick={() => handleEdit(avail)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() => handleDeleteClick(avail.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Edit Form that appears below the selected slot when editing */}
                        {editingSlotId === avail.id && (
                          <div className="p-4 border-t bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <Label htmlFor="edit-date">Date</Label>
                                <Input
                                  id="edit-date"
                                  type="date"
                                  value={editFormData.date}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      date: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="edit-start-time">
                                  Start Time
                                </Label>
                                <Input
                                  id="edit-start-time"
                                  type="time"
                                  value={editFormData.startTime}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      startTime: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="edit-end-time">End Time</Label>
                                <Input
                                  id="edit-end-time"
                                  type="time"
                                  value={editFormData.endTime}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      endTime: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex justify-end mt-4 space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(avail.id)}
                                disabled={isUpdating}
                              >
                                <Save className="h-4 w-4 mr-1" />
                                {isUpdating ? "Saving..." : "Save Changes"}
                              </Button>
                            </div>
                          </div>
                        )}
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

                        const dayAvailability = availabilities.find(
                          (avail: any) => isSameDay(parseISO(avail.date), date)
                        );

                        const slots = dayAvailability?.slots || [];

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
                            {slots.length > 0 ? (
                              <div className="space-y-2">
                                {slots.map((slot: any, slotIndex: number) => (
                                  <div
                                    key={slotIndex}
                                    className="text-xs p-2 bg-blue-100 rounded"
                                  >
                                    <p className="font-medium">
                                      {formatDateTime(slot.startTime, "h:mm a")}{" "}
                                      - {formatDateTime(slot.endTime, "h:mm a")}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {calculateDuration(
                                        slot.startTime,
                                        slot.endTime
                                      )}{" "}
                                      min
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
            {availabilities?.length > 0 ? (
              availabilities
                ?.filter((avail: any) => avail?.slots?.length > 0)
                ?.sort(
                  (a: any, b: any) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                ?.map((avail: any, index: number) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="font-medium text-lg">
                        {format(parseISO(avail.date), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="pl-14 space-y-3">
                      {avail.slots.map((slot: any, slotIndex: number) => (
                        <div
                          key={slotIndex}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="flex items-center justify-between p-3">
                            <div>
                              <p className="text-sm font-medium">
                                {formatDateTime(slot.startTime, "h:mm a")} -{" "}
                                {formatDateTime(slot.endTime, "h:mm a")}
                              </p>
                              <p className="text-xs text-gray-500">
                                {calculateDuration(
                                  slot.startTime,
                                  slot.endTime
                                )}{" "}
                                minutes
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Badge
                                className={`${
                                  slot.isAvailable
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                } mr-4`}
                                variant="outline"
                              >
                                {slot.isAvailable ? "Available" : "Unavailable"}
                              </Badge>
                              {slot.isAvailable && (
                                <div className="flex">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 mr-1"
                                    onClick={() => handleEdit(slot)} // Added onClick handler here
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600"
                                    onClick={() => handleDeleteClick(slot.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Edit Form that appears below the selected slot when editing */}
                          {editingSlotId === slot.id && (
                            <div className="p-4 border-t bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <Label htmlFor={`edit-date-${slot.id}`}>
                                    Date
                                  </Label>
                                  <Input
                                    id={`edit-date-${slot.id}`}
                                    type="date"
                                    value={editFormData.date}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        date: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`edit-start-time-${slot.id}`}>
                                    Start Time
                                  </Label>
                                  <Input
                                    id={`edit-start-time-${slot.id}`}
                                    type="time"
                                    value={editFormData.startTime}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        startTime: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`edit-end-time-${slot.id}`}>
                                    End Time
                                  </Label>
                                  <Input
                                    id={`edit-end-time-${slot.id}`}
                                    type="time"
                                    value={editFormData.endTime}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        endTime: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end mt-4 space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(slot.id)}
                                  disabled={isUpdating}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  {isUpdating ? "Saving..." : "Save Changes"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
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

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this availability slot? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
