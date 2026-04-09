"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/stores/useInterviewStore";
import PageHeader from "@/components/shared/PageHeader";
import { Users, ChevronRight, CheckCircle2, ArrowLeft, Send, MessageCircle, Lightbulb, Star } from "lucide-react";

const questions = [
  { id: 1, category: "Behavioral", question: "Tell me about a time when you had to deal with a difficult team member.", tip: "Use STAR: Situation, Task, Action, Result" },
  { id: 2, category: "Situational", question: "If given a project with an unrealistic deadline, how would you approach it?", tip: "Show prioritization and communication skills" },
  { id: 3, category: "Behavioral", question: "Describe a project you're most proud of and why.", tip: "Highlight impact and your specific contributions" },
  { id: 4, category: "Culture Fit", question: "Why are you interested in this role and our company?", tip: "Connect company values with your goals" },
  { id: 5, category: "Behavioral", question: "Tell me about a time you failed. What did you learn?", tip: "Be honest, focus on growth" },
  { id: 6, category: "Situational", question: "How do you handle constructive criticism?", tip: "Show openness and improvement examples" },
  { id: 7, category: "Culture Fit", question: "Where do you see yourself in 5 years?", tip: "Align aspirations with company trajectory" },
  { id: 8, category: "Behavioral", question: "Describe a time you learned a new technology quickly.", tip: "Highlight learning strategy and adaptability" },
];

const catColors: Record<string, { bg: string; text: string }> = {
  Behavioral: { bg: "var(--color-accent-muted)", text: "var(--color-accent)" },
  Situational: { bg: "rgba(59,130,246,0.1)", text: "var(--color-info)" },
  "Culture Fit": { bg: "var(--color-success-muted)", text: "var(--color-success)" },
};

export default function HRPage() {
  const router = useRouter();
  const { finishRound } = useInterviewStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [showTip, setShowTip] = useState(false);
  const [done, setDone] = useState(false);

  const q = questions[currentQ];

  const handleSubmit = async () => { setDone(true); await finishRound(); };

  if (done) {
    const ct = answers.filter((a) => a.trim().length > 30).length;
    const pct = Math.round((ct / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <PageHeader title="HR Round — Results" />
        <div className="card p-8 text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-success)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 327} 327`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold">{pct}%</span>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{ct} of {questions.length} answered thoroughly</p>
        </div>
        <div className="card p-8 mb-6">
          <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-[var(--color-accent)]" /> AI Feedback</h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--color-success)] mt-0.5" />Good articulation and structured responses</li>
            <li className="flex items-start gap-2"><Star className="w-4 h-4 text-[var(--color-accent)] mt-0.5" />Add more specific metrics and outcomes</li>
          </ul>
        </div>
        <button onClick={() => router.push("/interview")} className="btn-primary w-full"><ArrowLeft className="w-4 h-4" /> Back to Interview Hub</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="HR Round" />
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[var(--color-text-muted)]">Question {currentQ + 1} of {questions.length}</span>
        <span className="badge" style={{ backgroundColor: catColors[q.category]?.bg, color: catColors[q.category]?.text }}>{q.category}</span>
      </div>
      <div className="flex gap-1 mb-6">{questions.map((_, i) => (<div key={i} className="h-1.5 flex-1 rounded-full transition-all" style={{ backgroundColor: i === currentQ ? "var(--color-accent)" : answers[i].trim() ? "var(--color-success)" : "var(--color-border)" }} />))}</div>
      <div className="card p-8 mb-4 animate-fade-in" key={currentQ}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center flex-shrink-0"><MessageCircle className="w-5 h-5 text-[var(--color-accent)]" /></div>
          <div><p className="text-xs text-[var(--color-text-muted)] mb-1">Interviewer asks:</p><h2 className="text-base font-heading font-semibold leading-relaxed">{q.question}</h2></div>
        </div>
        {showTip && (<div className="mb-4 p-3 rounded-lg bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 animate-fade-in"><p className="text-xs text-[var(--color-accent)]"><Lightbulb className="w-3 h-3 inline mr-1" />Tip: {q.tip}</p></div>)}
        <textarea className="input min-h-[160px] resize-y text-sm" placeholder="Type your answer..." value={answers[currentQ]} onChange={(e) => { const c = [...answers]; c[currentQ] = e.target.value; setAnswers(c); }} />
        <div className="flex items-center justify-between mt-2">
          <button onClick={() => setShowTip(!showTip)} className="btn-ghost text-xs text-[var(--color-accent)]"><Lightbulb className="w-3 h-3" />{showTip ? "Hide" : "Show"} tip</button>
          <span className="text-xs text-[var(--color-text-muted)]">{answers[currentQ].split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => { setCurrentQ(Math.max(0, currentQ - 1)); setShowTip(false); }} disabled={currentQ === 0} className="btn-secondary text-sm"><ArrowLeft className="w-4 h-4" /> Previous</button>
        {currentQ === questions.length - 1 ? (
          <button onClick={handleSubmit} className="btn-primary text-sm animate-pulse-glow">Submit All <Send className="w-4 h-4" /></button>
        ) : (
          <button onClick={() => { setCurrentQ(currentQ + 1); setShowTip(false); }} className="btn-primary text-sm">Next <ChevronRight className="w-4 h-4" /></button>
        )}
      </div>
    </div>
  );
}
