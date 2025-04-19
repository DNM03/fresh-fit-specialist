import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  FileText,
  History,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import { format } from "date-fns";

interface Patient {
  id: string;
  name: string;
  patientId: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  lastVisit: Date;
  upcomingAppointment: Date | null;
  conditions: string[];
  avatar: string;
}

interface PatientDetailCardProps {
  patient: Patient;
}

export function PatientDetailCard({ patient }: PatientDetailCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mb-6 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex items-start">
            <Avatar className="h-16 w-16 mr-4">
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
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-gray-500">
                ID: {patient.patientId} | {patient.age} years, {patient.gender}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.conditions.map((condition, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-800"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Contact Information</p>
              <div className="mt-1 space-y-1">
                <div className="flex items-center text-sm">
                  <Phone className="h-3 w-3 mr-2 text-gray-400" />
                  {patient.phone}
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-3 w-3 mr-2 text-gray-400" />
                  {patient.email}
                </div>
                <div className="flex items-start text-sm">
                  <User className="h-3 w-3 mr-2 mt-1 text-gray-400" />
                  {patient.address}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Appointment Information</p>
              <div className="mt-1 space-y-1">
                <div className="flex items-center text-sm">
                  <History className="h-3 w-3 mr-2 text-gray-400" />
                  Last Visit:{" "}
                  {patient.lastVisit
                    ? format(patient.lastVisit, "MMM d, yyyy")
                    : "N/A"}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                  Next Appointment:{" "}
                  {patient.upcomingAppointment
                    ? format(patient.upcomingAppointment, "MMM d, yyyy")
                    : "None Scheduled"}
                </div>
                <div className="flex items-center text-sm">
                  <Badge
                    className={getStatusColor(patient.status)}
                    variant="outline"
                  >
                    {patient.status.charAt(0).toUpperCase() +
                      patient.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
