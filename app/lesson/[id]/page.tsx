"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";
import { submitAnswer } from "@/lib/api";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Send,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

const QUIZ_OPTIONS = [
  "To ensure gradients evaluate to infinity during step 0.",
  "So that ΔW starts at 0, ensuring model behavior is identical to base model at the start.",
  "To compress the rank r down to 0 permanently.",
  "To prevent GPU memory allocation during backpropagation.",
];

// Index of the correct multiple-choice option. Graded locally since the
// backend only evaluates free-form code, not fixed-choice questions.
const CORRECT_QUIZ_INDEX = 1;

const DEFAULT_CODE = `# Practice Task: Implement a basic LoRA Linear layer wrapper
import torch
import torch.nn as nn

class LoRALinear(nn.Module):
    def __init__(self, in_features: int, out_features: int, rank: int = 4, alpha: float = 16.0):
        super().__init__()
        self.linear = nn.Linear(in_features, out_features)
        self.rank = rank
        self.scaling = alpha / rank

        # Initialize LoRA A and B matrices
        self.lora_A = nn.Parameter(torch.randn(rank, in_features))
        self.lora_B = nn.Parameter(torch.zeros(out_features, rank))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # TODO: Return base linear output + scaled LoRA adapter delta
        base_output = self.linear(x)
        # Compute LoRA output here: (x @ lora_A.T) @ lora_B.T * scaling
        lora_delta = (x @ self.lora_A.T) @ self.lora_B.T * self.scaling
        return base_output + lora_delta
`;

const RESET_CODE = `# Reset code snippet
class LoRALinear(nn.Module):
    def forward(self, x):
        return self.linear(x) + (x @ self.lora_A.T) @ self.lora_B.T * self.scaling
`;

interface GradeResult {
  score: number;
  passed: boolean;
  feedback: string;
  suggestions?: string[];
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"content" | "exercise">("content");
  const [userCode, setUserCode] = useState<string>(DEFAULT_CODE);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const handleOpenFullWorkspace = () => {
    const lessonId = encodeURIComponent(resolvedParams.id);
    router.push(`/lesson/${lessonId}`);
  };

