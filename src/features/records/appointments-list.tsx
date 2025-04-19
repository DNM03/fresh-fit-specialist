import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
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

interface Appointment {
  id: string;
  patientId: string;
  date: Date;
  type: string;
  status: string;
  notes: string;
  provider: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  patients: Patient[];
  selectedPatient: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function AppointmentsList({
  appointments,
  patients,
  selectedPatient,
  searchQuery,
  setSearchQuery,
}: AppointmentsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter appointments based on search and patient
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPatient =
      !selectedPatient || appointment.patientId === selectedPatient;

    return matchesSearch && matchesPatient;
  });

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            {!selectedPatient && <TableHead>Patient</TableHead>}
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => {
              const patient = patients.find(
                (p) => p.id === appointment.patientId
              );

              return (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {format(appointment.date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  {!selectedPatient && (
                    <TableCell>
                      {patient && (
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
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
                          <span>{patient.name}</span>
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell>{appointment.provider}</TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(appointment.status)}
                      variant="outline"
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {appointment.notes}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {appointment.status === "scheduled" && (
                          <>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Cancel
                            </DropdownMenuItem>
                          </>
                        )}
                        {appointment.status === "completed" && (
                          <>
                            <DropdownMenuItem>View Records</DropdownMenuItem>
                            <DropdownMenuItem>
                              Schedule Follow-up
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={selectedPatient ? 6 : 7}
                className="h-24 text-center"
              >
                <p className="text-gray-500">No appointments found</p>
                <Button
                  variant="outline"
                  className="mt-4 mr-2"
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
