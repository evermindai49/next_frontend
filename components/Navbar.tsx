"use client";

import React from "react";
import { Sparkles, BookOpen, Shield, Code2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-800/80 bg-[#0b1120]/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-wide">
              EduTech<span className="text-indigo-400">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
              v2.4 Enterprise
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#curriculum"
            className="hidden sm:flex items-center gap-1.5 hover:text-slate-200 transition"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Curriculum</span>
          </a>
          <a
            href="#workspaces"
            className="hidden sm:flex items-center gap-1.5 hover:text-slate-200 transition"
          >
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>Workspaces</span>
          </a>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Isolated Environment</span>
          </div>
        </nav>
      </div>
    </header>
  );
}