"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/stores/useInterviewStore";
import PageHeader from "@/components/shared/PageHeader";
import {
  Code2,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Terminal,
  Lightbulb,
} from "lucide-react";

interface CodingProblem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
}

const problems: CodingProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists"],
    starterCode: `function twoSum(nums, target) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Medium",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if every open bracket is closed by the same type of bracket in the correct order.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only"],
    starterCode: `function isValid(s) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 3,
    title: "Maximum Subarray",
    difficulty: "Hard",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6" },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: `function maxSubArray(nums) {\n  // Your solution here\n  \n}`,
  },
];

const difficultyColors: Record<string, string> = {
  Easy: "var(--color-success)",
  Medium: "var(--color-accent)",
  Hard: "var(--color-danger)",
};

export default function CodingPage() {
  const router = useRouter();
  const { finishRound } = useInterviewStore();
  const [currentP, setCurrentP] = useState(0);
  const [codes, setCodes] = useState<string[]>(problems.map((p) => p.starterCode));
  const [outputs, setOutputs] = useState<string[]>(Array(problems.length).fill(""));
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [showResult, setShowResult] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    await new Promise((r) => setTimeout(r, 1500));
    const copy = [...outputs];
    copy[currentP] = "✓ All test cases passed\n\nTest 1: Input [2,7,11,15], 9 → [0,1] ✓\nTest 2: Input [3,2,4], 6 → [1,2] ✓\n\nRuntime: 4ms\nMemory: 42.1 MB";
    setOutputs(copy);
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setShowResult(true);
    await finishRound();
  };

  const problem = problems[currentP];

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <PageHeader title="Coding Round — Results" />
        <div className="card p-8 text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(67 / 100) * 327} 327`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold">2</span>
              <span className="text-xs text-[var(--color-text-muted)]">/ 3</span>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            You solved 2 out of 3 problems correctly
          </p>
        </div>
        <div className="space-y-3 mb-6">
          {problems.map((p, i) => (
            <div key={p.id} className={`card p-4 border-l-4 ${i < 2 ? "border-l-[var(--color-success)]" : "border-l-[var(--color-danger)]"}`}>
              <div className="flex items-center gap-3">
                {i < 2 ? <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" /> : <AlertCircle className="w-5 h-5 text-[var(--color-danger)]" />}
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{p.difficulty} · {i < 2 ? "All test cases passed" : "Incomplete solution"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => router.push("/interview")} className="btn-primary w-full">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Coding Round" />
        <div className={`flex items-center gap-1.5 text-sm font-mono font-medium ${timeLeft < 600 ? "text-[var(--color-danger)]" : "text-[var(--color-text-secondary)]"}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Problem tabs */}
      <div className="flex gap-2 mb-4">
        {problems.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setCurrentP(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentP === i
                ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)]"
            }`}
          >
            Problem {i + 1}
            <span className="ml-2 text-xs" style={{ color: difficultyColors[p.difficulty] }}>
              ({p.difficulty})
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem description */}
        <div className="card p-8 overflow-y-auto max-h-[600px] animate-fade-in" key={currentP}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-heading font-semibold">{problem.title}</h2>
            <span className="badge text-xs" style={{ backgroundColor: difficultyColors[problem.difficulty] + "20", color: difficultyColors[problem.difficulty] }}>
              {problem.difficulty}
            </span>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
            {problem.description}
          </p>

          <div className="space-y-3 mb-4">
            {problem.examples.map((ex, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
                <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1">Example {i + 1}</p>
                <p className="text-xs font-mono text-[var(--color-text-secondary)]">Input: {ex.input}</p>
                <p className="text-xs font-mono text-[var(--color-text-secondary)]">Output: {ex.output}</p>
                {ex.explanation && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{ex.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">Constraints</p>
            <ul className="space-y-1">
              {problem.constraints.map((c, i) => (
                <li key={i} className="text-xs text-[var(--color-text-muted)] font-mono">• {c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Code editor */}
        <div className="flex flex-col gap-6">
          <div className="card flex flex-col overflow-hidden animate-fade-in stagger-1">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
                <Code2 className="w-3 h-3" /> JavaScript
              </span>
              <div className="flex gap-2">
                <button onClick={handleRunCode} disabled={isRunning} className="btn-secondary text-xs py-1 px-3">
                  {isRunning ? "Running..." : <><Play className="w-3 h-3" /> Run</>}
                </button>
              </div>
            </div>
            <textarea
              className="flex-1 min-h-[300px] p-4 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-mono text-sm resize-none outline-none"
              value={codes[currentP]}
              onChange={(e) => {
                const copy = [...codes];
                copy[currentP] = e.target.value;
                setCodes(copy);
              }}
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="card p-4 animate-fade-in stagger-2">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span className="text-xs font-medium text-[var(--color-text-muted)]">Output</span>
            </div>
            <pre className="text-xs font-mono text-[var(--color-text-secondary)] whitespace-pre-wrap min-h-[60px]">
              {outputs[currentP] || "Run your code to see output..."}
            </pre>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-4">
        <button onClick={handleSubmit} className="btn-primary">
          Submit All Solutions
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
