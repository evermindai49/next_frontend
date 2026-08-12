"use client";

import { useState } from "react";
import { generateSkillPath } from "@/lib/api";
import type { SkillPathResponse } from "@/lib/types";
import CurriculumView from "@/components/CurriculumView";

const POPULAR_TOPICS = [
  { name: "FastAPI", icon: "⚡" },
  { name: "Python", icon: "🐍" },
  { name: "Docker", icon: "🐳" },
  { name: "Next.js", icon: "⚛️" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Machine Learning", icon: "🤖" },
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

  // Calculate total lessons dynamically
  const totalLessons = pathData?.modules?.reduce(
    (acc, mod) => acc + (mod.lessons?.length || 0),
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Accent Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Hero Banner Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <span>✨ AI Curriculum Generator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            EduTech Learning Hub
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Design personalized, interactive skill paths powered by intelligent AI course compilation.
          </p>
        </header>

        {/* Input & Control Card */}
        <section className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <label htmlFor="topic" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Target Topic or Discipline
              </label>
              <input
                id="topic"
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Search topics (e.g., Quantum Computing, FastApi, System Design)..."
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner text-sm"
                disabled={loading}
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !topicInput.trim()}
                className="w-full sm:w-auto h-[46px] px-8 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Compiling Path...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Path</span>
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Topics Pills */}
          <div className="pt-2 border-t border-slate-700/50 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Suggested:</span>
            {POPULAR_TOPICS.map((item) => {
              const isActive = topicInput.toLowerCase() === item.name.toLowerCase();
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleSelectPill(item.name)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-500/20"
                      : "bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-900/40 border border-red-500/50 text-red-200 rounded-xl flex items-center gap-3 backdrop-blur-md">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Skeleton Loading State */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-28 bg-slate-800/50 rounded-2xl border border-slate-700/40"></div>
            <div className="h-40 bg-slate-800/50 rounded-2xl border border-slate-700/40"></div>
            <div className="h-40 bg-slate-800/50 rounded-2xl border border-slate-700/40"></div>
          </div>
        )}

        {/* Curriculum Results View */}
        {!loading && pathData && (
          <section className="space-y-6">
            {/* Meta Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl text-center backdrop-blur-sm">
              <div>
                <span className="block text-xs text-slate-400">Total Modules</span>
                <span className="text-lg font-bold text-indigo-300">{pathData.modules?.length || 0} Modules</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Lesson Count</span>
                <span className="text-lg font-bold text-indigo-300">{totalLessons} Lessons</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-xs text-slate-400">Difficulty Level</span>
                <span className="text-lg font-bold text-emerald-400">{pathData.difficulty || "Beginner"}</span>
              </div>
            </div>

            {/* Curriculum Tree */}
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