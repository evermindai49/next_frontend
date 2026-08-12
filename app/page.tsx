"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AmbientBackground } from "@/components/AmbientBackground";
import { CurriculumView } from "@/components/CurriculumView";
// Ensure this import is accurate and default if appropriate
import ExerciseModal from "@/components/ExerciseModal";
import { SkillPathResponse, Lesson } from "@/lib/types";
import { generateSkillPath } from "@/lib/api";
import { Sparkles, ArrowRight, ShieldCheck, Zap, BookOpen, Loader2 } from "lucide-react";

export default function Home() {
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [skillPath, setSkillPath] = useState<SkillPathResponse | null>(null);

  // Modal State Management
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setLoading(true);
    try {
      const data = await generateSkillPath(topicInput, "Intermediate");
      setSkillPath(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to generate skill path.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handler for selecting a lesson from CurriculumView
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 relative overflow-hidden flex flex-col">
      <AmbientBackground />
      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 py-12 max-w-6xl mx-auto w-full">
        {!skillPath ? (
          /* Initial Hero Input State */
          <div className="w-full max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen AI Learning Workspaces</span>
            </div>

            <div className="relative w-full">
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-30 blur-2xl transition duration-1000 animate-pulse"
              />

              <div className="relative w-full rounded-2xl bg-[#172033]/90 border border-slate-700/70 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight mb-3">
                  Build your customized AI curriculum in seconds.
                </h1>
                <p className="text-sm sm:text-base text-slate-400 text-center mb-8 max-w-md mx-auto">
                  Enter your targeted domain or topic below to generate adaptive study paths and real-time execution environments.
                </p>

                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g. Distributed Model Training, Quantization, LLM Architecture"
                      className="w-full bg-[#0b1120]/90 border border-slate-700/80 rounded-xl px-5 py-4 text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/80 transition shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Generate Workspace</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 text-center">
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
          /* Curriculum Workspace State */
          <div className="w-full space-y-6">
            <button
              onClick={() => setSkillPath(null)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-slate-700/80 px-4 py-2 rounded-lg transition"
            >
              ← Generate New Curriculum
            </button>
            
            {/* CurriculumView handles listing lessons */}
            <CurriculumView 
              data={skillPath} 
              onSelectLesson={handleSelectLesson} // <-- Ensure this callback is passed
            />
          </div>
        )}
      </main>

      {/* 4. UPDATE: Mount ExerciseModal here at the bottom */}
      {/* It now accepts 'lesson' via the updated interface */}
      <ExerciseModal
        lesson={selectedLesson}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}