import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  // Search,
  Clock,
  Phone,
  Video,
  FileText,
  Calendar as CalendarIcon2,
  Star,
  ChevronRight,
  Users,
  FilterIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameMonth, addMonths, subMonths } from "date-fns";
import { Link } from "react-router-dom";
import specialistService from "@/services/specialist.service";

// Helper function to format date-time
function formatDateTime(
  dateString: string,
  formatStr: string = "PPpp"
): string {
  try {
    const timeMatch = dateString.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
      const [, hours, minutes] = timeMatch;
      const today = new Date();
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return format(today, formatStr);
    }
    throw new Error("Time not found");
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
}

// Updated interface to match new API structure
interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  userId: string;
  expert?: {
    id: string;
    fullName: string;
    gender: string;
    username: string;
    avatar: string;
    experience_years: number;
    rating: number;
  };
  user?: {
    id: string;
    fullName: string;
    gender: string;
    username: string;
    email: string;
    avatar: string;
  };
  meetingLink?: string | null;
  paymentStatus?: string;
  issues?: string;
  notes?: string;
  fees?: number;
  cancellationReason?: string | null;
  expertReview?: {
    rating: number;
    comment: string;
  } | null;
}

export default function History() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  // const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specialist, setSpecialist] = useState<any>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch specialist info
  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const response = await specialistService.getSpecialistByAccessToken();
        setSpecialist(response.data.data.expertInfo);
        setAverageRating(response.data.data.expertInfo?.rating || 0);
      } catch (error) {
        console.error("Error fetching specialist profile:", error);
      }
    };

    fetchSpecialist();
  }, []);

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      if (!specialist?.id) return;

      setLoading(true);
      try {
        const response = await specialistService.getAppointmentsBySpecialistId({
          specialistId: specialist.id,
          month: selectedMonth.getMonth() + 1,
          year: selectedMonth.getFullYear(),
          page: 1,
          limit: 300, // Adjust limit as needed
        });

        // Get appointments directly from the response
        const appointments = response.data.data.appointments || [];

        // Calculate totals
        let monthlyEarnings = 0;
        let completedCount = 0;

        appointments.forEach((appointment: Appointment) => {
          if (appointment.status === "COMPLETED") {
            monthlyEarnings += 200000;
            completedCount++;
          }
        });

        setAppointments(appointments);
        setTotalAppointments(appointments.length);
        setTotalEarnings(monthlyEarnings);
      } catch (error) {
        console.error("Error fetching appointment history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (specialist) {
      fetchAppointmentHistory();
    }
  }, [specialist, selectedMonth]);

  const getAppointmentIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "CALL":
        return <Phone className="h-4 w-4" />;
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePrevMonth = () => {
    setSelectedMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  // Filter appointments based on status
  const filteredAppointments = appointments.filter((appointment) => {
    return statusFilter === "all" || appointment.status?.toUpperCase() === statusFilter;
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointment History</h1>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Appointments</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{totalAppointments}</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              For {format(selectedMonth, "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings (F2Coin)</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {totalEarnings.toLocaleString()}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              For {format(selectedMonth, "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Rating</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {averageRating.toFixed(1)}
                <span className="text-sm text-muted-foreground ml-2">
                  / 5.0
                </span>
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={handlePrevMonth}
                className="mr-2"
                size="sm"
              >
                Previous
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedMonth, "MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedMonth}
                    onSelect={(date) => date && setSelectedMonth(date)}
                    fromMonth={new Date(2020, 0)}
                    toMonth={new Date()}
                    initialFocus
                    month={selectedMonth}
                    onMonthChange={setSelectedMonth}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                onClick={handleNextMonth}
                className="ml-2"
                size="sm"
                disabled={
                  isSameMonth(selectedMonth, new Date()) ||
                  selectedMonth > new Date()
                }
              >
                Next
              </Button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center">
              <FilterIcon className="h-4 w-4 mr-2 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Appointment List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === "all" 
              ? "All Appointments" 
              : `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Appointments`}
          </CardTitle>
          <CardDescription>
            {filteredAppointments.length} {statusFilter !== "all" 
              ? statusFilter.toLowerCase() 
              : ""} appointments found
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 space-y-2">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Loading appointment history...
              </p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div>
                        <h3 className="font-medium">
                          {appointment.user?.fullName ||
                            "User " + appointment.userId.slice(-4)}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon2 className="h-3 w-3 mr-1" />
                          <span>
                            {formatDateTime(
                              appointment.startTime,
                              "MMMM d, yyyy"
                            )}
                          </span>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {formatDateTime(appointment.startTime, "h:mm a")} -{" "}
                            {formatDateTime(appointment.endTime, "h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                      <div className="flex items-center mr-4">
                        <div className="bg-blue-100 p-2 rounded-full mr-2">
                          {getAppointmentIcon(appointment.type)}
                        </div>
                        <span className="text-sm font-medium capitalize">
                          {appointment.type?.toLowerCase() || "Consultation"}
                        </span>
                      </div>

                      {appointment.expertReview?.rating && (
                        <div className="flex items-center mr-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= appointment.expertReview!.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <Link to={`/appointments/${appointment.id}`}>
                        <Button variant="ghost" size="sm" className="ml-2">
                          Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Optional: Show notes or issues if they exist */}
                  {(appointment.notes || appointment.issues) && (
                    <div className="px-4 py-3 border-t bg-gray-50">
                      <div className="text-sm">
                        {appointment.issues && (
                          <div className="mb-2">
                            <span className="font-medium text-gray-700">
                              Issues:
                            </span>{" "}
                            <span className="text-gray-600">
                              {appointment.issues}
                            </span>
                          </div>
                        )}
                        {appointment.notes && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Notes:
                            </span>{" "}
                            <span className="text-gray-600">
                              {appointment.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment info row */}
                  <div className="px-4 py-2 border-t bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge
                        className={getStatusColor(appointment.status)}
                        variant="outline"
                      >
                        {appointment.status || "CONFIRMED"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">
                      Fee:{" "}
                      {(appointment.status === "COMPLETED" || appointment.status === "CONFIRMED")
                        ? (200000).toLocaleString()
                        : 0}{" "}
                      F2Coin
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                No appointments found
              </h3>
              <p className="text-gray-500 mb-4">
                {statusFilter !== "all" 
                  ? `There are no ${statusFilter.toLowerCase()} appointments for ${format(selectedMonth, "MMMM yyyy")}`
                  : `There are no appointments for ${format(selectedMonth, "MMMM yyyy")}`}
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMonth(new Date());
                  }}
                >
                  Check current month
                </Button>
                {statusFilter !== "all" && (
                  <Button
                    variant="outline"
                    onClick={() => setStatusFilter("all")}
                  >
                    View all statuses
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-gray-500">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
