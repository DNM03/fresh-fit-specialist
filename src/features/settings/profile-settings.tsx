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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  Check,
  ChevronsUpDown,
  X,
  CalendarIcon,
} from "lucide-react";
import specialistService from "@/services/specialist.service";
import { userService } from "@/services";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import mediaService from "@/services/media.service";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const availableLanguages = [
  { label: "English", value: "English" },
  { label: "Vietnamese", value: "Vietnamese" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "Chinese", value: "Chinese" },
  { label: "Japanese", value: "Japanese" },
  { label: "Korean", value: "Korean" },
  { label: "Russian", value: "Russian" },
  { label: "Arabic", value: "Arabic" },
  { label: "Hindi", value: "Hindi" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Italian", value: "Italian" },
  { label: "Dutch", value: "Dutch" },
  { label: "Thai", value: "Thai" },
];

const specializations = [
  { label: "Nutrition Specialist", value: "Nutrition Specialist" },
  { label: "Fitness Coach", value: "Fitness Coach" },
  { label: "Weight Management Expert", value: "Weight Management Expert" },
  { label: "Sports Nutritionist", value: "Sports Nutritionist" },
  { label: "Dietitian", value: "Dietitian" },
  { label: "Personal Trainer", value: "Personal Trainer" },
  { label: "Bodybuilding Coach", value: "Bodybuilding Coach" },
  { label: "Wellness Coach", value: "Wellness Coach" },
  { label: "Orthopedic Specialist", value: "Orthopedic Specialist" },
  { label: "Physical Therapist", value: "Physical Therapist" },
];

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  dateOfBirth: z.date({ required_error: "Please select a date of birth." }), // For date picker
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  gender: z.enum(["Male", "Female", "Other"]),
  specialization: z.string().min(2, {
    message: "Specialization must be at least 2 characters.",
  }),
  experienceYears: z.coerce.number().min(0, {
    message: "Experience years must be a positive number.",
  }),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    }),
  languages: z.array(z.string()).min(1, {
    message: "Please select at least one language.",
  }),
  consultationFee: z.coerce.number().min(0, {
    message: "Consultation fee must be a positive number.",
  }),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [, setUserProfile] = useState<any>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: new Date(),
      phoneNumber: "",
      gender: "Male" as "Male" | "Female" | "Other",
      specialization: "",
      experienceYears: 0,
      bio: "",
      languages: [],
      consultationFee: 0,
      avatar: "",
    },
    mode: "onChange",
  });

  // Fetch specialist profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch user profile for email
        const userResponse = await userService.getCurrentUser();
        if (userResponse?.data?.result) {
          setUserEmail(userResponse.data.result.email);
          setAvatarPreview(userResponse.data.result.avatar || null);
        }

        // Fetch specialist details
        const response = await specialistService.getSpecialistByAccessToken();
        if (response?.data?.data?.expertInfo) {
          const expertData = response.data.data.expertInfo;

          setInitialData(expertData);
          setUserProfile(expertData.user);

          // Reset form with fetched values
          form.reset({
            fullName: expertData.fullName || "",
            dateOfBirth: expertData.user.dateOfBirth
              ? new Date(expertData.user.dateOfBirth)
              : new Date(),
            phoneNumber: expertData.user.phoneNumber || "",
            gender: expertData.user.gender || "Male",
            specialization: expertData.specialization || "",
            experienceYears: expertData.experience_years || 0,
            bio: expertData.bio || "",
            languages: Array.isArray(expertData.languages)
              ? expertData.languages
              : [],
            consultationFee: expertData.consultation_fee
              ? parseFloat(expertData.consultation_fee)
              : 0,
            avatar: userResponse.data.result.avatar || "",
          });
        }
      } catch (error) {
        console.error("Error fetching specialist profile:", error);
        toast.error("Failed to load profile data", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should not exceed 5MB", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
        return;
      }

      setAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);

      // Prepare the data for API call
      const updateData: any = {
        fullName: data.fullName,
        // dateOfBirth: data.dateOfBirth,
        // phoneNumber: data.phoneNumber,
        // gender: data.gender,
        specialization: data.specialization,
        experience_years: data.experienceYears,
        bio: data.bio,
        languages: data.languages,
        consultation_fee: data.consultationFee,
      };

      let imageRes;
      if (avatarFile) {
        imageRes = await mediaService.backupUploadImage(avatarFile);
      }

      const responseUser = await userService.updateProfile({
        date_of_birth: data.dateOfBirth.toISOString(),
        phoneNumber: data.phoneNumber,
        avatar: imageRes?.result?.url || initialData?.user?.avatar,
        gender: data.gender,
      });

      const response = await specialistService.updateGeneralInfo(
        initialData?.id,
        {
          ...updateData,
        }
      );

      if (response.status === 200 && responseUser.status === 200) {
        toast.success("Profile updated successfully", {
          style: {
            background: "#3ac76b",
            color: "#fff",
          },
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={avatarPreview || "/placeholder.svg?height=96&width=96"}
              alt="Profile"
            />
            <AvatarFallback>
              {form.watch("fullName")?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center">
            <Label
              htmlFor="picture"
              className="text-sm text-muted-foreground cursor-pointer hover:text-primary"
            >
              <div className="flex items-center gap-1 px-3 py-1 rounded-md border border-dashed hover:bg-muted">
                <Upload className="h-4 w-4" />
                <span>Change photo</span>
              </div>
            </Label>
            <Input
              id="picture"
              type="file"
              className="hidden"
              onChange={handleAvatarChange}
              accept="image/*"
            />
            {avatarPreview && avatarPreview !== initialData?.user?.avatar && (
              <p className="text-xs text-green-600 mt-1">New image selected</p>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input id="email" value={userEmail} disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading && !form.formState.isSubmitting ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Dr. John Doe" />
                    </FormControl>
                    <FormDescription>
                      Your professional name displayed to patients
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+84 123 456 789" />
                    </FormControl>
                    <FormDescription>Your contact phone number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Your gender</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Select a specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>
                          {spec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your primary professional specialization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your professional bio, experience, and qualifications..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on your public profile. Max 500
                    characters.
                    <span className="float-right text-xs">
                      {field.value?.length || 0}/500
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="experienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormDescription>
                      Total years of professional experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultationFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Fee (VND)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" step="10000" />
                    </FormControl>
                    <FormDescription>
                      Your standard consultation fee in VND
                      {field.value > 0 && (
                        <span className="ml-1 text-xs font-medium">
                          ({formatVND(field.value)})
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <div className="mb-2">
                    {field.value?.map((language) => (
                      <Badge
                        key={language}
                        className="mr-1 mb-1"
                        variant="secondary"
                      >
                        {language}
                        <button
                          type="button"
                          className="ml-1 rounded-full outline-none hover:bg-muted"
                          onClick={() => {
                            const filtered = field.value.filter(
                              (l) => l !== language
                            );
                            form.setValue("languages", filtered, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value?.length > 0
                            ? `${field.value.length} language${
                                field.value.length > 1 ? "s" : ""
                              } selected`
                            : "Select languages"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {availableLanguages.map((language) => {
                            const isSelected = field.value?.includes(
                              language.value
                            );
                            return (
                              <CommandItem
                                key={language.value}
                                value={language.value}
                                onSelect={() => {
                                  if (isSelected) {
                                    const filtered = field.value.filter(
                                      (l) => l !== language.value
                                    );
                                    form.setValue("languages", filtered, {
                                      shouldValidate: true,
                                    });
                                  } else {
                                    const updated = [
                                      ...(field.value || []),
                                      language.value,
                                    ];
                                    form.setValue("languages", updated, {
                                      shouldValidate: true,
                                    });
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {language.label}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Languages you can communicate in with patients
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
