"use client";

import { useState } from "react";
import { generateSkillPath } from "@/lib/api";
import type { SkillPathResponse } from "@/lib/types";
import CurriculumView from "@/components/CurriculumView";
import {
  Sparkles,
  Search,
  BookOpen,
  Layers,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  Zap,
  Code2,
  Box,
  Globe,
  Database,
  Cpu,
} from "lucide-react";

const POPULAR_TOPICS = [
  { name: "FastAPI", icon: Zap },
  { name: "Python", icon: Code2 },
  { name: "Docker", icon: Box },
  { name: "Next.js", icon: Globe },
  { name: "PostgreSQL", icon: Database },
  { name: "Machine Learning", icon: Cpu },
];

export default function Home() {
  const [topicInput, setTopicInput] = useState("FastAPI");
  const [pathData, setPathData] = useState<SkillPathResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPathForTopic = async (topicToFetch: string) => {
    if (!topicToFetch.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await generateSkillPath(topicToFetch.trim());
      setPathData(data);
    } catch (err: any) {
      console.error("Fetch failed:", err);
      setError(err.message || "Failed to load curriculum for this topic.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPathForTopic(topicInput);
  };

  const handleSelectPill = (topic: string) => {
    setTopicInput(topic);
    fetchPathForTopic(topic);
  };

  const totalLessons =
    pathData?.modules?.reduce(
      (acc, mod) => acc + (mod.lessons?.length || 0),
      0
    ) || 0;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Background Accent Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Banner Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-indigo-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Curriculum Generator</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            EduTech Learning Hub
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400">
            Design personalized, interactive skill paths powered by intelligent
            AI course compilation.
          </p>
        </header>

        {/* Input & Control Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="topic" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Topic or Discipline
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="topic"
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Search topics (e.g., Quantum Computing, FastAPI, System Design)..."
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !topicInput.trim()}
              className="flex h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-7 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-blue-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Compiling Path...</span>
                </>
              ) : (
                <>
                  <span>Generate Path</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Topics Pills */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4 text-xs">
            <span className="font-medium text-slate-400 mr-1">Suggested:</span>
            {POPULAR_TOPICS.map((item) => {
              const Icon = item.icon;
              const isActive = topicInput.toLowerCase() === item.name.toLowerCase();
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleSelectPill(item.name)}
                  disabled={loading}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-all ${
                    isActive
                      ? "border-indigo-500 bg-indigo-600/20 text-indigo-200 shadow-sm shadow-indigo-500/20"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 backdrop-blur-md">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Skeleton Loading State */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 rounded-2xl border border-slate-800 bg-slate-900/40" />
            <div className="h-44 rounded-2xl border border-slate-800 bg-slate-900/40" />
            <div className="h-44 rounded-2xl border border-slate-800 bg-slate-900/40" />
          </div>
        )}

        {/* Curriculum Results View */}
        {!loading && pathData && (
          <section className="space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center backdrop-blur-sm sm:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Layers className="h-3.5 w-3.5" /> Total Modules
                </span>
                <span className="mt-1 text-lg font-bold text-indigo-300">
                  {pathData.modules?.length || 0} Modules
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <BookOpen className="h-3.5 w-3.5" /> Lesson Count
                </span>
                <span className="mt-1 text-lg font-bold text-indigo-300">
                  {totalLessons} Lessons
                </span>
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center p-2 sm:col-span-1">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <GraduationCap className="h-3.5 w-3.5" /> Difficulty Level
                </span>
                <span className="mt-1 text-lg font-bold text-emerald-400">
                  {pathData.difficulty || "Beginner"}
                </span>
              </div>
            </div>

            <CurriculumView
              pathData={pathData}
              modules={pathData.modules || []}
            />
          </section>
        )}
      </div>
    </div>
  );
}