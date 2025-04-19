import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Search, User, Phone } from "lucide-react";
import { format } from "date-fns";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PatientSelector } from "@/features/records/patient-selector";
import { PatientDetailCard } from "@/features/records/patient-detail-card";
import { RecordTypeFilter } from "@/features/records/record-type-filter";
import { MedicalRecordTimeline } from "@/features/records/medical-record-timeline";
import { AppointmentsList } from "@/features/records/appointments-list";
import { MedicalRecordsList } from "@/features/records/medical-records-list";

export default function RecordsPage() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const patientIdParam = searchParams[0].get("patientId");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRecordType, setFilterRecordType] = useState<string>("all");
  const [viewType, setViewType] = useState<string>("timeline");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(
    patientIdParam
  );

  const patients = [
    {
      id: "pat-001",
      name: "Sarah Johnson",
      patientId: "P-1234",
      age: 42,
      gender: "Female",
      phone: "(555) 123-4567",
      email: "sarah.johnson@example.com",
      address: "123 Main St, Anytown, CA 94321",
      status: "active",
      lastVisit: new Date(2025, 3, 10),
      upcomingAppointment: new Date(2025, 4, 15),
      conditions: ["Hypertension", "Type 2 Diabetes"],
      avatar: "/placeholder.svg?height=128&width=128",
    },
    {
      id: "pat-002",
      name: "Michael Chen",
      patientId: "P-2345",
      age: 35,
      gender: "Male",
      phone: "(555) 234-5678",
      email: "michael.chen@example.com",
      address: "456 Oak Ave, Somewhere, NY 10001",
      status: "active",
      lastVisit: new Date(2025, 3, 5),
      upcomingAppointment: new Date(2025, 3, 20),
      conditions: ["Asthma"],
      avatar: "/placeholder.svg?height=128&width=128",
    },
    {
      id: "pat-003",
      name: "Emily Rodriguez",
      patientId: "P-3456",
      age: 28,
      gender: "Female",
      phone: "(555) 345-6789",
      email: "emily.rodriguez@example.com",
      address: "789 Pine St, Elsewhere, TX 75001",
      status: "inactive",
      lastVisit: new Date(2024, 11, 15),
      upcomingAppointment: null,
      conditions: ["Migraine", "Anxiety"],
      avatar: "/placeholder.svg?height=128&width=128",
    },
    {
      id: "pat-004",
      name: "David Wilson",
      patientId: "P-4567",
      age: 52,
      gender: "Male",
      phone: "(555) 456-7890",
      email: "david.wilson@example.com",
      address: "101 Maple Dr, Nowhere, FL 33101",
      status: "active",
      lastVisit: new Date(2025, 2, 20),
      upcomingAppointment: new Date(2025, 3, 25),
      conditions: ["Coronary Artery Disease", "Hyperlipidemia"],
      avatar: "/placeholder.svg?height=128&width=128",
    },
  ];

  const appointments = [
    {
      id: "apt-001",
      patientId: "pat-001",
      date: new Date(2025, 3, 10),
      type: "Follow-up",
      status: "completed",
      notes:
        "Patient's blood pressure is now under control. Continue current medication.",
      provider: "Dr. Alex Morgan",
    },
    {
      id: "apt-002",
      patientId: "pat-001",
      date: new Date(2025, 2, 15),
      type: "Check-up",
      status: "completed",
      notes: "Annual physical examination. All vitals normal.",
      provider: "Dr. Alex Morgan",
    },
    {
      id: "apt-003",
      patientId: "pat-002",
      date: new Date(2025, 3, 5),
      type: "Follow-up",
      status: "completed",
      notes: "Asthma symptoms well-controlled with current inhaler.",
      provider: "Dr. Alex Morgan",
    },
    {
      id: "apt-004",
      patientId: "pat-003",
      date: new Date(2024, 11, 15),
      type: "Consultation",
      status: "completed",
      notes: "Discussed migraine triggers and prevention strategies.",
      provider: "Dr. Alex Morgan",
    },
    {
      id: "apt-005",
      patientId: "pat-004",
      date: new Date(2025, 2, 20),
      type: "Cardiology",
      status: "completed",
      notes: "Reviewed recent lab work. Adjusted medication dosage.",
      provider: "Dr. Alex Morgan",
    },
    {
      id: "apt-006",
      patientId: "pat-001",
      date: new Date(2025, 4, 15),
      type: "Follow-up",
      status: "scheduled",
      notes: "3-month follow-up for hypertension management.",
      provider: "Dr. Alex Morgan",
    },
    {
      id: "apt-007",
      patientId: "pat-002",
      date: new Date(2025, 3, 20),
      type: "Pulmonology",
      status: "scheduled",
      notes: "Annual asthma review.",
      provider: "Dr. Alex Morgan",
    },
    {
      id: "apt-008",
      patientId: "pat-004",
      date: new Date(2025, 3, 25),
      type: "Cardiology",
      status: "scheduled",
      notes: "Follow-up on medication adjustment.",
      provider: "Dr. Alex Morgan",
    },
  ];

  const medicalRecords = [
    {
      id: "rec-001",
      patientId: "pat-001",
      type: "visit",
      title: "Annual Check-up",
      date: new Date(2025, 3, 10),
      provider: "Dr. Alex Morgan",
      notes:
        "Patient is in good health. Blood pressure is normal. Recommended regular exercise.",
      attachments: 0,
      appointmentId: "apt-001",
    },
    {
      id: "rec-002",
      patientId: "pat-001",
      type: "lab",
      title: "Blood Work Results",
      date: new Date(2025, 3, 8),
      provider: "Central Lab",
      notes:
        "All results within normal range. Cholesterol slightly elevated but not concerning.",
      attachments: 2,
      appointmentId: null,
    },
    {
      id: "rec-003",
      patientId: "pat-001",
      type: "prescription",
      title: "Lisinopril Prescription",
      date: new Date(2025, 3, 10),
      provider: "Dr. Alex Morgan",
      notes: "10mg daily for hypertension. 30-day supply with 3 refills.",
      attachments: 1,
      appointmentId: "apt-001",
    },
    {
      id: "rec-004",
      patientId: "pat-002",
      type: "visit",
      title: "Follow-up Appointment",
      date: new Date(2025, 3, 5),
      provider: "Dr. Alex Morgan",
      notes: "Asthma is well-controlled. No changes to current treatment plan.",
      attachments: 0,
      appointmentId: "apt-003",
    },
    {
      id: "rec-005",
      patientId: "pat-002",
      type: "imaging",
      title: "Chest X-ray",
      date: new Date(2025, 3, 3),
      provider: "Radiology Dept",
      notes: "No abnormalities detected. Lungs clear.",
      attachments: 3,
      appointmentId: null,
    },
    {
      id: "rec-006",
      patientId: "pat-003",
      type: "visit",
      title: "Migraine Consultation",
      date: new Date(2024, 11, 15),
      provider: "Dr. Alex Morgan",
      notes:
        "Patient reports increased frequency of migraines. Discussed triggers and prevention strategies.",
      attachments: 0,
      appointmentId: "apt-004",
    },
    {
      id: "rec-007",
      patientId: "pat-003",
      type: "prescription",
      title: "Sumatriptan Prescription",
      date: new Date(2024, 11, 15),
      provider: "Dr. Alex Morgan",
      notes: "50mg as needed for migraine. 9 tablets with 2 refills.",
      attachments: 1,
      appointmentId: "apt-004",
    },
    {
      id: "rec-008",
      patientId: "pat-004",
      type: "visit",
      title: "Cardiology Follow-up",
      date: new Date(2025, 2, 20),
      provider: "Dr. Alex Morgan",
      notes:
        "Reviewed recent lab work. Adjusted medication dosage. Recommended dietary changes.",
      attachments: 0,
      appointmentId: "apt-005",
    },
    {
      id: "rec-009",
      patientId: "pat-004",
      type: "lab",
      title: "Lipid Panel",
      date: new Date(2025, 2, 18),
      provider: "Central Lab",
      notes: "LDL: 130 mg/dL (High), HDL: 45 mg/dL, Triglycerides: 150 mg/dL",
      attachments: 1,
      appointmentId: null,
    },
    {
      id: "rec-010",
      patientId: "pat-004",
      type: "prescription",
      title: "Atorvastatin Prescription",
      date: new Date(2025, 2, 20),
      provider: "Dr. Alex Morgan",
      notes: "20mg daily for hyperlipidemia. 30-day supply with 5 refills.",
      attachments: 1,
      appointmentId: "apt-005",
    },
  ];

  const timelineItems = [
    ...appointments.map((apt) => ({
      ...apt,
      itemType: "appointment" as const,
      displayDate: apt.date,
    })),
    ...medicalRecords.map((rec) => ({
      ...rec,
      itemType: "record" as const,
      displayDate: rec.date,
    })),
  ].sort((a, b) => b.displayDate.getTime() - a.displayDate.getTime());

  // Filter patients based on search and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || patient.status === filterStatus;

    return (
      matchesSearch &&
      matchesStatus &&
      (!selectedPatient || patient.id === selectedPatient)
    );
  });

  const selectedPatientData = selectedPatient
    ? patients.find((patient) => patient.id === selectedPatient)
    : null;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Records</h1>
        <div className="flex space-x-2">
          <Link to="/appointments/new">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </Link>
          <Link to="/records/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </Link>
        </div>
      </div>

      <PatientSelector
        patients={patients}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
      />

      {selectedPatientData && (
        <PatientDetailCard patient={selectedPatientData} />
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                {selectedPatientData
                  ? `Complete medical history for ${selectedPatientData.name}`
                  : "All patient records and appointments"}
              </CardDescription>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <RecordTypeFilter
                filterRecordType={filterRecordType}
                setFilterRecordType={setFilterRecordType}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              {!selectedPatient && (
                <TabsTrigger value="patients">Patients</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="timeline" className="mt-0">
              <MedicalRecordTimeline
                timelineItems={timelineItems}
                patients={patients}
                selectedPatient={selectedPatient}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterRecordType={filterRecordType}
                setFilterRecordType={setFilterRecordType}
              />
            </TabsContent>

            <TabsContent value="appointments" className="mt-0">
              <AppointmentsList
                appointments={appointments}
                patients={patients}
                selectedPatient={selectedPatient}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </TabsContent>

            <TabsContent value="records" className="mt-0">
              <MedicalRecordsList
                records={medicalRecords}
                patients={patients}
                selectedPatient={selectedPatient}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterRecordType={filterRecordType}
                setFilterRecordType={setFilterRecordType}
              />
            </TabsContent>

            {!selectedPatient && (
              <TabsContent value="patients" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <Card key={patient.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 flex items-start">
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
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">
                                    {patient.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    ID: {patient.patientId}
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    patient.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                  variant="outline"
                                >
                                  {patient.status.charAt(0).toUpperCase() +
                                    patient.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="mt-2 text-sm">
                                <p className="flex items-center text-gray-600">
                                  <User className="h-3 w-3 mr-1" />
                                  {patient.age} yrs, {patient.gender}
                                </p>
                                <p className="flex items-center text-gray-600 mt-1">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {patient.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="border-t px-4 py-2 bg-gray-50 flex justify-between">
                            <div className="text-xs">
                              <p className="text-gray-500">Last Visit</p>
                              <p className="font-medium">
                                {patient.lastVisit
                                  ? format(patient.lastVisit, "MMM d, yyyy")
                                  : "N/A"}
                              </p>
                            </div>
                            <div className="text-xs">
                              <p className="text-gray-500">Next Appointment</p>
                              <p className="font-medium">
                                {patient.upcomingAppointment
                                  ? format(
                                      patient.upcomingAppointment,
                                      "MMM d, yyyy"
                                    )
                                  : "None Scheduled"}
                              </p>
                            </div>
                          </div>
                          <div className="p-2 flex justify-end border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600"
                              onClick={() => setSelectedPatient(patient.id)}
                            >
                              View Records
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600"
                            >
                              Schedule Appointment
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 border rounded-lg">
                      <p className="text-gray-500">
                        No patients found matching your criteria
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterStatus("all");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
