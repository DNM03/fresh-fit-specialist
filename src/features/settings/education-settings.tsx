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
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, GraduationCap } from "lucide-react";
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

// Define the education schema
const educationSchema = z.object({
  institution: z.string().min(2, {
    message: "Institution name must be at least 2 characters.",
  }),
  degree: z.string().min(2, {
    message: "Degree must be at least 2 characters.",
  }),
  major: z.string().min(2, {
    message: "Field of study must be at least 2 characters.",
  }),
  startYear: z.coerce
    .number()
    .min(1900, {
      message: "Start year must be valid.",
    })
    .max(new Date().getFullYear(), {
      message: "Start year cannot be in the future.",
    }),
  endYear: z.coerce
    .number()
    .min(1900, {
      message: "End year must be valid.",
    })
    .max(new Date().getFullYear() + 10, {
      message: "End year cannot be too far in the future.",
    })
    .optional(),
  currentlyStudying: z.boolean().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

// Mock data for education
const initialEducation = [
  {
    id: "edu-1",
    institution: "Harvard Medical School",
    degree: "Doctor of Medicine (MD)",
    major: "Medicine",
    startYear: 2008,
    endYear: 2012,
    currentlyStudying: false,
  },
  {
    id: "edu-2",
    institution: "Johns Hopkins University",
    degree: "Fellowship",
    major: "Cardiology",
    startYear: 2012,
    endYear: 2015,
    currentlyStudying: false,
  },
  {
    id: "edu-3",
    institution: "Stanford University",
    degree: "Bachelor of Science",
    major: "Biology",
    startYear: 2004,
    endYear: 2008,
    currentlyStudying: false,
  },
];

export function EducationSettings() {
  const [education, setEducation] = useState(initialEducation);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      major: "",
      startYear: undefined,
      endYear: undefined,
      currentlyStudying: false,
    },
    mode: "onChange",
  });

  const watchCurrentlyStudying = form.watch("currentlyStudying");

  const openNewEducationDialog = () => {
    form.reset({
      institution: "",
      degree: "",
      major: "",
      startYear: undefined,
      endYear: undefined,
      currentlyStudying: false,
    });
    setEditingEduId(null);
    setIsDialogOpen(true);
  };

  const openEditEducationDialog = (edu: any) => {
    form.reset({
      institution: edu.institution,
      degree: edu.degree,
      major: edu.major,
      startYear: edu.startYear,
      endYear: edu.currentlyStudying
        ? new Date().getFullYear()
        : edu.endYear || new Date().getFullYear(),
      currentlyStudying: edu.currentlyStudying,
    });
    setEditingEduId(edu.id);
    setIsDialogOpen(true);
  };

  const handleDeleteEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));

    toast("", {
      description: "The education entry has been removed from your profile.",
    });
  };

  function onSubmit(data: EducationFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingEduId) {
        setEducation(
          education.map((edu) =>
            edu.id === editingEduId
              ? {
                  ...edu,
                  institution: data.institution,
                  degree: data.degree,
                  major: data.major,
                  startYear: data.startYear,
                  endYear: data.currentlyStudying
                    ? new Date().getFullYear()
                    : data.endYear || new Date().getFullYear(),
                  currentlyStudying: data.currentlyStudying || false,
                }
              : edu
          )
        );

        toast("", {
          description: "The education entry has been updated successfully.",
        });
      } else {
        // Add new education
        const newEdu = {
          id: `edu-${Date.now()}`,
          institution: data.institution,
          degree: data.degree,
          major: data.major,
          startYear: data.startYear,
          endYear: data.currentlyStudying ? null : data.endYear,
          currentlyStudying: data.currentlyStudying || false,
        };

        setEducation([
          ...education,
          { ...newEdu, endYear: newEdu.endYear ?? new Date().getFullYear() },
        ]);

        toast("", {
          description: "The education entry has been added to your profile.",
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
      console.log("Saved education:", education);
      setIsLoading(false);

      toast("", {
        description: "Your education history has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Your Education</h3>
          <p className="text-sm text-muted-foreground">
            Manage your educational background and qualifications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {education.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You haven't added any education yet. Add your educational
              background to enhance your profile.
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <Card key={edu.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">{edu.degree}</h4>
                          {edu.currentlyStudying && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              Currently Studying
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu.major}
                        </p>
                        <div className="text-sm">
                          <span>
                            {edu.startYear} -{" "}
                            {edu.currentlyStudying ? "Present" : edu.endYear}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditEducationDialog(edu)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEducation(edu.id)}
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
        <Button onClick={openNewEducationDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
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
              {editingEduId ? "Edit Education" : "Add Education"}
            </DialogTitle>
            <DialogDescription>
              {editingEduId
                ? "Update your education details below."
                : "Add a new education entry to your profile."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Harvard Medical School"
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
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Doctor of Medicine (MD)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Medicine" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={watchCurrentlyStudying}
                          value={watchCurrentlyStudying ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentlyStudying"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I am currently studying here</FormLabel>
                      <FormDescription>
                        Check this if you are still pursuing this degree.
                      </FormDescription>
                    </div>
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
                  ) : editingEduId ? (
                    "Update Education"
                  ) : (
                    "Add Education"
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
