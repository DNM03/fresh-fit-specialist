import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { User } from "lucide-react";

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

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatient: string | null;
  setSelectedPatient: (id: string | null) => void;
}

export function PatientSelector({
  patients,
  selectedPatient,
  setSelectedPatient,
}: PatientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedPatients, setDisplayedPatients] = useState<Patient[]>([]);
  const PATIENTS_PER_PAGE = 20;

  const commandListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setDisplayedPatients(patients.slice(0, PATIENTS_PER_PAGE));
  }, [patients]);

  const handleScroll = React.useCallback(() => {
    if (!commandListRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = commandListRef.current;

    if (scrollHeight - scrollTop - clientHeight < 50 && !isLoading) {
      setIsLoading(true);

      setTimeout(() => {
        const nextPage = page + 1;
        const nextBatch = patients.slice(0, nextPage * PATIENTS_PER_PAGE);

        setDisplayedPatients(nextBatch);
        setPage(nextPage);
        setIsLoading(false);
      }, 300);
    }
  }, [page, isLoading, patients]);

  React.useEffect(() => {
    const currentRef = commandListRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Patient Selection</CardTitle>
        <CardDescription>
          Select a patient to view their complete medical history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Search patients by name, ID, or condition..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList
                  ref={commandListRef}
                  className="max-h-[300px] overflow-auto"
                >
                  <CommandEmpty>No patients found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem
                      onSelect={() => setSelectedPatient(null)}
                      className="flex items-center cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>All Patients</span>
                    </CommandItem>
                    {displayedPatients
                      .filter(
                        (patient) =>
                          searchQuery === "" ||
                          patient.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          patient.patientId
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          patient.conditions.some((condition) =>
                            condition
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                      )
                      .map((patient) => (
                        <CommandItem
                          key={patient.id}
                          onSelect={() => setSelectedPatient(patient.id)}
                          className="cursor-pointer"
                        >
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
                            <div className="flex-1">
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {patient.patientId}
                              </p>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                  {isLoading && (
                    <div className="py-2 text-center">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground"></div>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Loading more patients...
                      </span>
                    </div>
                  )}
                </CommandList>
              </Command>
            </div>
          </div>

          {/* Recent Patients Section */}
          <div>
            <div className="text-sm font-medium mb-2">Recent Patients</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPatient === null ? "default" : "outline"}
                size="sm"
                className="flex items-center"
                onClick={() => setSelectedPatient(null)}
              >
                <User className="h-4 w-4 mr-2" />
                All
              </Button>
              {patients
                .sort((a, b) => b.lastVisit.getTime() - a.lastVisit.getTime())
                .slice(0, 5)
                .map((patient) => (
                  <Button
                    key={patient.id}
                    variant={
                      selectedPatient === patient.id ? "default" : "outline"
                    }
                    size="sm"
                    className="flex items-center"
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <Avatar className="h-5 w-5 mr-1">
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
                    {patient.name}
                  </Button>
                ))}
            </div>
          </div>

          {/* Common Conditions */}
          <div>
            <div className="text-sm font-medium mb-2">Common Conditions</div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(patients.flatMap((p) => p.conditions)))
                .slice(0, 6)
                .map((condition, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-800 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setSearchQuery(condition);
                      const patientsWithCondition = patients
                        .filter((p) => p.conditions.includes(condition))
                        .map((p) => p.id);
                      if (patientsWithCondition.length > 0) {
                        setSelectedPatient(patientsWithCondition[0]);
                      }
                    }}
                  >
                    {condition}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
