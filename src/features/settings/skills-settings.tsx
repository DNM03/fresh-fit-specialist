import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Plus, Star, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock data for skills
const allSkills = [
  { id: "1", name: "Echocardiography" },
  { id: "2", name: "Cardiac CT" },
  { id: "3", name: "Cardiac MRI" },
  { id: "4", name: "Stress Testing" },
  { id: "5", name: "Coronary Angiography" },
  { id: "6", name: "Pacemaker Management" },
  { id: "7", name: "Heart Failure Management" },
  { id: "8", name: "Preventive Cardiology" },
  { id: "9", name: "Lipid Management" },
  { id: "10", name: "Hypertension Management" },
  { id: "11", name: "Cardiac Rehabilitation" },
  { id: "12", name: "Electrophysiology" },
  { id: "13", name: "Interventional Cardiology" },
  { id: "14", name: "Structural Heart Disease" },
  { id: "15", name: "Vascular Medicine" },
];

// Mock data for expert's skills
const initialExpertSkills = [
  { skillId: "1", name: "Echocardiography", isMainSkill: true },
  { skillId: "5", name: "Coronary Angiography", isMainSkill: true },
  { skillId: "7", name: "Heart Failure Management", isMainSkill: true },
  { skillId: "8", name: "Preventive Cardiology", isMainSkill: false },
  { skillId: "9", name: "Lipid Management", isMainSkill: false },
];

export function SkillsSettings() {
  const [expertSkills, setExpertSkills] = useState(initialExpertSkills);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");

  // Filter skills based on search term
  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !expertSkills.some((expertSkill) => expertSkill.skillId === skill.id)
  );

  const handleAddSkill = (skill: { id: string; name: string }) => {
    setExpertSkills([
      ...expertSkills,
      {
        skillId: skill.id,
        name: skill.name,
        isMainSkill: false,
      },
    ]);

    toast("", {
      description: `${skill.name} has been added to your skills.`,
    });
  };

  const handleRemoveSkill = (skillId: string) => {
    setExpertSkills(expertSkills.filter((skill) => skill.skillId !== skillId));

    toast("", {
      description: "The skill has been removed from your profile.",
    });
  };

  const handleToggleMainSkill = (skillId: string) => {
    setExpertSkills(
      expertSkills.map((skill) =>
        skill.skillId === skillId
          ? { ...skill, isMainSkill: !skill.isMainSkill }
          : skill
      )
    );
  };

  const handleCreateNewSkill = () => {
    if (newSkillName.trim() === "") return;

    // In a real app, you would send this to the server to create a new skill
    const newSkillId = `new-${Date.now()}`;

    setExpertSkills([
      ...expertSkills,
      {
        skillId: newSkillId,
        name: newSkillName,
        isMainSkill: false,
      },
    ]);

    setNewSkillName("");

    toast("", {
      description: `${newSkillName} has been added to your skills.`,
    });
  };

  const handleSaveChanges = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Saved skills:", expertSkills);
      setIsLoading(false);

      toast("", {
        description: "Your skills have been updated successfully.",
      });
    }, 1000);
  };

  const mainSkillsCount = expertSkills.filter(
    (skill) => skill.isMainSkill
  ).length;
  const maxMainSkills = 5;

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
            <div className="text-center py-8 text-muted-foreground">
              You haven't added any skills yet. Add skills to showcase your
              expertise.
            </div>
          ) : (
            <div className="space-y-2">
              {expertSkills.map((skill) => (
                <div
                  key={skill.skillId}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`main-skill-${skill.skillId}`}
                      checked={skill.isMainSkill}
                      onCheckedChange={() =>
                        handleToggleMainSkill(skill.skillId)
                      }
                      disabled={
                        !skill.isMainSkill && mainSkillsCount >= maxMainSkills
                      }
                    />
                    <Label
                      htmlFor={`main-skill-${skill.skillId}`}
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
                    onClick={() => handleRemoveSkill(skill.skillId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Add Skills</h3>
          <p className="text-sm text-muted-foreground">
            Search for skills to add to your profile or create a new one.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-2">Available Skills</h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {filteredSkills.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      No matching skills found. You can create a new skill
                      below.
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

          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-2">Create New Skill</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Enter new skill name..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
                <Button
                  onClick={handleCreateNewSkill}
                  disabled={newSkillName.trim() === ""}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Skill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
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
    </div>
  );
}
