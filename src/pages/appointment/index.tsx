import { useState } from "react";
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
import { Calendar, Clock, Search } from "lucide-react";
import { format } from "date-fns";

export default function Appointment() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const appointments = [
    {
      id: "apt-001",
      patientName: "Sarah Johnson",
      patientId: "P-1234",
      time: new Date(2025, 3, 14, 9, 30),
      status: "confirmed",
      type: "Follow-up",
      avatar: "/placeholder.svg?height=32&width=32",
      notes: "Review blood pressure medication",
    },
    {
      id: "apt-002",
      patientName: "Michael Chen",
      patientId: "P-2345",
      time: new Date(2025, 3, 14, 10, 45),
      status: "confirmed",
      type: "Consultation",
      avatar: "/placeholder.svg?height=32&width=32",
      notes: "Initial consultation for chest pain",
    },
    {
      id: "apt-003",
      patientName: "Emily Rodriguez",
      patientId: "P-3456",
      time: new Date(2025, 3, 14, 13, 15),
      status: "pending",
      type: "New Patient",
      avatar: "/placeholder.svg?height=32&width=32",
      notes: "New patient intake",
    },
    {
      id: "apt-004",
      patientName: "David Wilson",
      patientId: "P-4567",
      time: new Date(2025, 3, 14, 14, 30),
      status: "confirmed",
      type: "Check-up",
      avatar: "/placeholder.svg?height=32&width=32",
      notes: "Annual check-up",
    },
    {
      id: "apt-005",
      patientName: "Jessica Brown",
      patientId: "P-5678",
      time: new Date(2025, 3, 14, 16, 0),
      status: "rescheduled",
      type: "Follow-up",
      avatar: "/placeholder.svg?height=32&width=32",
      notes: "Follow-up after procedure",
    },
    {
      id: "apt-006",
      patientName: "Robert Taylor",
      patientId: "P-6789",
      time: new Date(2025, 3, 15, 9, 0),
      status: "confirmed",
      type: "Consultation",
      avatar: "/placeholder.svg?height=32&width=32",
      notes: "Discuss test results",
    },
    {
      id: "apt-007",
      patientName: "Amanda Martinez",
      patientId: "P-7890",
      time: new Date(2025, 3, 15, 11, 30),
      status: "cancelled",
      type: "Follow-up",
      avatar: "/placeholder.svg?height=32&width=32",
      notes: "Patient cancelled due to illness",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const matchesDate = date
      ? appointment.time.getDate() === date.getDate() &&
        appointment.time.getMonth() === date.getMonth() &&
        appointment.time.getFullYear() === date.getFullYear()
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const hasAppointments = (date: Date) =>
    appointments.some((appointment) => {
      return (
        appointment.time.getDate() === date.getDate() &&
        appointment.time.getMonth() === date.getMonth() &&
        appointment.time.getFullYear() === date.getFullYear()
      );
    });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        {/* <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </Button> */}
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
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasAppointments: (date) => hasAppointments(date),
                }}
                modifiersClassNames={{
                  hasAppointments: "bg-blue-100 text-sky-700",
                  selected: "!bg-primary !text-white",
                }}
              />

              <div className="mt-4">
                <h3 className="font-medium mb-2">Quick Filters</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setDate(new Date())}
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
                      setDate(tomorrow);
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
                      setDate(nextWeek);
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
                    {date
                      ? format(date, "EEEE, MMMM d, yyyy")
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
                    filteredAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={appointment.avatar || "/placeholder.svg"}
                              alt={appointment.patientName}
                            />
                            <AvatarFallback>
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {appointment.patientName}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(appointment.time, "h:mm a")}
                              <span className="mx-2">•</span>
                              <span>{appointment.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            className={getStatusColor(appointment.status)}
                            variant="outline"
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </Badge>
                          <div className="flex ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                            >
                              Reschedule
                            </Button>
                            <Button size="sm">Start Session</Button>
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
                          setDate(new Date());
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
                    {filteredAppointments.length > 0 ? (
                      <>
                        <div className="relative">
                          <div className="absolute left-4 top-1 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-8">
                            {filteredAppointments.map((appointment) => (
                              <div
                                key={appointment.id}
                                className="relative pl-10"
                              >
                                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="p-4 border rounded-lg hover:bg-gray-50">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-blue-600">
                                        {format(appointment.time, "h:mm a")}
                                      </p>
                                      <p className="font-medium mt-1">
                                        {appointment.patientName}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Patient ID: {appointment.patientId}
                                      </p>
                                      <p className="text-sm text-gray-500 mt-2">
                                        {appointment.notes}
                                      </p>
                                    </div>
                                    <Badge
                                      className={getStatusColor(
                                        appointment.status
                                      )}
                                      variant="outline"
                                    >
                                      {appointment.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        appointment.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex mt-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mr-2"
                                    >
                                      View Details
                                    </Button>
                                    <Button size="sm">Start Session</Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-10 border rounded-lg">
                        <p className="text-gray-500">
                          No appointments found for the selected criteria
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setDate(new Date());
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
