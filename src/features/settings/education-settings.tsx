import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import specialistService from "@/services/specialist.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define degree options
const degreeOptions = [
  { label: "Associate", value: "ASSOCIATE" },
  { label: "Bachelor", value: "BACHELOR" },
  { label: "Master", value: "MASTER" },
  { label: "Doctorate", value: "DOCTORATE" },
];

// Define the education schema
const educationSchema = z.object({
  institution: z.string().min(2, {
    message: "Institution name must be at least 2 characters.",
  }),
  degree: z.enum(["ASSOCIATE", "BACHELOR", "MASTER", "DOCTORATE"], {
    required_error: "Please select a degree.",
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
    .optional()
    .nullable(),
  currentlyStudying: z.boolean().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface Education {
  id: string;
  institution: string;
  degree: "ASSOCIATE" | "BACHELOR" | "MASTER" | "DOCTORATE";
  major: string;
  startYear: number;
  endYear: number | null;
}

export function EducationSettings() {
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [specialistId, setSpecialistId] = useState<string | null>(null);

  // Add these state variables
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEduId, setDeletingEduId] = useState<string | null>(null);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: undefined,
      major: "",
      startYear: new Date().getFullYear(),
      endYear: null,
      currentlyStudying: false,
    },
    mode: "onChange",
  });

  const watchCurrentlyStudying = form.watch("currentlyStudying");

  // Fetch education data on component mount
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setIsFetching(true);
        const response = await specialistService.getSpecialistByAccessToken();

        if (response.data) {
          setSpecialistId(response.data.data.expertInfo.id);
        }

        if (response?.data?.data?.expertInfo.educations) {
          setEducation(response.data.data.expertInfo.educations);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
        toast.error("Failed to load education data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchEducation();
  }, []);

  const openNewEducationDialog = () => {
    form.reset({
      institution: "",
      degree: undefined,
      major: "",
      startYear: new Date().getFullYear(),
      endYear: null,
      currentlyStudying: false,
    });
    setEditingEduId(null);
    setIsDialogOpen(true);
  };

  const openEditEducationDialog = (edu: Education) => {
    form.reset({
      institution: edu.institution,
      degree: edu.degree,
      major: edu.major,
      startYear: edu.startYear,
      endYear: edu.endYear,
      currentlyStudying: edu.endYear === null,
    });
    setEditingEduId(edu.id);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirmation = (id: string) => {
    setDeletingEduId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteEducation = async () => {
    try {
      setIsDeleting(true);

      await specialistService.deleteEducation(specialistId as string, {
        educationIds: [deletingEduId as string],
      });

      setEducation(education.filter((edu) => edu.id !== deletingEduId));
      toast.success("The education entry has been removed from your profile");

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setDeletingEduId(null);
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to delete education entry");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDegreeLabel = (value: string) => {
    const option = degreeOptions.find((option) => option.value === value);
    return option ? option.label : value;
  };

  async function onSubmit(data: EducationFormValues) {
    try {
      setIsLoading(true);

      const educationData = {
        institution: data.institution,
        degree: data.degree,
        major: data.major,
        startYear: data.startYear,
        endYear: data.currentlyStudying ? null : data.endYear,
      };

      let response: any;

      if (editingEduId) {
        response = await specialistService.updateEducation(
          specialistId as string,
          editingEduId,
          educationData
        );

        if (response.status === 200) {
          // Update local state
          setEducation(
            education.map((edu) =>
              edu.id === editingEduId
                ? { ...edu, ...response.data.data.education }
                : edu
            )
          );
          toast.success("The education entry has been updated successfully");
        }
      } else {
        // Add new education
        response = await specialistService.addEducation(
          specialistId as string,
          educationData
        );

        if (response.status === 201 || response.status === 200) {
          // Add new education to local state
          setEducation([...education, response.data.data.education]);
          toast.success("The education entry has been added to your profile");
        }
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error("Failed to save education entry");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">
          Loading education history...
        </span>
      </div>
    );
  }

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
            <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
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
                          <h4 className="font-medium">
                            {getDegreeLabel(edu.degree)}
                          </h4>
                          {edu.endYear === null && (
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
                            {edu.endYear === null ? "Present" : edu.endYear}
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
                          onClick={() => handleDeleteConfirmation(edu.id)}
                          disabled={isDeleting}
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

      <div className="flex justify-center md:justify-start">
        <Button onClick={openNewEducationDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
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

              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a degree" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          value={
                            watchCurrentlyStudying
                              ? ""
                              : field.value?.toString() || ""
                          }
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            field.onChange(value);
                          }}
                          disabled={watchCurrentlyStudying}
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
                        checked={field.value || false}
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this education entry from your
              profile. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteEducation();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
