import {
  Event,
  Registration,
  User,
  AiRecommendationResponse,
  RecommendedEventMatch,
  CareerRoadmapData,
  SkillGapAnalysisData,
  EventMatchAnalysis,
} from "@/types/event";

type AiContext = {
  user: User;
  registrations: Registration[];
  events: Event[];
  query?: string;
};

/**
 * DETERMINISTIC HYBRID MATCHING ENGINE (0 - 100 Score)
 * 
 * Score breakdown:
 * - Skills match: up to 30 pts
 * - Career Goal match: up to 25 pts
 * - Interest match: up to 20 pts
 * - Branch/Year relevance: up to 10 pts
 * - Previous Activity/Registrations: up to 10 pts
 * - Category relevance: up to 5 pts
 */
export function calculateHybridMatchScore(
  user: User,
  event: Event,
  registrations: Registration[]
): {
  score: number;
  label: "Excellent Match" | "Strong Match" | "Good Match" | "Moderate Match";
  reasons: string[];
  whyRecommended: string;
  skillsGained: string[];
  careerBenefit: string;
} {
  let score = 40;
  const reasons: string[] = [];

  const eventTitle = event.title.toLowerCase();
  const eventCategory = event.category.toLowerCase();
  const eventDesc = event.description.toLowerCase();

  const userSkills = (user.skills || "").toLowerCase();
  const userInterests = (user.interests || "").toLowerCase();
  const userGoal = (user.careerGoal || "").toLowerCase();
  const userBranch = (user.branch || "").toLowerCase();
  const userMode = (user.preferredMode || "All").toLowerCase();

  // 1. Skills Match (up to 30 pts)
  const skillList = userSkills.split(",").map((s) => s.trim()).filter(Boolean);
  let matchedSkills: string[] = [];
  skillList.forEach((skill) => {
    if (skill && (eventTitle.includes(skill) || eventDesc.includes(skill))) {
      matchedSkills.push(skill);
    }
  });

  if (matchedSkills.length > 0) {
    const pts = Math.min(matchedSkills.length * 15, 30);
    score += pts;
    reasons.push(`Directly builds upon your skills in ${matchedSkills.slice(0, 2).join(", ")}.`);
  }

  // 2. Career Goal Match (up to 25 pts)
  if (userGoal.length > 2) {
    const goalTerms = userGoal.split(" ").filter((t) => t.length > 2);
    let goalMatch = false;
    goalTerms.forEach((term) => {
      if (eventTitle.includes(term) || eventDesc.includes(term) || eventCategory.includes(term)) {
        goalMatch = true;
      }
    });

    if (goalMatch) {
      score += 25;
      reasons.push(`Aligns directly with your target career goal of "${user.careerGoal}".`);
    }
  }

  // 3. Interest Match (up to 20 pts)
  const interestList = userInterests.split(",").map((i) => i.trim()).filter(Boolean);
  interestList.forEach((interest) => {
    if (interest && (eventTitle.includes(interest) || eventDesc.includes(interest) || eventCategory.includes(interest))) {
      score += 20;
      reasons.push(`Matches your interest in ${interest}.`);
    }
  });

  // 4. Branch / Year Relevance (up to 10 pts)
  if (userBranch.includes("cs") || userBranch.includes("computer") || userBranch.includes("it")) {
    if (eventCategory.includes("hackathon") || eventCategory.includes("workshop") || eventCategory.includes("tech")) {
      score += 10;
      reasons.push(`Relevant for ${user.branch || "CSE"} stream students.`);
    }
  }

  // 5. Preferred Mode Match
  if (userMode !== "all" && event.mode.toLowerCase() === userMode) {
    score += 5;
  }

  // 6. Past Activity Match (up to 10 pts)
  const pastTitles = registrations.map((r) => r.eventTitle.toLowerCase()).join(" ");
  if (pastTitles.includes(eventCategory) || (pastTitles.length > 0 && eventCategory.includes("workshop"))) {
    score += 10;
    reasons.push("Matches your past registration patterns.");
  }

  // Normalize final score to max 98
  const finalScore = Math.min(Math.max(score, 55), 98);

  let label: "Excellent Match" | "Strong Match" | "Good Match" | "Moderate Match" = "Good Match";
  if (finalScore >= 90) label = "Excellent Match";
  else if (finalScore >= 75) label = "Strong Match";
  else if (finalScore >= 60) label = "Good Match";
  else label = "Moderate Match";

  const whyRecommended =
    reasons.length > 0
      ? reasons.join(" ")
      : `This ${event.category} event offers valuable practical exposure and networking in ${event.location}.`;

  const skillsGained = extractSkillsGained(event);
  const careerBenefit = extractCareerBenefit(userGoal, event);

  return {
    score: finalScore,
    label,
    reasons,
    whyRecommended,
    skillsGained,
    careerBenefit,
  };
}

