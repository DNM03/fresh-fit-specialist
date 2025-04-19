import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileImage,
  FileText,
  FlaskRoundIcon as Flask,
  MoreHorizontal,
  Pill,
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

interface TimelineItem {
  id: string;
  patientId: string;
  itemType: "appointment" | "record";
  displayDate: Date;
  provider: string;
  notes: string;
  status?: string;
  type?: string;
  title?: string;
  attachments?: number;
}

interface MedicalRecordTimelineProps {
  timelineItems: TimelineItem[];
  patients: Patient[];
  selectedPatient: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterRecordType: string;
  setFilterRecordType: (type: string) => void;
}

export function MedicalRecordTimeline({
  timelineItems,
  patients,
  selectedPatient,
  searchQuery,
  setSearchQuery,
  filterRecordType,
  setFilterRecordType,
}: MedicalRecordTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
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

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "visit":
        return <ClipboardList className="h-5 w-5 text-blue-600" />;
      case "lab":
        return <Flask className="h-5 w-5 text-purple-600" />;
      case "prescription":
        return <Pill className="h-5 w-5 text-green-600" />;
      case "imaging":
        return <FileImage className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

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

  // Filter timeline items
  const filteredTimelineItems = timelineItems.filter((item) => {
    const matchesSearch =
      (item.notes &&
        item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.provider &&
        item.provider.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.type &&
        item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.title &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      filterRecordType === "all" ||
      (item.itemType === "record" && item.type === filterRecordType) ||
      item.itemType === "appointment";

    const matchesPatient =
      !selectedPatient || item.patientId === selectedPatient;

    return matchesSearch && matchesType && matchesPatient;
  });

  return (
    <div className="space-y-4">
      {filteredTimelineItems.length > 0 ? (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-8">
            {filteredTimelineItems.map((item) => {
              const patient = patients.find((p) => p.id === item.patientId);

              return (
                <div
                  key={`${item.itemType}-${item.id}`}
                  className="relative pl-10"
                >
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {item.itemType === "appointment" ? (
                      <Calendar className="h-4 w-4 text-blue-600" />
                    ) : (
                      getRecordTypeIcon(item.type!)
                    )}
                  </div>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div>
                              <h3 className="font-medium">
                                {item.itemType === "appointment"
                                  ? `${item.type} Appointment`
                                  : item.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(item.displayDate, "MMM d, yyyy")}
                                <span className="mx-2">•</span>
                                {item.provider}
                              </div>
                              {!selectedPatient && patient && (
                                <div className="flex items-center mt-1">
                                  <Avatar className="h-4 w-4 mr-1">
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
                                  <span className="text-xs text-gray-500">
                                    {patient.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge
                            className={
                              item.itemType === "appointment"
                                ? getStatusColor(item.status!)
                                : getRecordTypeColor(item.type!)
                            }
                            variant="outline"
                          >
                            {item.itemType === "appointment"
                              ? item.status!.charAt(0).toUpperCase() +
                                item.status!.slice(1)
                              : getRecordTypeLabel(item.type!)}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {item.notes}
                        </p>
                        {item.itemType === "record" &&
                          item.attachments! > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              {item.attachments} attachment
                              {item.attachments !== 1 ? "s" : ""}
                            </div>
                          )}
                      </div>
                      <div className="border-t p-2 flex justify-end bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {item.itemType === "record" &&
                          item.attachments! > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        {item.itemType === "appointment" &&
                          item.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Follow-up
                            </Button>
                          )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {item.itemType === "record" ? (
                              <>
                                <DropdownMenuItem>Edit Record</DropdownMenuItem>
                                <DropdownMenuItem>
                                  Print Record
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Share Record
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem>
                                  View Appointment
                                </DropdownMenuItem>
                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                <DropdownMenuItem>Add Notes</DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              {item.itemType === "record"
                                ? "Delete Record"
                                : "Cancel Appointment"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No records or appointments found</p>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => {
              setSearchQuery("");
              setFilterRecordType("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
