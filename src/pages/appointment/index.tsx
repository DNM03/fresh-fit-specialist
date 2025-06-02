import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Video,
} from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";
import specialistService from "@/services/specialist.service";
import { Link } from "react-router-dom";

// Helper function to format date-time
function formatDateTime(isoString: string, formatStr: string = "PPpp"): string {
  try {
    return format(parseISO(isoString), formatStr);
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
}

// Interface for data structure
interface AppointmentSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointment: {
    id: string;
    status: string;
    meetingLink: string | null;
    paymentStatus: string;
    issues: string;
    notes: string;
    fees: number;
    cancellationReason: string | null;
    type: string;
    user: {
      _id: string;
      fullName: string;
      email: string;
      gender: number;
      username: string;
      avatar: string;
    };
  };
}

interface DateAvailability {
  date: string;
  slots: AppointmentSlot[];
}

export default function Appointment() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [, setDateAvailabilities] = useState<DateAvailability[]>([]);
  const [appointments, setAppointments] = useState<AppointmentSlot[]>([]);
  const [specialist, setSpecialist] = useState<any>();

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

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!specialist?.id) return;

      try {
        const response = await specialistService.getSpecialistAvailableSlots({
          specialistId: specialist.id,
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        });

        // Store all date availabilities
        const availabilities = response.data.data.availabilities || [];
        setDateAvailabilities(availabilities);

        // Extract only slots with appointments (booked slots)
        const bookedAppointments: AppointmentSlot[] = [];

        availabilities.forEach((dateAvail: DateAvailability) => {
          if (dateAvail.slots && dateAvail.slots.length > 0) {
            const bookedSlots = dateAvail.slots.filter(
              (slot) => slot.appointment !== null
            );

            if (bookedSlots.length > 0) {
              bookedAppointments.push(...bookedSlots);
            }
          }
        });

        console.log("Booked appointments:", bookedAppointments);
        setAppointments(bookedAppointments);
      } catch (error) {
        console.error("Error fetching availabilities:", error);
      }
    };

    if (specialist) {
      fetchAvailabilities();
    }
  }, [specialist, currentMonth]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "RESCHEDULED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAppointmentIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "CALL":
        return <Phone className="h-3 w-3" />;
      case "VIDEO":
        return <Video className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.appointment?.user?.fullName
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase()) ||
      appointment.appointment?.user?.email
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase()) ||
      false;

    const appointmentStatus = appointment.appointment?.status || "";
    const matchesStatus =
      statusFilter === "all" ||
      appointmentStatus.toLowerCase() === statusFilter.toLowerCase();

    const appointmentDate = parseISO(appointment.startTime);
    const matchesDate = selectedDate
      ? isSameDay(appointmentDate, selectedDate)
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const groupedAppointments = filteredAppointments.reduce(
    (acc: Record<string, AppointmentSlot[]>, appointment) => {
      const dateKey = format(parseISO(appointment.startTime), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(appointment);
      return acc;
    },
    {}
  );

  Object.keys(groupedAppointments).forEach((dateKey) => {
    groupedAppointments[dateKey].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  // Sort date keys chronologically
  const sortedDateKeys = Object.keys(groupedAppointments).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Function to check if a date has appointments
  const hasAppointments = (date: Date) =>
    appointments.some((appointment) => {
      try {
        const appointmentDate = parseISO(appointment.startTime);
        return isSameDay(appointmentDate, date);
      } catch (error) {
        return false;
      }
    });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                Select a date to view appointments
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

              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={{
                  hasAppointments: (date) => hasAppointments(date),
                }}
                modifiersClassNames={{
                  hasAppointments: "bg-blue-100 text-sky-700",
                  selected: "!bg-primary !text-white",
                }}
                components={{
                  Caption: () => null, // hides the default header since we have our custom one
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

              <div className="mt-4">
                <h3 className="font-medium mb-2">Quick Filters</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const today = new Date();
                      setSelectedDate(today);
                      setCurrentMonth(today);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setSelectedDate(tomorrow);
                      setCurrentMonth(tomorrow);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Tomorrow
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      setSelectedDate(nextWeek);
                      setCurrentMonth(nextWeek);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Next Week
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>
                    {selectedDate
                      ? format(selectedDate, "EEEE, MMMM d, yyyy")
                      : "All Appointments"}
                  </CardTitle>
                  <CardDescription>
                    {filteredAppointments.length} appointments found
                  </CardDescription>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-8 w-full md:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list">
                <TabsList className="mb-4">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={
                                slot.appointment?.user?.avatar ||
                                "/placeholder.svg"
                              }
                              alt={
                                slot.appointment?.user?.fullName || "Patient"
                              }
                            />
                            <AvatarFallback>
                              {slot.appointment?.user?.fullName
                                ?.split(" ")
                                ?.map((n) => n[0])
                                ?.join("") || "P"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {slot.appointment?.user?.fullName ||
                                "Unknown Patient"}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDateTime(slot.startTime, "h:mm a")} -{" "}
                              {formatDateTime(slot.endTime, "h:mm a")}
                              <span className="mx-2">•</span>
                              <div className="flex items-center gap-1">
                                {getAppointmentIcon(slot.appointment?.type)}
                                <span>
                                  {slot.appointment?.type || "Consultation"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            className={getStatusColor(slot.appointment?.status)}
                            variant="outline"
                          >
                            {(slot.appointment?.status || "PENDING")
                              .charAt(0)
                              .toUpperCase() +
                              (slot.appointment?.status || "PENDING")
                                .slice(1)
                                .toLowerCase()}
                          </Badge>
                          <div className="flex ml-4">
                            <Link to={`/appointments/${slot.appointment.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 border rounded-lg">
                      <p className="text-gray-500">
                        No appointments found for the selected criteria
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          const today = new Date();
                          setSelectedDate(today);
                          setCurrentMonth(today);
                          setStatusFilter("all");
                          setSearchQuery("");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="timeline">
                  <div className="space-y-6">
                    {sortedDateKeys.length > 0 ? (
                      sortedDateKeys.map((dateKey) => (
                        <div key={dateKey} className="mb-8">
                          <div className="flex items-center mb-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium">
                              {format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
                            </h3>
                          </div>
                          <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="space-y-8 pl-8">
                              {groupedAppointments[dateKey].map((slot) => (
                                <div key={slot.id} className="relative">
                                  <div className="absolute -left-4 top-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    {getAppointmentIcon(slot.appointment?.type)}
                                  </div>
                                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium text-blue-600">
                                          {formatDateTime(
                                            slot.startTime,
                                            "h:mm a"
                                          )}{" "}
                                          -{" "}
                                          {formatDateTime(
                                            slot.endTime,
                                            "h:mm a"
                                          )}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Avatar className="h-6 w-6">
                                            <AvatarImage
                                              src={
                                                slot.appointment?.user
                                                  ?.avatar || "/placeholder.svg"
                                              }
                                            />
                                            <AvatarFallback>
                                              {slot.appointment?.user?.fullName?.charAt(
                                                0
                                              ) || "P"}
                                            </AvatarFallback>
                                          </Avatar>
                                          <p className="font-medium">
                                            {slot.appointment?.user?.fullName ||
                                              "Unknown Patient"}
                                          </p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                          Email:{" "}
                                          {slot.appointment?.user?.email ||
                                            "N/A"}
                                        </p>
                                        {slot.appointment?.issues && (
                                          <div className="mt-2">
                                            <p className="text-sm text-gray-700 font-medium">
                                              Issues:
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              {slot.appointment.issues}
                                            </p>
                                          </div>
                                        )}
                                        {slot.appointment?.notes && (
                                          <div className="mt-2">
                                            <p className="text-sm text-gray-700 font-medium">
                                              Notes:
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              {slot.appointment.notes}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <Badge
                                          className={getStatusColor(
                                            slot.appointment?.status
                                          )}
                                          variant="outline"
                                        >
                                          {(
                                            slot.appointment?.status ||
                                            "PENDING"
                                          )
                                            .charAt(0)
                                            .toUpperCase() +
                                            (
                                              slot.appointment?.status ||
                                              "PENDING"
                                            )
                                              .slice(1)
                                              .toLowerCase()}
                                        </Badge>
                                        <Badge
                                          className="mt-2 bg-green-50 text-green-700"
                                          variant="outline"
                                        >
                                          {slot.appointment?.paymentStatus ||
                                            "UNPAID"}
                                        </Badge>
                                        {slot.appointment?.fees && (
                                          <p className="text-sm font-medium mt-2">
                                            ${slot.appointment.fees}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex mt-4">
                                      <Link
                                        to={`/appointments/${slot.appointment.id}`}
                                      >
                                        <Button variant="outline" size="sm">
                                          View Details
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 border rounded-lg">
                        <p className="text-gray-500">
                          No appointments found for the selected criteria
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            const today = new Date();
                            setSelectedDate(today);
                            setCurrentMonth(today);
                            setStatusFilter("all");
                            setSearchQuery("");
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
