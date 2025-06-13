import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, differenceInMinutes, isPast } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Phone,
  Video,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import { toast } from "sonner";
import specialistService from "@/services/specialist.service";
import zegoService from "@/services/zego.service";
import { userService } from "@/services";

interface AppointmentDetail {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    date_of_birth: string;
    gender: string;
    username: string;
    avatar: string;
    activityLevel: string;
  };
  expert: {
    id: string;
    userId: string;
    fullName: string;
    specialization: string;
    experience_years: number;
    bio: string;
    rating: number;
    total_reviews: number;
    languages: string[];
    consultation_fee: string;
    user: {
      _id: string;
      fullName: string;
      email: string;
      avatar: string;
    };
  };
  meetingLink: string | null;
  paymentStatus: string;
  issues: string;
  notes: string;
  fees: number;
  cancellationReason: string | null;
  canceler: string | null;
  expertReview: any | null;
  appointmentReview: any | null;
}
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
export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [confirmEndSession, setConfirmEndSession] = useState(false);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await specialistService.getAppointmentById(id);
        setAppointment(response.data.data.appointment.appointment);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setError("Failed to load appointment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    const fetchMyProfile = async () => {
      try {
        const response = await userService.getCurrentUser();
        setMyProfile(response.data.result);
      } catch (error) {
        console.error("Error fetching my profile:", error);
        toast.error("Failed to load your profile. Please try again.", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
      }
    };

    fetchAppointmentDetails();
    fetchMyProfile();
  }, [id]);

  const handleStartSession = async () => {
    try {
      // Assuming you have an API to start the session
      //   const response = await specialistService.startAppointmentSession(id!);
      //   if (response.data.meetingLink) {
      //     window.open(response.data.meetingLink, "_blank");
      //   } else {
      //     toast.error("Failed to generate meeting link");
      //   }
      const response = await zegoService.createZegoToken();
      if (response.data.token) {
        navigate(`/appointments/meeting/${id}`, {
          state: {
            zgtoken: response.data.token,
            userId: myProfile?._id,
            name: myProfile?.fullName,
          },
        });
      }
    } catch (error) {
      console.error("Error starting session:", error);
      toast.error("Failed to start session", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    }
  };

  const handleEndSession = async () => {
    try {
      setIsSubmitting(true);
      await specialistService.updateAppointmentStatus(id!, "COMPLETED");
      toast.success("Session completed successfully", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
      // Refresh appointment data
      const response = await specialistService.getAppointmentById(id!);
      setAppointment(response.data.data.appointment.appointment);
      setConfirmEndSession(false);
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to end session", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await specialistService.cancelAppointment(id!, {
        cancellationReason: cancelReason,
      });

      toast.success("Appointment cancelled successfully", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });

      const response = await specialistService.getAppointmentById(id!);
      setAppointment(response.data.data.appointment.appointment);

      setConfirmCancel(false);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "CALL":
        return <Phone className="h-5 w-5" />;
      case "VIDEO":
        return <Video className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // const getFormattedGender = (gender: number) => {
  //   switch (gender) {
  //     case 0:
  //       return "Female";
  //     case 1:
  //       return "Male";
  //     case 2:
  //       return "Other";
  //     default:
  //       return "Not specified";
  //   }
  // };

  const calculateDuration = (startTime: string, endTime: string) => {
    return differenceInMinutes(parseISO(endTime), parseISO(startTime));
  };

  // Add a function to check if appointment is in the past
  const isAppointmentPast = (appointment: AppointmentDetail) => {
    const appointmentDate = parseISO(appointment.date);
    return isPast(appointmentDate) && !isToday(appointmentDate);
  };

  // Helper function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="animate-pulse">Loading appointment details...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-red-600">Error</CardTitle>
              <Button variant="ghost" onClick={() => navigate("/appointments")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Appointments
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p>{error || "Appointment not found"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/appointments")}>
              Return to Appointments
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/appointments")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Appointment Details</CardTitle>
              <CardDescription>
                {format(parseISO(appointment.date), "EEEE, MMMM d, yyyy")}
              </CardDescription>
            </div>
            <Badge
              className={`${getStatusColor(
                appointment.status
              )} px-3 py-1 text-sm`}
            >
              {appointment.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Appointment Time & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-600 text-sm">Time</h3>
                <p className="font-semibold text-lg">
                  {formatDateTime(appointment.startTime, "h:mm a")} -{" "}
                  {formatDateTime(appointment.endTime, "h:mm a")}
                </p>
                <p className="text-sm text-gray-500">
                  {calculateDuration(
                    appointment.startTime,
                    appointment.endTime
                  )}{" "}
                  minutes
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                {getTypeIcon(appointment.type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-600 text-sm">Type</h3>
                <p className="font-semibold text-lg">
                  {appointment.type} Consultation
                </p>
                {appointment.meetingLink && (
                  <a
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Patient Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
            <div className="flex items-start">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage
                  src={appointment.user.avatar || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {appointment.user.fullName?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 flex-1">
                <div>
                  <h3 className="text-sm text-gray-500">Name</h3>
                  <p className="font-medium">{appointment.user.fullName}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-500">Email</h3>
                  <p className="font-medium">{appointment.user.email}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-500">Gender</h3>
                  <p className="font-medium">{appointment.user.gender}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-500">Birth Date</h3>
                  <p className="font-medium">
                    {format(
                      parseISO(appointment.user.date_of_birth),
                      "MMM d, yyyy"
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-500">Activity Level</h3>
                  <p className="font-medium capitalize">
                    {appointment.user.activityLevel || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Consultation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <h3 className="text-sm text-gray-500">Issues</h3>
                <p className="font-medium">
                  {appointment.issues || "No issues specified"}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Notes</h3>
                <p className="font-medium">
                  {appointment.notes || "No notes provided"}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Fee</h3>
                <p className="font-medium">${appointment.fees}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Payment Status</h3>
                <Badge
                  className={
                    appointment.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {appointment.paymentStatus}
                </Badge>
              </div>

              {appointment.cancellationReason && (
                <div className="col-span-2">
                  <h3 className="text-sm text-gray-500">Cancellation Reason</h3>
                  <p className="font-medium">
                    {appointment.cancellationReason}
                  </p>
                  {appointment.canceler && (
                    <p className="text-sm text-gray-500 mt-1">
                      Cancelled by: {appointment.canceler}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section - if appointment is completed */}
          {appointment.status === "COMPLETED" && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Feedback & Reviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Specialist Review */}
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      User reivew for Expert
                    </h3>
                    {appointment?.expertReview ? (
                      <>
                        <div className="flex items-center mb-2">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (appointment?.expertReview?.rating || 0)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium">
                            {appointment?.expertReview?.rating}/5
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {appointment?.expertReview?.content ||
                            "No comments provided"}
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-24 text-gray-400">
                        <p>No feedback provided yet</p>
                      </div>
                    )}
                  </div>

                  {/* Patient Review */}
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      User review for Appointment
                    </h3>
                    {appointment?.appointmentReview ? (
                      <>
                        <div className="flex items-center mb-2">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i <
                                  (appointment?.appointmentReview?.rating || 0)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium">
                            {appointment?.appointmentReview?.rating}/5
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {appointment?.appointmentReview?.comment ||
                            "No comments provided"}
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-24 text-gray-400">
                        <p>Patient has not left a review yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {/* Only show buttons if appointment is not in the past */}
          {!isAppointmentPast(appointment) && (
            <>
              {(appointment.status === "PENDING" ||
                appointment.status === "CONFIRMED") && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmCancel(true)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Appointment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmEndSession(true)}
                    className="text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                  >
                    <CircleCheckBig className="h-4 w-4 mr-2" />
                    End Session
                  </Button>
                  <Button onClick={handleStartSession}>
                    {appointment.type === "VIDEO" ? (
                      <Video className="h-4 w-4 mr-2" />
                    ) : (
                      <Phone className="h-4 w-4 mr-2" />
                    )}
                    Start Session
                  </Button>
                </>
              )}

              {appointment.status === "CONFIRMED" &&
                appointment.meetingLink && (
                  <Button onClick={handleEndSession}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    End Session
                  </Button>
                )}
            </>
          )}
          {/* Display a message when appointment is in the past */}
          {isAppointmentPast(appointment) && (
            <p className="text-gray-500 italic">
              This appointment has expired and no actions are available.
            </p>
          )}
        </CardFooter>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone. The patient will be notified of the
              cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <label
              htmlFor="cancel-reason"
              className="block text-sm font-medium mb-1"
            >
              Cancellation Reason <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Please provide a reason for cancellation. This will be visible to
              the patient.
            </p>
            <textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border rounded-md p-2 h-24 text-sm"
              placeholder="Example: Due to an emergency, I need to reschedule this appointment."
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelReason("")}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelAppointment}
              disabled={!cancelReason.trim() || isSubmitting}
            >
              {isSubmitting ? "Cancelling..." : "Cancel Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Session Confirmation Dialog */}
      <AlertDialog open={confirmEndSession} onOpenChange={setConfirmEndSession}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Appointment Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this session? This will mark the
              appointment as completed. The patient will be notified that the
              session has ended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={handleEndSession}
            >
              End Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
