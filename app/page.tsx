"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";
import CurriculumView from "@/components/CurriculumView";
import ExerciseModal from "@/components/ExerciseModal";

import type { SkillPathResponse, Lesson } from "@/lib/types";
import { generateSkillPath } from "@/lib/api";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

const SUGGESTED_TOPICS = [
  { name: "LLM Architecture", icon: "🤖" },
  { name: "Quantization & ONNX", icon: "⚡" },
  { name: "FastAPI Production", icon: "🚀" },
  { name: "Distributed Training", icon: "🌐" },
];

export default function Home() {
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillPath, setSkillPath] = useState<SkillPathResponse | null>(null);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const executeGeneration = async (topicToFetch: string) => {
    if (!topicToFetch.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await generateSkillPath(topicToFetch.trim(), "Intermediate");
      setSkillPath(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate skill path. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    executeGeneration(topicInput);
  };

  const handleSelectPill = (topic: string) => {
    setTopicInput(topic);
    executeGeneration(topic);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 relative overflow-hidden flex flex-col selection:bg-indigo-500 selection:text-white" style={{ backgroundColor: "#0b1120", color: "#f8fafc" }}>
      <AmbientBackground />
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-12 max-w-6xl mx-auto w-full sm:px-6">
        {!skillPath ? (
          <div className="w-full max-w-2xl mx-auto text-center">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md" style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc" }}>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen AI Learning Workspaces</span>
            </div>

            <div className="relative w-full">
              {/* Glow Aura */}
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-30 blur-2xl transition duration-1000 animate-pulse"
              />

              {/* Central Card Container */}
              <div 
                className="relative w-full rounded-2xl border border-slate-700/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl"
                style={{ backgroundColor: "#172033", borderColor: "#334155" }}
              >
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight mb-3" style={{ color: "#ffffff" }}>
                  Build your customized AI curriculum in seconds.
                </h1>
                <p className="text-sm sm:text-base text-slate-300 text-center mb-8 max-w-md mx-auto" style={{ color: "#cbd5e1" }}>
                  Enter your targeted domain or topic below to generate adaptive study paths and real-time execution environments.
                </p>

                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g. Distributed Model Training, Quantization, LLM Architecture"
                      disabled={loading}
                      className="w-full border rounded-xl px-5 py-4 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner disabled:opacity-50"
                      style={{ backgroundColor: "#0b1120", borderColor: "#475569", color: "#ffffff" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !topicInput.trim()}
                    className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Compiling Path...</span>
                      </div>
                    ) : (
                      <>
                        <span>Generate Workspace</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Select Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-medium mr-1" style={{ color: "#94a3b8" }}>Quick Select:</span>
                  {SUGGESTED_TOPICS.map((topic) => (
                    <button
                      key={topic.name}
                      type="button"
                      onClick={() => handleSelectPill(topic.name)}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-[#0b1120] text-slate-200 hover:border-indigo-500 hover:bg-slate-800 transition"
                      style={{ backgroundColor: "#0b1120", color: "#e2e8f0", borderColor: "#334155" }}
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.name}</span>
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm text-left">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Footer Badges */}
                <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-300 text-center" style={{ color: "#cbd5e1", borderColor: "#1e293b" }}>
                  <div className="flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Instant Setup</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    <span>Interactive Labs</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enterprise Safe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <button
                onClick={() => setSkillPath(null)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-lg transition"
                style={{ backgroundColor: "#1e293b", color: "#f1f5f9" }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Generate New Curriculum</span>
              </button>
            </div>

            <CurriculumView
              data={skillPath}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        )}
      </main>

      <ExerciseModal
        lesson={selectedLesson}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}