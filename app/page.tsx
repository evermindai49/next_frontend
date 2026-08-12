"use client";

import { useState } from "react";
import Link from "next/link";
import { generateSkillPath } from "@/lib/api";
import type { SkillPathResponse, Lesson } from "@/lib/types";
import CurriculumView from "@/components/CurriculumView";
import LessonModal from "@/components/LessonModal";

const NAV_LINKS = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

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

  // Lesson Modal State
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Lesson Selection Handler
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const totalLessons =
    pathData?.modules?.reduce(
      (acc, mod) => acc + (mod.lessons?.length || 0),
      0
    ) || 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Accent Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-600 font-bold text-white shadow-md shadow-indigo-500/20">
              E
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              EduTech<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-indigo-400"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white active:scale-95"
            >
              <svg
                className="h-4 w-4 text-indigo-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
          {/* Hero Banner Header */}
          <header className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-indigo-300 shadow-sm">
              <span>✨ AI Curriculum Generator</span>
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
                <input
                  id="topic"
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Search topics (e.g., Quantum Computing, FastAPI, System Design)..."
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                  disabled={loading}
                />
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
                    <span className="text-base">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Topics Pills */}
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4 text-xs">
              <span className="font-medium text-slate-400 mr-1">Suggested:</span>
              {POPULAR_TOPICS.map((item) => {
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
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Error Notification */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 backdrop-blur-md">
              <span className="text-xl">⚠️</span>
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
                  <span className="text-xs text-slate-400">Total Modules</span>
                  <span className="mt-1 text-lg font-bold text-indigo-300">
                    {pathData.modules?.length || 0} Modules
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2">
                  <span className="text-xs text-slate-400">Lesson Count</span>
                  <span className="mt-1 text-lg font-bold text-indigo-300">
                    {totalLessons} Lessons
                  </span>
                </div>
                <div className="col-span-2 flex flex-col items-center justify-center p-2 sm:col-span-1">
                  <span className="text-xs text-slate-400">Difficulty Level</span>
                  <span className="mt-1 text-lg font-bold text-emerald-400">
                    {pathData.difficulty || "Beginner"}
                  </span>
                </div>
              </div>

              <CurriculumView
                pathData={pathData}
                modules={pathData.modules || []}
                onSelectLesson={handleSelectLesson}
              />
            </section>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-10 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-xs font-bold text-white">
              E
            </div>
            <span className="text-sm font-semibold text-slate-200">
              EduTechAI © {new Date().getFullYear()}
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-xs font-medium">
            <a href="#" className="transition-colors hover:text-indigo-400">
              Home
            </a>
            <a href="#about" className="transition-colors hover:text-indigo-400">
              About
            </a>
            <a href="#services" className="transition-colors hover:text-indigo-400">
              Services
            </a>
            <a href="#contact" className="transition-colors hover:text-indigo-400">
              Contact
            </a>
            <a href="#account" className="transition-colors hover:text-indigo-400">
              Account
            </a>
          </nav>
        </div>
      </footer>

      {/* LESSON MODAL */}
      <LessonModal
        lesson={selectedLesson}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}