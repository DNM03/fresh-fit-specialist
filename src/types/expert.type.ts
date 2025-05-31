export interface CreateExpertAccountData {
  email: string;
  phoneNumber?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  specialization?: string;
  experienceYears?: number;
  bio?: string;
  certifications?: {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialUrl?: string;
  }[];
  languages?: string[];
  consultationFee?: number;
  mainSkills?: string[];
  experiences?: {
    company: string;
    position: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }[];
  educations?: {
    institution: string;
    degree: string;
    major?: string;
    startYear?: string;
    endYear?: string;
  }[];
}

export interface AddAvailabilityData {
  availability: {
    date: string;
    startTime: string;
    endTime: string;
  };
  type: string;
}
