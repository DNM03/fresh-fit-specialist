import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileSettings } from "@/features/settings/profile-settings";
import { SkillsSettings } from "@/features/settings/skills-settings";
import { CertificationsSettings } from "@/features/settings/certifications-settings";
import { EducationSettings } from "@/features/settings/education-settings";
import { ExperienceSettings } from "@/features/settings/experience-settings";
// import { ReviewsSettings } from "@/features/settings/reviews-settings";
import { AccountSettings } from "@/features/settings/account-settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, skills, certifications, and other information.
        </p>
      </div>

      <Separator className="my-6" />

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          {/* <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your basic profile information that will be visible to
                patients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>
                Manage your skills and highlight your main areas of expertise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                Add your professional certifications and credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CertificationsSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>
                Add your educational background and qualifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EducationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>
                Add your professional work history and experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExperienceSettings />
            </CardContent>
          </Card>
        </TabsContent>
        {/* 
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Patient Reviews</CardTitle>
              <CardDescription>
                View reviews and feedback from your patients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsSettings />
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
