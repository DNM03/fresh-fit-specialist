import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

// Define the experience schema
const experienceSchema = z.object({
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  description: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)) || val === "", {
      message: "Please enter a valid date.",
    })
    .optional(),
  currentlyWorking: z.boolean().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

// Mock data for experience
const initialExperience = [
  {
    id: "exp-1",
    company: "Memorial Hospital",
    position: "Senior Cardiologist",
    description:
      "Leading the cardiology department, specializing in interventional procedures and patient care. Supervising a team of 5 junior cardiologists.",
    startDate: new Date("2018-03-15"),
    endDate: null,
    currentlyWorking: true,
  },
  {
    id: "exp-2",
    company: "City Medical Center",
    position: "Cardiologist",
    description:
      "Provided comprehensive cardiac care, performed diagnostic procedures, and participated in research studies.",
    startDate: new Date("2015-06-01"),
    endDate: new Date("2018-02-28"),
    currentlyWorking: false,
  },
  {
    id: "exp-3",
    company: "University Hospital",
    position: "Cardiology Fellow",
    description:
      "Completed specialized training in cardiology, participated in research, and provided patient care under supervision.",
    startDate: new Date("2012-07-01"),
    endDate: new Date("2015-05-31"),
    currentlyWorking: false,
  },
];

export function ExperienceSettings() {
  const [experience, setExperience] = useState(initialExperience);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    },
    mode: "onChange",
  });

  const watchCurrentlyWorking = form.watch("currentlyWorking");

  const openNewExperienceDialog = () => {
    form.reset({
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    });
    setEditingExpId(null);
    setIsDialogOpen(true);
  };

  const openEditExperienceDialog = (exp: any) => {
    form.reset({
      company: exp.company,
      position: exp.position,
      description: exp.description || "",
      startDate: exp.startDate.toISOString().split("T")[0],
      endDate: exp.currentlyWorking
        ? ""
        : exp.endDate?.toISOString().split("T")[0] || "",
      currentlyWorking: exp.currentlyWorking,
    });
    setEditingExpId(exp.id);
    setIsDialogOpen(true);
  };

  const handleDeleteExperience = (id: string) => {
    setExperience(experience.filter((exp) => exp.id !== id));

    toast("", {
      description: "The experience entry has been removed from your profile.",
    });
  };

  function onSubmit(data: ExperienceFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingExpId) {
        // Update existing experience
        setExperience(
          experience.map((exp) =>
            exp.id === editingExpId
              ? {
                  ...exp,
                  company: data.company,
                  position: data.position,
                  description: data.description || "",
                  startDate: new Date(data.startDate),
                  endDate: data.currentlyWorking
                    ? null
                    : data.endDate
                    ? new Date(data.endDate)
                    : null,
                  currentlyWorking: data.currentlyWorking || false,
                }
              : exp
          )
        );

        toast("", {
          description: "The experience entry has been updated successfully.",
        });
      } else {
        // Add new experience
        const newExp = {
          id: `exp-${Date.now()}`,
          company: data.company,
          position: data.position,
          description: data.description || "",
          startDate: new Date(data.startDate),
          endDate: data.currentlyWorking
            ? null
            : data.endDate
            ? new Date(data.endDate)
            : null,
          currentlyWorking: data.currentlyWorking || false,
        };

        setExperience([...experience, newExp]);

        toast("", {
          description: "The experience entry has been added to your profile.",
        });
      }

      setIsLoading(false);
      setIsDialogOpen(false);
    }, 1000);
  }

  const handleSaveChanges = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Saved experience:", experience);
      setIsLoading(false);

      toast("", {
        description: "Your work experience has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Your Work Experience</h3>
          <p className="text-sm text-muted-foreground">
            Manage your professional work history and experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {experience.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You haven't added any work experience yet. Add your professional
              history to enhance your profile.
            </div>
          ) : (
            <div className="space-y-4">
              {experience.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">{exp.position}</h4>
                          {exp.currentlyWorking && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{exp.company}</p>
                        <div className="text-sm text-muted-foreground">
                          <span>
                            {format(exp.startDate, "MMM yyyy")} -{" "}
                            {exp.currentlyWorking
                              ? "Present"
                              : format(exp.endDate as Date, "MMM yyyy")}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-sm mt-2">{exp.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditExperienceDialog(exp)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExperience(exp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button onClick={openNewExperienceDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>

        <Button onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingExpId ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
            <DialogDescription>
              {editingExpId
                ? "Update your work experience details below."
                : "Add a new work experience entry to your profile."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company/Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Memorial Hospital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Senior Cardiologist"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={watchCurrentlyWorking}
                          value={watchCurrentlyWorking ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentlyWorking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I currently work here</FormLabel>
                      <FormDescription>
                        Check this if this is your current position.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe your role, responsibilities, and key
                      achievements.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingExpId ? (
                    "Update Experience"
                  ) : (
                    "Add Experience"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
