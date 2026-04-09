import { create } from "zustand";
import type { ResumeAnalysis } from "@/types/resume";
import { delay } from "@/lib/utils";

interface ResumeState {
  file: File | null;
  analysis: ResumeAnalysis | null;
  isAnalyzing: boolean;
  uploadProgress: number;
  error: string | null;
  setFile: (file: File | null) => void;
  analyze: () => Promise<void>;
  reset: () => void;
}

const mockAnalysis: ResumeAnalysis = {
  score: 72,
  atsScore: 68,
  careerIntent: "Full Stack Developer",
  strengths: [
    "Strong experience with React and TypeScript",
    "Multiple production-level projects demonstrated",
    "Good educational background in Computer Science",
    "Experience with cloud services (AWS)",
    "Clean, well-organized resume structure",
  ],
  weaknesses: [
    "Missing quantifiable achievements in experience",
    "No mention of testing frameworks or methodologies",
    "Limited system design experience highlighted",
    "No open-source contributions mentioned",
    "Summary section could be more impactful",
  ],
  skills: [
    { name: "React", currentLevel: 85, requiredLevel: 90, category: "Frontend" },
    { name: "TypeScript", currentLevel: 75, requiredLevel: 85, category: "Frontend" },
    { name: "Node.js", currentLevel: 70, requiredLevel: 80, category: "Backend" },
    { name: "Python", currentLevel: 60, requiredLevel: 75, category: "Backend" },
    { name: "PostgreSQL", currentLevel: 55, requiredLevel: 70, category: "Database" },
    { name: "AWS", currentLevel: 45, requiredLevel: 65, category: "Cloud" },
    { name: "Docker", currentLevel: 40, requiredLevel: 60, category: "DevOps" },
    { name: "System Design", currentLevel: 35, requiredLevel: 70, category: "Architecture" },
    { name: "Testing", currentLevel: 30, requiredLevel: 65, category: "Quality" },
    { name: "CI/CD", currentLevel: 25, requiredLevel: 55, category: "DevOps" },
  ],
  suggestions: [
    "Add measurable metrics to your work experience (e.g., 'Improved performance by 40%')",
    "Include a dedicated 'Testing' section showcasing experience with Jest, Cypress, etc.",
    "Highlight any system design or architecture decisions you've made",
    "Add links to open-source contributions or notable GitHub repositories",
    "Strengthen your summary with a clear value proposition and career direction",
    "Consider adding certifications (AWS, Docker, Kubernetes)",
  ],
  experience: [
    {
      company: "TechCorp Inc.",
      title: "Frontend Developer",
      duration: "Jan 2022 – Present",
      description: "Built and maintained React applications for enterprise clients.",
      technologies: ["React", "TypeScript", "Redux", "GraphQL"],
    },
    {
      company: "StartupXYZ",
      title: "Junior Developer",
      duration: "Jun 2020 – Dec 2021",
      description: "Developed full-stack features for a SaaS platform.",
      technologies: ["Node.js", "React", "MongoDB", "Express"],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      year: "2020",
      gpa: "3.7",
    },
  ],
  keywords: [
    "JavaScript", "React", "TypeScript", "Node.js", "AWS", "Docker",
    "REST API", "GraphQL", "MongoDB", "PostgreSQL", "Git",
  ],
};

export const useResumeStore = create<ResumeState>()((set, get) => ({
  file: null,
  analysis: null,
  isAnalyzing: false,
  uploadProgress: 0,
  error: null,

  setFile: (file) => set({ file, error: null, analysis: null }),

  analyze: async () => {
    const { file } = get();
    if (!file) {
      set({ error: "Please upload a resume first" });
      return;
    }

    set({ isAnalyzing: true, error: null, uploadProgress: 0 });

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Set initial progress
      set({ uploadProgress: 20 });

      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      set({ uploadProgress: 80 });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();

      set({
        analysis: data,
        isAnalyzing: false,
        uploadProgress: 100,
      });
    } catch (error) {
      set({
        isAnalyzing: false,
        error: error instanceof Error ? error.message : "Analysis failed",
        uploadProgress: 0,
      });
    }
  },

  reset: () =>
    set({
      file: null,
      analysis: null,
      isAnalyzing: false,
      uploadProgress: 0,
      error: null,
    }),
}));