function extractSkillsGained(event: Event): string[] {
  const text = `${event.title} ${event.description} ${event.category}`.toLowerCase();
  const skills = [];

  if (text.includes("java") || text.includes("backend")) {
    skills.push("Spring Security", "REST API Design", "Database Architecture");
  } else if (text.includes("python") || text.includes("ai") || text.includes("data")) {
    skills.push("Machine Learning", "Data Processing", "FastAPI / Model Serving");
  } else if (text.includes("web") || text.includes("frontend") || text.includes("full")) {
    skills.push("React / Next.js", "TypeScript", "State Management");
  } else if (text.includes("hackathon")) {
    skills.push("Rapid Prototyping", "Team Collaboration", "System Pitching");
  } else {
    skills.push("Practical Problem Solving", "Industry Best Practices", "Networking");
  }

  return skills;
}

function extractCareerBenefit(goal: string | null | undefined, event: Event): string {
  if (goal) {
    return `Highly effective for building practical experience towards your goal as a ${goal}.`;
  }
  return `Useful for strengthening your resume with verified ${event.category} credentials.`;
}

/**
 * Get Recommended Events (Strict Real DB Verification)
 */
export async function getEventRecommendations(ctx: AiContext): Promise<AiRecommendationResponse> {
  const { user, registrations, events, query = "" } = ctx;

  const scoredMatches: RecommendedEventMatch[] = events.map((event) => {
    const analysis = calculateHybridMatchScore(user, event, registrations);
    return {
      event,
      matchScore: analysis.score,
      matchLabel: analysis.label,
      whyRecommended: analysis.whyRecommended,
      skillsGained: analysis.skillsGained,
      careerBenefit: analysis.careerBenefit,
    };
  });

  // Filter and sort by score descending
  scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
  const bestMatches = scoredMatches.filter((m) => m.matchScore >= 60).slice(0, 6);

  const missingFields: string[] = [];
  if (!user.skills) missingFields.push("Skills");
  if (!user.interests) missingFields.push("Interests");
  if (!user.careerGoal) missingFields.push("Career Goal");
  if (!user.branch) missingFields.push("Branch");

  return {
    bestMatches,
    skillsToLearn: [
      { skill: "REST API Design & Security", reason: "Critical for building scalable enterprise web services." },
      { skill: "Docker & Deployment Pipelines", reason: "Standard for containerizing modern full-stack microservices." },
      { skill: "System Design Fundamentals", reason: "Essential for technical interview rounds and architecture." },
    ],
    careerRoadmap: {
      title: user.careerGoal ? `${user.careerGoal} Roadmap` : "Software Engineer Roadmap",
      suggestion: "Focus on building end-to-end practical projects and earning verified event certificates.",
      currentLevel: user.experienceLevel || "Intermediate",
      nextStep: "Complete a production REST API project with containerization",
      steps: [
        "Core Programming & OOP Fundamentals",
        "Database Architecture & SQL Optimization",
        "REST API & Microservices Frameworks",
        "Containerization & CI/CD Pipelines",
        "System Design & Cloud Deployment",
      ],
    },
    actionableNextStep:
      bestMatches.length > 0
        ? `Register for "${bestMatches[0].event.title}" to boost your resume credentials.`
        : "Update your technical skills in profile to unlock precision recommendations.",
    profileCompleteness: {
      isComplete: missingFields.length === 0,
      missingFields,
    },
  };
}

