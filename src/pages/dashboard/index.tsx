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
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Plus,
  FileText,
  CalendarIcon,
  Bell,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Today's Appointments",
      value: 8,
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      change: "+2 from yesterday",
      trend: "up",
    },
    {
      title: "Pending Appointments",
      value: 12,
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      change: "-3 from last week",
      trend: "down",
    },
    {
      title: "Total Patients",
      value: 248,
      icon: <Users className="h-5 w-5 text-green-500" />,
      change: "+18 this month",
      trend: "up",
    },
    {
      title: "Completion Rate",
      value: "94%",
      icon: <CheckCircle className="h-5 w-5 text-indigo-500" />,
      change: "+2% from last month",
      trend: "up",
    },
  ];

  const upcomingAppointments = [
    {
      id: "apt-001",
      patientName: "Sarah Johnson",
      patientId: "P-1234",
      time: new Date(2025, 3, 14, 9, 30),
      status: "confirmed",
      type: "Follow-up",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "apt-002",
      patientName: "Michael Chen",
      patientId: "P-2345",
      time: new Date(2025, 3, 14, 10, 45),
      status: "confirmed",
      type: "Consultation",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "apt-003",
      patientName: "Emily Rodriguez",
      patientId: "P-3456",
      time: new Date(2025, 3, 14, 13, 15),
      status: "pending",
      type: "New Patient",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "apt-004",
      patientName: "David Wilson",
      patientId: "P-4567",
      time: new Date(2025, 3, 14, 14, 30),
      status: "confirmed",
      type: "Check-up",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "apt-005",
      patientName: "Jessica Brown",
      patientId: "P-5678",
      time: new Date(2025, 3, 14, 16, 0),
      status: "rescheduled",
      type: "Follow-up",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  const recentPatients = [
    {
      id: "pat-001",
      name: "Robert Smith",
      lastVisit: new Date(2025, 3, 13),
      condition: "Hypertension",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "pat-002",
      name: "Lisa Thompson",
      lastVisit: new Date(2025, 3, 12),
      condition: "Diabetes Type 2",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "pat-003",
      name: "James Anderson",
      lastVisit: new Date(2025, 3, 10),
      condition: "Asthma",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  const notifications = [
    {
      id: "notif-001",
      title: "New appointment request",
      description: "Thomas Lee requested an appointment for April 16",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "notif-002",
      title: "Lab results available",
      description: "Sarah Johnson's lab results are ready for review",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "notif-003",
      title: "Schedule change",
      description: "Your April 15 afternoon schedule has been updated",
      time: "3 hours ago",
      read: true,
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

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4 border-2 border-blue-100">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt="Dr. Alex Morgan"
            />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Dr. John Doe</h1>
            <p className="text-gray-500">Heart | Medical Center Hospital</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            <span className="relative flex items-center flex-row gap-x-2">
              Notifications
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className=" bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </span>
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Schedule
          </Button>
        </div>
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
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                )}
                <span
                  className={`${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  } font-medium`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        defaultValue="overview"
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full">
                  View Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-green-800">
                      Patient Records
                    </h3>
                    <p className="text-sm text-green-600 mt-1">
                      Access and update medical records
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-700" />
                  </div>
                </div>
                <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full">
                  View Records
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-purple-800">
                      Analytics
                    </h3>
                    <p className="text-sm text-purple-600 mt-1">
                      View insights and performance metrics
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white w-full">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Today's Appointments</CardTitle>
                <Link to="/appointments">
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
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
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
                        <p className="font-medium">{appointment.patientName}</p>
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
                      <Button variant="ghost" size="sm" className="ml-2">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {upcomingAppointments.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" className="w-full">
                    Show More ({upcomingAppointments.length - 3} remaining)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Patients</CardTitle>
                  <Link to="/patients">
                    <Button variant="ghost" className="text-sm text-blue-600">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage
                            src={patient.avatar || "/placeholder.svg"}
                            alt={patient.name}
                          />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-500">
                            {patient.condition}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last visit: {format(patient.lastVisit, "MMM d, yyyy")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Notifications</CardTitle>
                  <Button variant="ghost" className="text-sm text-blue-600">
                    Mark All as Read
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.read
                          ? "bg-gray-50"
                          : "bg-blue-50 border-l-4 border-blue-500"
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>
                Manage your upcoming and past appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
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
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">
                          Patient ID: {appointment.patientId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <p className="font-medium">
                          {format(appointment.time, "EEEE, MMMM d")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(appointment.time, "h:mm a")}
                        </p>
                      </div>
                      <Badge
                        className={getStatusColor(appointment.status)}
                        variant="outline"
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </Badge>
                      <div className="flex ml-4">
                        <Button variant="outline" size="sm" className="mr-2">
                          Reschedule
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                View and manage your patient records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be expanded with more patient data in a real application */}
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={patient.avatar || "/placeholder.svg"}
                          alt={patient.name}
                        />
                        <AvatarFallback>
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-500">
                          Condition: {patient.condition}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <p className="text-sm text-gray-500">
                          Last visit: {format(patient.lastVisit, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex">
                        <Button variant="outline" size="sm" className="mr-2">
                          Medical Records
                        </Button>
                        <Button size="sm">Schedule Appointment</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
