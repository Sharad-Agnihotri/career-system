export const APP_NAME = "CareerOS";
export const APP_DESCRIPTION = "AI-Powered Career Growth Platform";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Resume Analysis",
    href: "/resume/analyze",
    icon: "FileSearch",
  },
  {
    label: "Resume Builder",
    href: "/resume/builder",
    icon: "FilePlus2",
  },
  {
    label: "Skill Roadmap",
    href: "/skills/roadmap",
    icon: "Route",
  },
  {
    label: "Courses",
    href: "/skills/courses",
    icon: "GraduationCap",
  },
  {
    label: "Job Matching",
    href: "/jobs",
    icon: "Briefcase",
  },
  {
    label: "Interview Prep",
    href: "/interview",
    icon: "MessageSquare",
  },
] as const;

export const SKILL_CATEGORIES = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Mobile Development",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "Blockchain",
  "Game Development",
] as const;

export const INTERVIEW_ROUNDS = [
  {
    id: "aptitude",
    label: "Aptitude",
    icon: "Brain",
    description: "Quantitative & logical reasoning",
    duration: "30 min",
    questions: 20,
  },
  {
    id: "coding",
    label: "Coding",
    icon: "Code2",
    description: "Data Structures & Algorithms",
    duration: "60 min",
    questions: 3,
  },
  {
    id: "technical",
    label: "Technical",
    icon: "Cpu",
    description: "CS fundamentals & system design",
    duration: "45 min",
    questions: 10,
  },
  {
    id: "hr",
    label: "HR",
    icon: "Users",
    description: "Behavioral & situational",
    duration: "20 min",
    questions: 8,
  },
] as const;
