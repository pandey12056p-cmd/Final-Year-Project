export type Event = {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  location: string;
  mode: string;
  organizer: string;
  date: Date | string;
  registrationDeadline: Date | string;
  maxParticipants: number;
  prize: string;
  teamSize: string;
  status: string;
  certificateAvailable: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Registration = {
  id: number;
  eventId: number;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  teamName?: string | null;
  reason: string;
  certificateId?: string | null;
  certificateIssued: boolean;
  certificateIssuedAt?: Date | string | null;
  createdAt: Date | string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  college?: string | null;
  branch?: string | null;
  year?: string | null;
  profile?: string | null;
  skills?: string | null;
  interests?: string | null;
  careerGoal?: string | null;
  preferredDomain?: string | null;
  experienceLevel?: string | null;
  preferredMode?: string | null;
  preferredLocation?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
};

export type RecommendedEventMatch = {
  event: Event;
  matchScore: number;
  matchLabel: "Excellent Match" | "Strong Match" | "Good Match" | "Moderate Match";
  whyRecommended: string;
  skillsGained: string[];
  careerBenefit: string;
};

export type RecommendedSkill = {
  skill: string;
  reason: string;
  priority?: "High" | "Medium" | "Low";
  percentage?: number;
  suggestedProject?: string;
  relevantEvent?: Event | null;
};

export type CareerRoadmapData = {
  targetCareer: string;
  currentSkillsHad: string[];
  missingSkills: string[];
  learningOrder: string[];
  recommendedProjects: string[];
  recommendedEvents: Event[];
  suggestedTimeline: string;
};

export type SkillGapAnalysisData = {
  strongSkills: { name: string; percentage: number }[];
  intermediateSkills: { name: string; percentage: number }[];
  missingSkills: { name: string; percentage: number; priority: "High" | "Medium" | "Low"; why: string; practice: string; event?: Event | null }[];
};

export type EventMatchAnalysis = {
  eventId: number;
  matchScore: number;
  matchLabel: "Excellent Match" | "Strong Match" | "Good Match" | "Moderate Match";
  whyMatch: string;
  skillsAlreadyHad: string[];
  skillsMayNeed: string[];
  recommendationStatement: string;
};

export type AiRecommendationResponse = {
  bestMatches: RecommendedEventMatch[];
  skillsToLearn: RecommendedSkill[];
  careerRoadmap: {
    title: string;
    suggestion: string;
    currentLevel: string;
    nextStep: string;
    steps: string[];
  };
  actionableNextStep: string;
  profileCompleteness: {
    isComplete: boolean;
    missingFields: string[];
  };
};
