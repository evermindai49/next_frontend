"use client";

import React, { useState, useEffect } from "react";
import type {
  Lesson,
  LessonContentResponse,
  ExerciseResponse,
  FeedbackResponse,
} from "@/lib/types";
import {
  generateLessonContent,
  generateExercise,
  submitAnswer,
} from "@/lib/api";

interface LessonModalProps {
  lesson: Lesson | null;
  courseName?: string;
  moduleTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LessonModal({
  lesson,
  courseName = "EduTechAI Curriculum",
  moduleTitle = "Core Module",
  isOpen,
  onClose,
}: LessonModalProps) {
  const [activeTab, setActiveTab] = useState<"lesson" | "exercise">("lesson");

  // Detailed Lesson State
  const [lessonData, setLessonData] = useState<LessonContentResponse | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);

  // Exercise State
  const [exerciseData, setExerciseData] = useState<ExerciseResponse | null>(null);
  const [loadingExercise, setLoadingExercise] = useState(false);

  // Submission State
  const [userCode, setUserCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch full lesson content when opened
  useEffect(() => {
    if (isOpen && lesson) {
      fetchLesson();
    }
  }, [isOpen, lesson]);

  // Fetch exercise data when user switches to exercise tab
  useEffect(() => {
    if (isOpen && lesson && activeTab === "exercise" && !exerciseData) {
      fetchExerciseData();
    }
  }, [activeTab, isOpen, lesson]);

  const fetchLesson = async () => {
    if (!lesson) return;
    setLoadingLesson(true);
    setError(null);
    try {
      const data = await generateLessonContent(lesson.title, moduleTitle, courseName);
      setLessonData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load comprehensive lesson content.");
    } finally {
      setLoadingLesson(false);
    }
  };

  const fetchExerciseData = async () => {
    if (!lesson) return;
    setLoadingExercise(true);
    setError(null);
    try {
      const data = await generateExercise(lesson.title);
      setExerciseData(data);
      if (data.starter_code) {
        setUserCode(data.starter_code);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load exercise content.");
    } finally {
      setLoadingExercise(false);
    }
  };

  const handleSubmitExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCode.trim() || !exerciseData) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await submitAnswer(exerciseData.title || lesson?.title || "", userCode);
      setFeedback(res);
    } catch (err: any) {
      setError(err.message || "Failed to submit exercise for evaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setActiveTab("lesson");
    setLessonData(null);
    setExerciseData(null);
    setUserCode("");
    setFeedback(null);
    setError(null);
    onClose();
  };

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={handleModalClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              {moduleTitle}
            </span>
            <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
          </div>
          <button
            onClick={handleModalClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex gap-2 rounded-xl bg-slate-950/80 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("lesson")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === "lesson"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📖 Lesson Content
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("exercise")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === "exercise"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ✏️ Hands-On Exercise
          </button>
        </div>

        {/* Error Bar */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === "lesson" ? (
            /* LESSON VIEW */
            loadingLesson ? (
              <div className="space-y-3 p-4 animate-pulse">
                <div className="h-4 w-1/3 rounded bg-slate-800" />
                <div className="h-24 rounded bg-slate-800" />
                <div className="h-20 rounded bg-slate-800" />
              </div>
            ) : (
              <div className="space-y-4 text-sm text-slate-300">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 leading-relaxed text-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Comprehensive Material
                  </h4>
                  <p className="whitespace-pre-line">
                    {lessonData?.content ||
                      lesson.content ||
                      "Detailed lesson content is loading or unavailable."}
                  </p>
                </div>

                {lessonData?.key_takeaways && lessonData.key_takeaways.length > 0 && (
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Key Takeaways
                    </h5>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                      {lessonData.key_takeaways.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          ) : (
            /* EXERCISE VIEW */
            loadingExercise ? (
              <div className="space-y-3 p-4 animate-pulse">
                <div className="h-4 w-1/4 rounded bg-slate-800" />
                <div className="h-16 rounded bg-slate-800" />
                <div className="h-32 rounded bg-slate-800" />
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {exerciseData?.title || "Exercise Instructions"}
                  </h4>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {exerciseData?.instructions ||
                      "Write your implementation in the editor below and submit for grading."}
                  </p>
                </div>

                <form onSubmit={handleSubmitExercise} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Your Answer / Code Submission
                    </label>
                    <textarea
                      rows={7}
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      placeholder="Write your response or code here..."
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950 p-3 font-mono text-xs text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !userCode.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Evaluating Submission...</span>
                      </>
                    ) : (
                      <span>Submit Exercise for Feedback</span>
                    )}
                  </button>
                </form>

                {/* Feedback Display */}
                {feedback && (
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                      <span className="text-xs font-semibold uppercase text-indigo-300">
                        Grading Result
                      </span>
                      <span className="text-sm font-bold text-emerald-400">
                        Score: {feedback.score}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-200">{feedback.feedback}</p>

                    {feedback.recommended_areas && feedback.recommended_areas.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-300">
                          Recommended Areas to Improve:
                        </span>
                        <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                          {feedback.recommended_areas.map((area, idx) => (
                            <li key={idx}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 pt-3">
          <button
            onClick={handleModalClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}