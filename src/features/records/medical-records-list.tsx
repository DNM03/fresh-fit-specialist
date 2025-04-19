import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

interface MedicalRecord {
  id: string;
  patientId: string;
  type: string;
  title: string;
  date: Date;
  provider: string;
  notes: string;
  attachments: number;
  appointmentId: string | null;
}

interface MedicalRecordsListProps {
  records: MedicalRecord[];
  patients: Patient[];
  selectedPatient: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterRecordType: string;
  setFilterRecordType: (type: string) => void;
}

export function MedicalRecordsList({
  records,
  patients,
  selectedPatient,
  searchQuery,
  setSearchQuery,
  filterRecordType,
  setFilterRecordType,
}: MedicalRecordsListProps) {
  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "visit":
        return "bg-blue-100 text-blue-800";
      case "lab":
        return "bg-purple-100 text-purple-800";
      case "prescription":
        return "bg-green-100 text-green-800";
      case "imaging":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case "visit":
        return "Visit Note";
      case "lab":
        return "Lab Result";
      case "prescription":
        return "Prescription";
      case "imaging":
        return "Imaging";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Filter records based on search, type, and patient
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterRecordType === "all" || record.type === filterRecordType;

    const matchesPatient =
      !selectedPatient || record.patientId === selectedPatient;

    return matchesSearch && matchesType && matchesPatient;
  });

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            {!selectedPatient && <TableHead>Patient</TableHead>}
            <TableHead>Date</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Attachments</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => {
              const patient = patients.find((p) => p.id === record.patientId);

              return (
                <TableRow key={record.id}>
                  <TableCell>
                    <Badge
                      className={getRecordTypeColor(record.type)}
                      variant="outline"
                    >
                      {getRecordTypeLabel(record.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{record.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {record.notes}
                    </div>
                  </TableCell>
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
                  <TableCell>{format(record.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{record.provider}</TableCell>
                  <TableCell>
                    {record.attachments > 0 ? (
                      <Badge variant="outline" className="bg-gray-100">
                        {record.attachments}
                      </Badge>
                    ) : (
                      "None"
                    )}
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
                        <DropdownMenuItem>View Record</DropdownMenuItem>
                        {record.attachments > 0 && (
                          <DropdownMenuItem>
                            Download Attachments
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Edit Record</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete Record
                        </DropdownMenuItem>
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
                <p className="text-gray-500">No medical records found</p>
                <Button
                  variant="outline"
                  className="mt-4 mr-2"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterRecordType("all");
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