  const handleGradeSubmission = async () => {
    if (quizAnswer === null) return;

    setIsGrading(true);
    setGradeResult(null);
    setGradeError(null);

    const quizCorrect = quizAnswer === CORRECT_QUIZ_INDEX;

    try {
      // Real backend call: evaluates the submitted code (syntax check +
      // LLM-based correctness check) rather than a hardcoded string match.
      const codeFeedback = await submitAnswer(
        `Lesson ${resolvedParams.id}: LoRA Linear forward pass`,
        userCode
      );

      const combinedPassed = quizCorrect && codeFeedback.passed;
      // Blend the two signals: code correctness carries most of the weight,
      // the concept check is a smaller check on top of it.
      const combinedScore = Math.round(
        codeFeedback.score * 0.7 + (quizCorrect ? 30 : 0)
      );

      const feedbackParts = [
        quizCorrect
          ? "Conceptual question: correct."
          : "Conceptual question: incorrect — review why Matrix B starts at zero.",
        codeFeedback.feedback,
      ];

      setGradeResult({
        score: combinedScore,
        passed: combinedPassed,
        feedback: feedbackParts.join(" "),
        suggestions: codeFeedback.recommended_areas,
      });
    } catch (err: any) {
      setGradeError(
        err?.message ||
          "Couldn't reach the grading service. Check your connection and try again."
      );
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0b1120] text-white relative flex flex-col"
      style={{ backgroundColor: "#0b1120", color: "#ffffff" }}
    >
      <AmbientBackground />

      <div className="relative z-20 flex flex-col min-h-screen">
        <Navbar />

        {/* Top Sticky Navigation Bar */}
        <div className="w-full border-b border-slate-700 bg-[#1e293b] px-4 py-3 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white bg-[#0f172a] border border-slate-600 px-3.5 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curriculum</span>
          </button>

          <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "content"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Comprehensive Lesson</span>
            </button>
            <button
              onClick={() => setActiveTab("exercise")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "exercise"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Interactive Lab & Grading</span>
            </button>
          </div>
        </div>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 sm:px-6">
          {activeTab === "content" ? (
            <article className="space-y-8 bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl">
              <header className="border-b border-slate-700 pb-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/50 text-indigo-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Module 1 • Lesson ID: {resolvedParams.id}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Parameter-Efficient Fine-Tuning (PEFT) & Low-Rank Adaptation
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  Learn how Low-Rank Adaptation (LoRA) reduces trainable parameter counts by up to 99% while maintaining full model capability.
                </p>
              </header>

              <section className="space-y-4 text-slate-200">
                <h2 className="text-2xl font-bold text-white border-l-4 border-indigo-500 pl-3">
                  1. Mathematical Foundations
                </h2>
                <p className="leading-relaxed">
                  Traditional fine-tuning updates all weights{" "}
                  <code className="text-indigo-300 font-mono">W_0 ∈ ℝ^(d×k)</code>{" "}
                  in a pre-trained model. During backpropagation, computing and storing gradients
                  for billions of parameters creates high memory overhead during optimizer state tracking.
                </p>
                <p className="leading-relaxed">
                  LoRA decomposes the weight update matrix{" "}
                  <code className="text-indigo-300 font-mono">ΔW</code> into two low-rank
                  matrices <code className="text-indigo-300 font-mono">A</code> and{" "}
                  <code className="text-indigo-300 font-mono">B</code>:
                </p>
                <div className="bg-[#0f172a] border border-slate-700 p-4 rounded-xl font-mono text-indigo-300 text-center text-sm sm:text-base">
                  W = W_0 + ΔW = W_0 + (α / r) * (B · A)
                </div>
                <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                  <li>
                    <strong className="text-white">Rank (r):</strong> Lower bound rank constraint (typically r ∈ {"{4, 8, 16}"}).
                  </li>
                  <li>
                    <strong className="text-white">Scaling (α):</strong> Constant scaling hyperparameter that stabilizes updates when modifying r.
                  </li>
                  <li>
                    <strong className="text-white">Initialization:</strong> Matrix A uses Gaussian initialization N(0, σ²), while Matrix B is initialized to zero so ΔW = 0 at step 0.
                  </li>
                </ul>
              </section>

              <section className="space-y-4 text-slate-200">
                <h2 className="text-2xl font-bold text-white border-l-4 border-indigo-500 pl-3">
                  2. Architectural Integration & Memory Footprint
                </h2>
                <p className="leading-relaxed">
                  During inference, the adapter weights can be merged directly into the base weights, introducing zero added latency compared to prompt-tuning or prefix-tuning approaches.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#0f172a] border border-slate-700 p-5 rounded-xl space-y-2">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                      Full Fine-Tuning
                    </h3>
                    <p className="text-xs text-slate-300">
                      Requires updating all 7B+ parameters. Stores Adam optimizer states (16 bytes per parameter), leading to ~80GB VRAM requirements.
                    </p>
                  </div>
                  <div className="bg-[#0f172a] border border-slate-700 p-5 rounded-xl space-y-2">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                      LoRA Adaptation
                    </h3>
                    <p className="text-xs text-slate-300">
                      Freezes base model W_0. Trains only ~4M adapter parameters, reducing VRAM footprint under 16GB.
                    </p>
                  </div>
                </div>
              </section>

              <div className="pt-6 border-t border-slate-700 flex flex-wrap gap-4 justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">
                  Ready to test your knowledge or open the full workspace?
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenFullWorkspace}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3 rounded-xl transition flex items-center gap-2 border border-slate-600 text-xs sm:text-sm"
                  >
                    <span>Open Full Workspace</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab("exercise")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-lg text-xs sm:text-sm"
                  >
                    <span>Proceed to Practical Lab</span>
                    <Code2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="space-y-8">
              {/* Question 1: Multiple Choice Concept Check */}
              <div className="bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>Part 1: Conceptual Verification</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Why is Matrix B initialized to zero during LoRA setup?
                </h3>

                <div className="grid gap-3 pt-2">
                  {QUIZ_OPTIONS.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizAnswer(idx)}
                      className={`flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition text-left ${
                        quizAnswer === idx
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-slate-700 bg-[#0f172a] text-slate-200 hover:border-slate-500"
                      }`}
                    >
                      <span>{option}</span>
                      {quizAnswer === idx && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Interactive Code Editor */}
              <div className="bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Code2 className="w-4 h-4" />
                    <span>Part 2: Code Implementation</span>
                  </div>
                  <button
                    onClick={() => setUserCode(RESET_CODE)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Code</span>
                  </button>
                </div>

                <p className="text-sm text-slate-300">
                  Complete the <code className="text-indigo-300">forward</code> pass method to return the base output combined with the scaled adapter delta.
                </p>

                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={12}
                  spellCheck={false}
                  className="w-full bg-[#0f172a] border-2 border-slate-700 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                />
              </div>

              {/* Grading Actions & Feedback Results */}
              <div className="bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Submission Evaluation Pipeline
                    </h4>
                    <p className="text-xs text-slate-400">
                      Submit your answers for automated syntax verification and unit tests.
                    </p>
                  </div>

                  <button
                    onClick={handleGradeSubmission}
                    disabled={isGrading || quizAnswer === null}
                    title={
                      quizAnswer === null
                        ? "Select an answer for Part 1 first"
                        : undefined
                    }
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl transition flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGrading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Code...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit & Grade Answer</span>
                      </>
                    )}
                  </button>
                </div>

                {quizAnswer === null && !gradeResult && !gradeError && (
                  <p className="text-xs text-amber-300/80 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Select an answer in Part 1 to enable grading.
                  </p>
                )}

                {gradeError && (
                  <div className="p-4 rounded-xl border-2 border-red-500/50 bg-red-950/40 text-red-200 flex items-start gap-2 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{gradeError}</span>
                  </div>
                )}

                {gradeResult && (
                  <div
                    className={`p-6 rounded-xl border-2 space-y-3 ${
                      gradeResult.passed
                        ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-200"
                        : "border-red-500/50 bg-red-950/40 text-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {gradeResult.passed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
                        )}
                        <span className="font-bold text-lg text-white">
                          {gradeResult.passed
                            ? "Evaluation Passed!"
                            : "Evaluation Failed"}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-slate-900 border border-slate-700">
                        Score: {gradeResult.score}/100
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{gradeResult.feedback}</p>
                    {gradeResult.suggestions && gradeResult.suggestions.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {gradeResult.suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
