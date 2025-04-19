import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter } from "lucide-react";

interface RecordTypeFilterProps {
  filterRecordType: string;
  setFilterRecordType: (type: string) => void;
}

export function RecordTypeFilter({
  filterRecordType,
  setFilterRecordType,
}: RecordTypeFilterProps) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          {filterRecordType === "all"
            ? "All Types"
            : getRecordTypeLabel(filterRecordType)}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setFilterRecordType("all")}>
          All Types
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilterRecordType("visit")}>
          Visit Notes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilterRecordType("lab")}>
          Lab Results
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilterRecordType("prescription")}>
          Prescriptions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilterRecordType("imaging")}>
          Imaging
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
