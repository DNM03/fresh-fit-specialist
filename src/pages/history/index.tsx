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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  Clock,
  Phone,
  Video,
  FileText,
  Calendar as CalendarIcon2,
  Star,
  ChevronRight,
  Users,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isSameMonth, addMonths, subMonths } from "date-fns";
import { Link } from "react-router-dom";
import specialistService from "@/services/specialist.service";

// Helper function to format date-time
function formatDateTime(isoString: string, formatStr: string = "PPpp"): string {
  try {
    return format(parseISO(isoString), formatStr);
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
}

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
    expertReview?: {
      rating: number;
      comment: string;
    } | null;
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

export default function History() {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentType, setAppointmentType] = useState("all");
  const [specialist, setSpecialist] = useState<any>();
  const [completedAppointments, setCompletedAppointments] = useState<
    AppointmentSlot[]
  >([]);
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
        const response = await specialistService.getSpecialistAvailableSlots({
          specialistId: specialist.id,
          month: selectedMonth.getMonth() + 1,
          year: selectedMonth.getFullYear(),
        });

        const availabilities = response.data.data.availabilities || [];
        const completedSlots: AppointmentSlot[] = [];
        let monthlyEarnings = 0;
        let ratingSum = 0;
        let ratingCount = 0;

        availabilities.forEach((dateAvail: DateAvailability) => {
          if (dateAvail.slots && dateAvail.slots.length > 0) {
            const completedSlotsForDate = dateAvail.slots.filter(
              (slot) =>
                slot.appointment !== null &&
                slot.appointment.status.toUpperCase() === "COMPLETED"
            );

            if (completedSlotsForDate.length > 0) {
              completedSlots.push(...completedSlotsForDate);

              completedSlotsForDate.forEach((slot) => {
                if (slot.appointment?.fees) {
                  monthlyEarnings += slot.appointment.fees;
                }

                if (slot.appointment?.expertReview?.rating) {
                  ratingSum += slot.appointment.expertReview.rating;
                  ratingCount++;
                }
              });
            }
          }
        });

        setCompletedAppointments(completedSlots);
        setTotalAppointments(completedSlots.length);
        setTotalEarnings(monthlyEarnings);
        setAverageRating(ratingCount > 0 ? ratingSum / ratingCount : 0);
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

  const filteredAppointments = completedAppointments.filter((slot) => {
    const matchesSearch =
      slot.appointment?.user?.fullName
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase()) ||
      slot.appointment?.user?.email
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase()) ||
      false;

    const matchesType =
      appointmentType === "all" ||
      slot.appointment?.type?.toUpperCase() === appointmentType.toUpperCase();

    return matchesSearch && matchesType;
  });

  const handlePrevMonth = () => {
    setSelectedMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prevMonth) => addMonths(prevMonth, 1));
  };

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
            <CardDescription>Total Earnings</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">${totalEarnings}</CardTitle>
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

              <Select
                value={appointmentType}
                onValueChange={setAppointmentType}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Appointment List */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Appointments</CardTitle>
          <CardDescription>
            {filteredAppointments.length} completed consultations found
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
              {filteredAppointments.map((slot) => (
                <div
                  key={slot.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
                    <div className="flex items-center mb-4 md:mb-0">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage
                          src={
                            slot.appointment?.user?.avatar || "/placeholder.svg"
                          }
                          alt={slot.appointment?.user?.fullName || "Patient"}
                        />
                        <AvatarFallback>
                          {slot.appointment?.user?.fullName
                            ?.split(" ")
                            ?.map((n) => n[0])
                            ?.join("") || "P"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-medium">
                          {slot.appointment?.user?.fullName ||
                            "Unknown Patient"}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon2 className="h-3 w-3 mr-1" />
                          <span>
                            {formatDateTime(slot.startTime, "MMMM d, yyyy")}
                          </span>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {formatDateTime(slot.startTime, "h:mm a")} -{" "}
                            {formatDateTime(slot.endTime, "h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                      <div className="flex items-center mr-4">
                        <div className="bg-blue-100 p-1 rounded-full mr-2">
                          {getAppointmentIcon(slot.appointment?.type)}
                        </div>
                        <span className="text-sm font-medium capitalize">
                          {slot.appointment?.type?.toLowerCase() ||
                            "Consultation"}
                        </span>
                      </div>

                      {slot.appointment?.expertReview?.rating && (
                        <div className="flex items-center mr-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= slot.appointment.expertReview!.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <Link to={`/appointments/${slot.appointment.id}`}>
                        <Button variant="ghost" size="sm" className="ml-2">
                          Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Optional: Show notes or issues if they exist */}
                  {(slot.appointment?.notes || slot.appointment?.issues) && (
                    <div className="px-4 py-3 border-t bg-gray-50">
                      <div className="text-sm">
                        {slot.appointment?.issues && (
                          <div className="mb-2">
                            <span className="font-medium text-gray-700">
                              Issues:
                            </span>{" "}
                            <span className="text-gray-600">
                              {slot.appointment.issues}
                            </span>
                          </div>
                        )}
                        {slot.appointment?.notes && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Notes:
                            </span>{" "}
                            <span className="text-gray-600">
                              {slot.appointment.notes}
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
                        className="bg-green-100 text-green-800 border-green-200"
                        variant="outline"
                      >
                        {slot.appointment?.paymentStatus || "PAID"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">
                      Fee: ${slot.appointment?.fees || 0}
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
                There are no completed appointments for{" "}
                {format(selectedMonth, "MMMM yyyy")}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMonth(new Date());
                  setSearchQuery("");
                  setAppointmentType("all");
                }}
              >
                Check current month
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-gray-500">
            Showing {filteredAppointments.length} of{" "}
            {completedAppointments.length} completed appointments
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
