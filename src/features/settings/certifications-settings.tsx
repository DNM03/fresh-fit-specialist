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
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, ExternalLink } from "lucide-react";
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
import { format, parseISO } from "date-fns";
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

const certificationSchema = z.object({
  name: z.string().min(2, {
    message: "Certification name must be at least 2 characters.",
  }),
  issuingOrganization: z.string().min(2, {
    message: "Issuing organization must be at least 2 characters.",
  }),
  issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  expirationDate: z.string().optional().nullable(),
  credentialUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .nullable()
    .or(z.literal("")),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string | null;
  credentialUrl: string | null;
}

export function CertificationsSettings() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [specialistId, setSpecialistId] = useState<string | null>(null);

  // Add these state variables
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCertId, setDeletingCertId] = useState<string | null>(null);

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: null,
      credentialUrl: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setIsFetching(true);
        const response = await specialistService.getSpecialistByAccessToken();
        if (response.data) {
          setSpecialistId(response.data.data.expertInfo.id);
        }

        if (response?.data?.data?.expertInfo.certifications) {
          setCertifications(response.data.data.expertInfo.certifications);
        }
      } catch (error) {
        console.error("Error fetching certifications:", error);
        toast.error("Failed to load certifications");
      } finally {
        setIsFetching(false);
      }
    };

    fetchCertifications();
  }, []);

  const openNewCertificationDialog = () => {
    form.reset({
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: null, // Change from "" to null
      credentialUrl: "",
    });
    setEditingCertId(null);
    setIsDialogOpen(true);
  };

  const openEditCertificationDialog = (cert: Certification) => {
    form.reset({
      name: cert.name || "",
      issuingOrganization: cert.issuingOrganization || "",
      issueDate: cert.issueDate ? cert.issueDate.split("T")[0] : "",
      expirationDate: cert.expirationDate
        ? cert.expirationDate.split("T")[0]
        : null,
      credentialUrl: cert.credentialUrl || "",
    });
    setEditingCertId(cert.id);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirmation = (id: string) => {
    setDeletingCertId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCertification = async () => {
    try {
      setIsDeleting(true);

      // const certToDelete = [deletingCertId];

      await specialistService.deleteCertification(specialistId as string, {
        certificationIds: [deletingCertId], // Note the array brackets and property name
      });

      setCertifications(
        certifications.filter((cert) => cert.id !== deletingCertId)
      );
      toast.success("Certification has been deleted successfully");

      setIsDeleteDialogOpen(false);
      setDeletingCertId(null);
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast.error("Failed to delete certification");
    } finally {
      setIsDeleting(false);
    }
  };

  async function onSubmit(data: CertificationFormValues) {
    try {
      setIsLoading(true);

      const certificationData = {
        name: data.name,
        issuingOrganization: data.issuingOrganization,
        issueDate: data.issueDate
          ? new Date(data.issueDate).toISOString()
          : null,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate).toISOString()
          : null,
        credentialUrl: data.credentialUrl || null,
      };

      let response: any;

      if (editingCertId) {
        response = await specialistService.updateCertification(
          specialistId as string,
          editingCertId,
          certificationData
        );

        if (response.status === 200) {
          setCertifications(
            certifications.map((cert) =>
              cert.id === editingCertId
                ? { ...cert, ...response.data.data.certification }
                : cert
            )
          );
          toast.success("Certification updated successfully");
        }
      } else {
        response = await specialistService.addCertification(
          specialistId as string,
          certificationData
        );

        if (response.status === 201 || response.status === 200) {
          setCertifications([
            ...certifications,
            response.data.data.certification,
          ]);
          toast.success("Certification added successfully");
        }
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving certification:", error);
      toast.error("Failed to save certification");
    } finally {
      setIsLoading(false);
    }
  }

  const isExpired = (dateStr: string | null) => {
    if (!dateStr) return false;
    try {
      const expirationDate = new Date(dateStr);
      return new Date() > expirationDate;
    } catch (e) {
      return false;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "MMM yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">
          Loading certifications...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Your Certifications</h3>
          <p className="text-sm text-muted-foreground">
            Manage your professional certifications and credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {certifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
              You haven't added any certifications yet. Add certifications to
              showcase your credentials.
            </div>
          ) : (
            <div className="space-y-4">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{cert.name}</h4>
                          {isExpired(cert.expirationDate) && (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200"
                            >
                              Expired
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuingOrganization}
                        </p>
                        <div className="text-sm">
                          <span>Issued: {formatDate(cert.issueDate)}</span>
                          {cert.expirationDate && (
                            <span>
                              {" "}
                              • Expires: {formatDate(cert.expirationDate)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {cert.credentialUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Verify
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditCertificationDialog(cert)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConfirmation(cert.id)}
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
        <Button onClick={openNewCertificationDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingCertId ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
            <DialogDescription>
              {editingCertId
                ? "Update your certification details below."
                : "Add a new professional certification to your profile."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Board Certification in Nutrition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issuingOrganization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Organization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., American Nutrition Association"
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
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        The date when the certification was issued.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value || ""}
                          onChange={(e) => {
                            // Handle empty string properly
                            field.onChange(e.target.value || null);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave blank if the certification does not expire.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="credentialUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/verify/credential"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      A link where others can verify this certification.
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
                  ) : editingCertId ? (
                    "Update Certification"
                  ) : (
                    "Add Certification"
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
              This will permanently delete this certification from your profile.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCertification();
              }}
              disabled={isDeleting}
              className="bg-destructive  hover:bg-destructive/90"
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