/**
 * Career Roadmap Generator
 */
export async function generateCareerRoadmap(
  user: User,
  events: Event[],
  targetCareer: string
): Promise<CareerRoadmapData> {
  const goal = targetCareer || user.careerGoal || "Full Stack Developer";
  const userSkills = (user.skills || "").split(",").map((s) => s.trim()).filter(Boolean);

  const isBackend = goal.toLowerCase().includes("backend") || goal.toLowerCase().includes("java");
  const isData = goal.toLowerCase().includes("data") || goal.toLowerCase().includes("ai");

  let missingSkills = ["System Design", "Docker & CI/CD", "Testing & Microservices"];
  let learningOrder = ["Language Core", "Frameworks & APIs", "Database & ORM", "Containerization", "Production Deployment"];
  let recommendedProjects = ["E-Commerce REST API with Auth", "Real-Time Chat Microservice", "DevOps Deployment Pipeline"];

  if (isBackend) {
    missingSkills = ["Spring Security & JWT", "Docker Containerization", "Kafka / Message Queues", "Microservices Design"];
    learningOrder = ["Java Core & OOP", "Spring Boot & REST APIs", "Database Indexing & PostgreSQL", "Spring Security", "Docker & AWS"];
    recommendedProjects = ["College Event Aggregator Backend", "Banking Microservices System", "Payment Gateway Integration"];
  } else if (isData) {
    missingSkills = ["FastAPI Model Serving", "Feature Engineering", "Pandas & Data Pipelines", "PyTorch / ML Models"];
    learningOrder = ["Python Fundamentals", "Pandas & NumPy", "SQL & Data Warehousing", "Scikit-Learn ML", "FastAPI Deployment"];
    recommendedProjects = ["Predictive Event Attendance ML Model", "Customer Churn Analytics Dashboard", "NLP Chatbot System"];
  }

  // Filter REAL matching events from DB
  const recommendedEvents = events.filter((e) => {
    const text = `${e.title} ${e.category} ${e.description}`.toLowerCase();
    return goal.toLowerCase().split(" ").some((term) => term.length > 2 && text.includes(term));
  }).slice(0, 3);

  return {
    targetCareer: goal,
    currentSkillsHad: userSkills.length > 0 ? userSkills : ["Java", "HTML/CSS", "Git"],
    missingSkills,
    learningOrder,
    recommendedProjects,
    recommendedEvents: recommendedEvents.length > 0 ? recommendedEvents : events.slice(0, 2),
    suggestedTimeline: "3 - 6 Months structured learning & project building",
  };
}

/**
 * Skill Gap Analysis Generator
 */
export async function generateSkillGapAnalysis(
  user: User,
  events: Event[]
): Promise<SkillGapAnalysisData> {
  const userSkillsStr = (user.skills || "").toLowerCase();

  const strongSkills = [];
  const intermediateSkills = [];

  if (userSkillsStr.includes("java")) strongSkills.push({ name: "Core Java & OOP", percentage: 90 });
  if (userSkillsStr.includes("html") || userSkillsStr.includes("react")) strongSkills.push({ name: "Frontend / React UI", percentage: 85 });
  if (userSkillsStr.includes("mysql") || userSkillsStr.includes("sql")) strongSkills.push({ name: "SQL Databases", percentage: 80 });

  if (strongSkills.length === 0) {
    strongSkills.push({ name: "Core Programming Fundamentals", percentage: 85 });
  }

  intermediateSkills.push({ name: "Spring Boot / Web Frameworks", percentage: 70 });
  intermediateSkills.push({ name: "Git Version Control", percentage: 75 });

  const missingSkills = [
    {
      name: "Docker & Containerization",
      percentage: 30,
      priority: "High" as const,
      why: "Essential for deploying backend applications consistently across cloud providers.",
      practice: "Containerize your Spring Boot or Node.js web application with Docker Compose.",
      event: events.find((e) => e.title.toLowerCase().includes("devops") || e.category.toLowerCase().includes("workshop")) || events[0],
    },
    {
      name: "Spring Security & JWT",
      percentage: 25,
      priority: "High" as const,
      why: "Crucial for securing REST APIs and managing token-based user authentication.",
      practice: "Implement role-based access control using JWT tokens.",
      event: events.find((e) => e.title.toLowerCase().includes("java") || e.category.toLowerCase().includes("workshop")) || events[1],
    },
    {
      name: "System Design & Architecture",
      percentage: 20,
      priority: "Medium" as const,
      why: "Key requirement for senior technical interviews and building scalable architectures.",
      practice: "Design a high-throughput event notification service queue.",
      event: events.find((e) => e.category.toLowerCase().includes("seminar")) || events[0],
    },
  ];

  return {
    strongSkills,
    intermediateSkills,
    missingSkills,
  };
}

