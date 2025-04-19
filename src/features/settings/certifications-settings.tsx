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
import { format } from "date-fns";

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
  expirationDate: z.string().optional(),
  credentialUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

// Mock data for certifications
const initialCertifications = [
  {
    id: "cert-1",
    name: "Board Certification in Cardiology",
    issuingOrganization: "American Board of Internal Medicine",
    issueDate: new Date("2015-06-15"),
    expirationDate: new Date("2025-06-15"),
    credentialUrl: "https://example.com/cert/123456",
  },
  {
    id: "cert-2",
    name: "Advanced Cardiac Life Support (ACLS)",
    issuingOrganization: "American Heart Association",
    issueDate: new Date("2020-03-10"),
    expirationDate: new Date("2022-03-10"),
    credentialUrl: "https://example.com/cert/789012",
  },
  {
    id: "cert-3",
    name: "Fellowship of the American College of Cardiology (FACC)",
    issuingOrganization: "American College of Cardiology",
    issueDate: new Date("2017-09-22"),
    expirationDate: null,
    credentialUrl: "",
  },
];

export function CertificationsSettings() {
  const [certifications, setCertifications] = useState(initialCertifications);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialUrl: "",
    },
    mode: "onChange",
  });

  const openNewCertificationDialog = () => {
    form.reset({
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialUrl: "",
    });
    setEditingCertId(null);
    setIsDialogOpen(true);
  };

  const openEditCertificationDialog = (cert: any) => {
    form.reset({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate.toISOString().split("T")[0],
      expirationDate: cert.expirationDate
        ? cert.expirationDate.toISOString().split("T")[0]
        : "",
      credentialUrl: cert.credentialUrl || "",
    });
    setEditingCertId(cert.id);
    setIsDialogOpen(true);
  };

  const handleDeleteCertification = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));

    toast("", {
      description: "The certification has been removed from your profile.",
    });
  };

  function onSubmit(data: CertificationFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingCertId) {
        // Update existing certification
        setCertifications(
          certifications.map((cert) =>
            cert.id === editingCertId
              ? {
                  ...cert,
                  name: data.name,
                  issuingOrganization: data.issuingOrganization,
                  issueDate: new Date(data.issueDate),
                  expirationDate: data.expirationDate
                    ? new Date(data.expirationDate)
                    : null,
                  credentialUrl: data.credentialUrl || "",
                }
              : cert
          )
        );

        toast("", {
          description: "The certification has been updated successfully.",
        });
      } else {
        // Add new certification
        const newCert = {
          id: `cert-${Date.now()}`,
          name: data.name,
          issuingOrganization: data.issuingOrganization,
          issueDate: new Date(data.issueDate),
          expirationDate: data.expirationDate
            ? new Date(data.expirationDate)
            : null,
          credentialUrl: data.credentialUrl || "",
        };

        setCertifications([...certifications, newCert]);

        toast("", {
          description: "The certification has been added to your profile.",
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
      console.log("Saved certifications:", certifications);
      setIsLoading(false);

      toast("", {
        description: "Your certifications have been updated successfully.",
      });
    }, 1000);
  };

  const isExpired = (date: Date | null) => {
    if (!date) return false;
    return new Date() > date;
  };

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
            <div className="text-center py-8 text-muted-foreground">
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
                          <span>
                            Issued: {format(cert.issueDate, "MMM yyyy")}
                          </span>
                          {cert.expirationDate && (
                            <span>
                              {" "}
                              • Expires:{" "}
                              {format(cert.expirationDate, "MMM yyyy")}
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
                          onClick={() => handleDeleteCertification(cert.id)}
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
        <Button onClick={openNewCertificationDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
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
                        placeholder="e.g., Board Certification in Cardiology"
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
                        placeholder="e.g., American Board of Internal Medicine"
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
                        <Input type="date" {...field} />
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
                        {...field}
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
    </div>
  );
}
