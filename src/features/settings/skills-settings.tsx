import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Plus, Search, Star, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import specialistService from "@/services/specialist.service";
import skillService from "@/services/skill.service";

interface Skill {
  id: string;
  name: string;
}

interface ExpertSkill {
  id: string; // skillId from the API
  name: string;
  isMainSkill: boolean;
}

export function SkillsSettings() {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [expertSkills, setExpertSkills] = useState<ExpertSkill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialistId, setSpecialistId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsFetching(true);

        const allSkillsResponse = await skillService.getAllSkills();
        if (allSkillsResponse?.data?.data?.skills) {
          setAllSkills(allSkillsResponse.data.data.skills || []);
        }

        const expertResponse =
          await specialistService.getSpecialistByAccessToken();
        if (expertResponse?.data?.data?.expertInfo?.expertSkills) {
          setSpecialistId(expertResponse.data.data.expertInfo.id);
          const formattedExpertSkills =
            expertResponse.data.data.expertInfo.expertSkills.map(
              (skill: any) => ({
                id: skill.skillId,
                name: skill.skill.name,
                isMainSkill: skill.isMainSkill || false,
              })
            );
          setExpertSkills(formattedExpertSkills);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast.error("Failed to load skills data", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !expertSkills.some((expertSkill) => expertSkill.id === skill.id)
  );

  const handleAddSkill = (skill: { id: string; name: string }) => {
    setExpertSkills([
      ...expertSkills,
      {
        id: skill.id,
        name: skill.name,
        isMainSkill: false,
      },
    ]);

    toast.success(`${skill.name} has been added to your skills`, {
      style: {
        background: "#3ac76b",
        color: "#fff",
      },
    });
  };

  const handleRemoveSkill = (skillId: string) => {
    setExpertSkills(expertSkills.filter((skill) => skill.id !== skillId));
    toast.success("Skill removed", {
      style: {
        background: "#3ac76b",
        color: "#fff",
      },
    });
  };

  const handleToggleMainSkill = (skillId: string) => {
    // Just update the local state, we'll send the complete update on save
    setExpertSkills(
      expertSkills.map((skill) =>
        skill.id === skillId
          ? { ...skill, isMainSkill: !skill.isMainSkill }
          : skill
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      setIsSubmitting(true);

      const updateData = {
        skills: expertSkills.map((skill) => ({
          id: skill.id,
          isMainSkill: skill.isMainSkill,
        })),
      };

      const response = await specialistService.updateSkills(
        specialistId as string,
        updateData
      );

      if (response.status === 200) {
        toast.success("Your skills have been updated successfully", {
          style: {
            background: "#3ac76b",
            color: "#fff",
          },
        });
      } else {
        throw new Error("Failed to update skills");
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Failed to update skills", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainSkillsCount = expertSkills.filter(
    (skill) => skill.isMainSkill
  ).length;
  const maxMainSkills = 5;

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">
          Loading skills...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Your Skills</h3>
          <p className="text-sm text-muted-foreground">
            Manage your skills and highlight up to {maxMainSkills} main skills
            that will be prominently displayed on your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {expertSkills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
              You haven't added any skills yet. Add skills to showcase your
              expertise.
            </div>
          ) : (
            <div className="space-y-2">
              {expertSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/5"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`main-skill-${skill.id}`}
                      checked={skill.isMainSkill}
                      onCheckedChange={() => handleToggleMainSkill(skill.id)}
                      disabled={
                        !skill.isMainSkill && mainSkillsCount >= maxMainSkills
                      }
                    />
                    <Label
                      htmlFor={`main-skill-${skill.id}`}
                      className="cursor-pointer"
                    >
                      {skill.name}
                    </Label>
                    {skill.isMainSkill && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                        Main Skill
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(skill.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {mainSkillsCount > 0 && mainSkillsCount < maxMainSkills && (
          <p className="text-sm text-amber-600">
            <Star className="h-3 w-3 inline mr-1 fill-amber-500" />
            You have selected {mainSkillsCount} out of {maxMainSkills} main
            skills.
          </p>
        )}
        {mainSkillsCount >= maxMainSkills && (
          <p className="text-sm text-amber-600">
            <Star className="h-3 w-3 inline mr-1 fill-amber-500" />
            You've reached the maximum of {maxMainSkills} main skills.
          </p>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Add Skills</h3>
          <p className="text-sm text-muted-foreground">
            Search for skills to add to your profile from our database.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-2">Available Skills</h4>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {filteredSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    {searchTerm
                      ? "No matching skills found."
                      : "No additional skills available."}
                  </p>
                ) : (
                  filteredSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                    >
                      <span>{skill.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddSkill(skill)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveChanges}
          disabled={isSubmitting || expertSkills.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