/**
 * Event Match Checker (For "Check My Match" on /events/[id])
 */
export async function checkEventMatch(
  user: User,
  event: Event,
  registrations: Registration[]
): Promise<EventMatchAnalysis> {
  const analysis = calculateHybridMatchScore(user, event, registrations);
  const userSkills = (user.skills || "").split(",").map((s) => s.trim()).filter(Boolean);

  return {
    eventId: event.id,
    matchScore: analysis.score,
    matchLabel: analysis.label,
    whyMatch: analysis.whyRecommended,
    skillsAlreadyHad: userSkills.length > 0 ? userSkills : ["General Technical Aptitude"],
    skillsMayNeed: analysis.skillsGained,
    recommendationStatement: `Based on your profile, you appear to be a ${analysis.label.toLowerCase()} for "${event.title}".`,
  };
}

/**
 * AI Chatbot Response Generator
 */
export async function generateChatResponse(
  user: User,
  events: Event[],
  userMessage: string
): Promise<{ text: string; recommendedEvents?: Event[] }> {
  const query = userMessage.toLowerCase();

  // Natural Language Search Filtering on REAL DB events
  const matchingEvents = events.filter((e) => {
    const text = `${e.title} ${e.category} ${e.description} ${e.mode} ${e.location}`.toLowerCase();
    if (query.includes("hackathon") && e.category.toLowerCase().includes("hackathon")) return true;
    if (query.includes("workshop") && e.category.toLowerCase().includes("workshop")) return true;
    if (query.includes("online") && e.mode.toLowerCase() === "online") return true;
    if (query.includes("java") && text.includes("java")) return true;
    if (query.includes("certificate") && e.certificateAvailable) return true;
    return text.split(" ").some((word) => word.length > 3 && query.includes(word));
  });

  if (query.includes("hackathon")) {
    const hackathons = events.filter((e) => e.category.toLowerCase().includes("hackathon"));
    return {
      text: `We found ${hackathons.length} upcoming hackathons in the database! Hackathons are a great way to build rapid prototypes and level up your team collaboration skills.`,
      recommendedEvents: hackathons.length > 0 ? hackathons : events.slice(0, 2),
    };
  }

  if (query.includes("java") || query.includes("backend")) {
    const javaEvents = events.filter((e) => `${e.title} ${e.description}`.toLowerCase().includes("java"));
    return {
      text: `Based on your interest in Java and Backend Development, here are suitable real events from our database. These workshops will strengthen your Spring Boot and API skills.`,
      recommendedEvents: javaEvents.length > 0 ? javaEvents : events.slice(0, 2),
    };
  }

  if (query.includes("certificate")) {
    const certEvents = events.filter((e) => e.certificateAvailable);
    return {
      text: `Here are upcoming events that issue official, QR-verifiable certificates upon completion!`,
      recommendedEvents: certEvents,
    };
  }

  return {
    text: `Hi ${user.name.split(" ")[0]}! Based on your profile (${user.branch || "CSE"}, skills in ${user.skills || "tech"}), here are the top matching opportunities from our live event database.`,
    recommendedEvents: matchingEvents.length > 0 ? matchingEvents.slice(0, 3) : events.slice(0, 3),
  };
}
