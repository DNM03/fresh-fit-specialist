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
    .optional()
    .nullable(),
  currentlyWorking: z.boolean().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
}

export function ExperienceSettings() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [specialistId, setSpecialistId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null);

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

  // Fetch experiences on component mount
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setIsFetching(true);
        const response = await specialistService.getSpecialistByAccessToken();

        if (response.data) {
          setSpecialistId(response.data.data.expertInfo.id);
        }

        if (response?.data?.data?.expertInfo.experiences) {
          setExperience(response.data.data.expertInfo.experiences);
        }
      } catch (error) {
        console.error("Error fetching experience data:", error);
        toast.error("Failed to load experience data", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchExperience();
  }, []);

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

  const openEditExperienceDialog = (exp: Experience) => {
    form.reset({
      company: exp.company || "",
      position: exp.position || "",
      description: exp.description || "",
      startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      currentlyWorking: exp.endDate === null,
    });
    setEditingExpId(exp.id);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirmation = (id: string) => {
    setDeletingExpId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteExperience = async () => {
    try {
      setIsDeleting(true);

      // Call the delete experience API
      await specialistService.deleteExperience(specialistId as string, {
        experienceIds: [deletingExpId as string],
      });

      setExperience(experience.filter((exp) => exp.id !== deletingExpId));
      toast.success("The experience entry has been removed from your profile", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });

      setIsDeleteDialogOpen(false);
      setDeletingExpId(null);
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Failed to delete experience entry", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  async function onSubmit(data: ExperienceFormValues) {
    try {
      setIsLoading(true);

      const experienceData = {
        company: data.company,
        position: data.position,
        description: data.description || null,
        startDate: data.startDate
          ? new Date(data.startDate).toISOString()
          : null,
        endDate: data.currentlyWorking
          ? null
          : data.endDate
          ? new Date(data.endDate).toISOString()
          : null,
      };

      let response: any;

      if (editingExpId) {
        response = await specialistService.updateExperience(
          specialistId as string,
          editingExpId,
          experienceData
        );

        if (response.status === 200) {
          setExperience(
            experience.map((exp) =>
              exp.id === editingExpId
                ? { ...exp, ...response.data.data.experience }
                : exp
            )
          );
          toast.success("The experience entry has been updated successfully", {
            style: {
              background: "#3ac76b",
              color: "#fff",
            },
          });
        }
      } else {
        response = await specialistService.addExperience(
          specialistId as string,
          experienceData
        );

        if (response.status === 201 || response.status === 200) {
          // Add new experience to local state
          setExperience([...experience, response.data.data.experience]);
          toast.success("The experience entry has been added to your profile", {
            style: {
              background: "#3ac76b",
              color: "#fff",
            },
          });
        }
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error("Failed to save experience entry", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">
          Loading work experience...
        </span>
      </div>
    );
  }

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
            <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
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
                          {exp.endDate === null && (
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
                            {exp.endDate === null
                              ? "Present"
                              : format(
                                  new Date(exp.endDate) as Date,
                                  "MMM yyyy"
                                )}
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
                          onClick={() => handleDeleteConfirmation(exp.id)}
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

      <div className="flex justify-between items-center">
        <Button onClick={openNewExperienceDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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
                          value={watchCurrentlyWorking ? "" : field.value ?? ""}
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this work experience from your
              profile. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteExperience();
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
