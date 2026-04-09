export const ROADMAP_TEMPLATES: Record<string, any> = {
  "Frontend Development": {
    totalDuration: "16 weeks",
    beginner: [
      {
        title: "HTML & CSS Fundamentals",
        duration: "2 weeks",
        topics: ["Semantic HTML", "CSS Box Model", "Flexbox & Grid", "Responsive Design"],
        project: "Build a responsive portfolio website",
      },
      {
        title: "JavaScript Essentials",
        duration: "3 weeks",
        topics: ["Variables & Types", "Functions & Closures", "DOM Manipulation", "ES6+ Features"],
        project: "Interactive todo app with local storage",
      },
    ],
    intermediate: [
      {
        title: "React Fundamentals",
        duration: "3 weeks",
        topics: ["Components & Props", "State & Hooks", "Context API", "React Router"],
        project: "Build a movie search app with API integration",
      },
      {
        title: "TypeScript",
        duration: "2 weeks",
        topics: ["Types & Interfaces", "Generics", "Utility Types", "React + TypeScript"],
        project: "Refactor the movie app to TypeScript",
      },
    ],
    advanced: [
      {
        title: "Next.js & SSR",
        duration: "3 weeks",
        topics: ["App Router", "Server Components", "Data Fetching", "API Routes"],
        project: "Full-stack blog with Next.js and Prisma",
      },
      {
        title: "Architecture & Deployment",
        duration: "3 weeks",
        topics: ["State Management", "Testing (Jest/Cypress)", "CI/CD", "Performance Optimization"],
        project: "Deploy a production-ready application",
      },
    ],
  },
  "Backend Development": {
    totalDuration: "20 weeks",
    beginner: [
      {
        title: "Language Fundamentals & Environment",
        duration: "3 weeks",
        topics: ["Syntax & Basic Types", "Package Management", "Async Programming", "File Systems"],
        project: "Command-line tool for file organization",
      },
      {
        title: "HTTP & APIs",
        duration: "3 weeks",
        topics: ["Methods & Status Codes", "RESTful Principles", "Express.js/FastAPI", "JSON Handling"],
        project: "Simple REST API for a task manager",
      },
    ],
    intermediate: [
      {
        title: "Databases & Persistence",
        duration: "4 weeks",
        topics: ["SQL Fundamentals", "PostgreSQL/MySQL", "ORM vs Query Builders", "Migrations"],
        project: "Database-driven e-commerce backend",
      },
      {
        title: "Authentication & Security",
        duration: "3 weeks",
        topics: ["JWT & Sessions", "OAuth2", "Password Hashing", "CORS & Headers"],
        project: "Secure user auth system with role-based access",
      },
    ],
    advanced: [
      {
        title: "Architecture & Scaling",
        duration: "4 weeks",
        topics: ["Caching (Redis)", "Microservices vs Monolith", "Docker & Containers", "Message Queues"],
        project: "Real-time chat app with WebSockets and Redis",
      },
      {
        title: "Deployment & Monitoring",
        duration: "3 weeks",
        topics: ["CI/CD Pipelines", "Logging & Debugging", "Cloud Providers (AWS/GCP)", "Database Scaling"],
        project: "Auto-deployed microservice on K8s/Cloud",
      },
    ],
  },
  "Data Science": {
    totalDuration: "24 weeks",
    beginner: [
      {
        title: "Python for Data Science",
        duration: "4 weeks",
        topics: ["Data Types & Structures", "NumPy", "Pandas Basics", "Jupyter Notebooks"],
        project: "Basic exploratory data analysis on a CSV",
      },
      {
        title: "Mathematics & Statistics",
        duration: "4 weeks",
        topics: ["Probability", "Descriptive Statistics", "Linear Algebra", "Calculus Essentials"],
        project: "Statistical summary report of a real-world dataset",
      },
    ],
    intermediate: [
      {
        title: "Data Visualization",
        duration: "3 weeks",
        topics: ["Matplotlib", "Seaborn", "Plotly", "Storytelling with Data"],
        project: "Visualizing global temperature trends",
      },
      {
        title: "Machine Learning Foundations",
        duration: "5 weeks",
        topics: ["Regression", "Classification", "Scikit-learn", "Feature Engineering"],
        project: "Predicting house prices with linear regression",
      },
    ],
    advanced: [
      {
        title: "Deep Learning & NLP",
        duration: "5 weeks",
        topics: ["Neural Networks", "TensorFlow/PyTorch", "Text Processing", "Large Language Models"],
        project: "Sentiment analysis tool for social media",
      },
      {
        title: "MLOps & Cloud",
        duration: "3 weeks",
        topics: ["Model Deployment", "Flask/FastAPI for ML", "AWS SageMaker", "Experiment Tracking"],
        project: "Deployed ML model with an API endpoint",
      },
    ],
  },
};

export function getFallbackRoadmap(skill: string) {
  // Find closest match or return a generic one
  const keys = Object.keys(ROADMAP_TEMPLATES);
  const match = keys.find(k => skill.toLowerCase().includes(k.toLowerCase())) || keys[0];
  
  return {
    ...ROADMAP_TEMPLATES[match],
    skill: skill,
    isFallback: true
  };
}
