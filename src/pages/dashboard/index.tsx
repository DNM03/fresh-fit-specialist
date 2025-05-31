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
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Plus,
  FileText,
  CalendarIcon,
  BarChart3,
  ArrowUpRight,
  Phone,
  Video,
} from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "@/services";
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

interface Statistics {
  totalYesterDayAppointments: number;
  totalTodayAppointments: number;
  totalPendingAppointmentsLastMonth: number;
  totalPendingAppointmentsThisMonth: number;
  totalPatientsLastMonth: number;
  totalPatientsThisMonth: number;
  totalCompleteAppointmentsLastMonth: number;
  totalCompleteAppointmentsThisMonth: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [myProfile, setMyProfile] = useState<any>();
  const [expertDetail, setExpertDetail] = useState<any>();
  const [statistics, setStatistics] = useState<Statistics>({
    totalYesterDayAppointments: 0,
    totalTodayAppointments: 0,
    totalPendingAppointmentsLastMonth: 0,
    totalPendingAppointmentsThisMonth: 0,
    totalPatientsLastMonth: 0,
    totalPatientsThisMonth: 0,
    totalCompleteAppointmentsLastMonth: 0,
    totalCompleteAppointmentsThisMonth: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<AppointmentSlot[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Fetch user profile and expert details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getCurrentUser();
        if (response) {
          setMyProfile(response.data.result);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    const fetchExpertDetail = async () => {
      try {
        const response = await specialistService.getSpecialistByAccessToken();
        if (response) {
          setExpertDetail(response.data.data.expertInfo);
        }
      } catch (error) {
        console.error("Failed to fetch expert detail:", error);
      }
    };

    fetchProfile();
    fetchExpertDetail();
  }, []);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await specialistService.getDashBoardStats();
        if (response && response.data && response.data.data) {
          setStatistics(response.data.data.statistic);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard statistics:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch today's appointments
  useEffect(() => {
    const fetchTodayAppointments = async () => {
      if (!expertDetail?.id) return;

      setLoading(true);
      try {
        const today = new Date();
        const response = await specialistService.getSpecialistAvailableSlots({
          specialistId: expertDetail.id,
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        });

        // Extract only slots with appointments for today
        const availabilities = response.data.data.availabilities || [];
        const todaySlots: AppointmentSlot[] = [];

        availabilities.forEach((dateAvail: any) => {
          if (dateAvail.slots && dateAvail.slots.length > 0) {
            const todaySlotsForDate = dateAvail.slots.filter(
              (slot: AppointmentSlot) =>
                slot.appointment !== null &&
                isSameDay(parseISO(slot.startTime), today)
            );

            if (todaySlotsForDate.length > 0) {
              todaySlots.push(...todaySlotsForDate);
            }
          }
        });

        // Sort by start time
        todaySlots.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        setTodayAppointments(todaySlots);
      } catch (error) {
        console.error("Error fetching today's appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (expertDetail) {
      fetchTodayAppointments();
    }
  }, [expertDetail]);

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

  // Calculate trend direction for statistics
  const calculateTrend = (current: number, previous: number) => {
    if (current === previous) return "stable";
    return current > previous ? "up" : "down";
  };

  // Calculate change in percentage or absolute value
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";

    const difference = current - previous;
    return difference >= 0 ? `+${difference}` : `${difference}`;
  };

  // Prepare stats cards data using actual API values
  const stats = [
    {
      title: "Today's Appointments",
      value: statistics.totalTodayAppointments,
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      change: `${calculateChange(
        statistics.totalTodayAppointments,
        statistics.totalYesterDayAppointments
      )} from yesterday`,
      trend: calculateTrend(
        statistics.totalTodayAppointments,
        statistics.totalYesterDayAppointments
      ),
    },
    {
      title: "Pending Appointments",
      value: statistics.totalPendingAppointmentsThisMonth,
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      change: `${calculateChange(
        statistics.totalPendingAppointmentsThisMonth,
        statistics.totalPendingAppointmentsLastMonth
      )} from last month`,
      trend: calculateTrend(
        statistics.totalPendingAppointmentsThisMonth,
        statistics.totalPendingAppointmentsLastMonth
      ),
    },
    {
      title: "Total Patients",
      value: statistics.totalPatientsThisMonth,
      icon: <Users className="h-5 w-5 text-green-500" />,
      change: `${calculateChange(
        statistics.totalPatientsThisMonth,
        statistics.totalPatientsLastMonth
      )} this month`,
      trend: calculateTrend(
        statistics.totalPatientsThisMonth,
        statistics.totalPatientsLastMonth
      ),
    },
    {
      title: "Completion Rate",
      value:
        statistics.totalCompleteAppointmentsThisMonth > 0
          ? `${Math.round(
              (statistics.totalCompleteAppointmentsThisMonth /
                (statistics.totalCompleteAppointmentsThisMonth +
                  statistics.totalPendingAppointmentsThisMonth)) *
                100
            )}%`
          : "0%",
      icon: <CheckCircle className="h-5 w-5 text-indigo-500" />,
      change: `from last month`,
      trend: calculateTrend(
        statistics.totalCompleteAppointmentsThisMonth,
        statistics.totalCompleteAppointmentsLastMonth
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4 border-2 border-blue-100">
            <AvatarImage
              src={myProfile?.avatar || "/placeholder.svg?height=64&width=64"}
              alt={myProfile?.fullName || "Specialist"}
            />
            <AvatarFallback>
              {myProfile?.fullName?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {myProfile?.fullName || "Specialist"}
            </h1>
            <p className="text-gray-500">
              {expertDetail?.specialization || "Fitness Specialist"}
            </p>
          </div>
        </div>
        <Link to="/availability/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Availability
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : stat.trend === "down" ? (
                  <ArrowUpRight className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                ) : (
                  <span className="w-4 h-4 inline-block mr-1"></span>
                )}
                <span
                  className={`${
                    stat.trend === "up"
                      ? "text-green-500"
                      : stat.trend === "down"
                      ? "text-red-500"
                      : "text-gray-500"
                  } font-medium`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-800">
                    Manage Schedule
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Set your availability and working hours
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full"
                onClick={() => navigate("/availability")}
              >
                Manage Availability
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-800">
                    Appointments
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    View and manage all your appointments
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <Button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => navigate("/appointment")}
              >
                View Appointments
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-purple-800">
                    Appointment History
                  </h3>
                  <p className="text-sm text-purple-600 mt-1">
                    View completed appointments and ratings
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-700" />
                </div>
              </div>
              <Button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white w-full"
                onClick={() => navigate("/history")}
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Today's Appointments</CardTitle>
              <Link to="/appointment">
                <Button variant="ghost" className="text-sm text-blue-600">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>
              Your schedule for {format(new Date(), "EEEE, MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading appointments...</p>
              </div>
            ) : todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
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
                      <Link to={`/appointment/detail/${slot.appointment.id}`}>
                        <Button variant="ghost" size="sm" className="ml-2">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No appointments scheduled for today
                </p>
                <Link to="/availability/add">
                  <Button>Add Availability</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
