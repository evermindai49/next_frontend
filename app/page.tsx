"use client";

import React from "react";
import {
  ArrowRight,
  ChevronDown,
  Crown,
  Users,
  RefreshCw,
  HeartHandshake,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      {/* ---------------- NAVIGATION HEADER ---------------- */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-100 bg-white/95 px-6 backdrop-blur-md lg:px-16">
        {/* Brand Logo */}
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-center gap-2 text-2xl font-black text-[#1D2B96]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D2B96] text-white">
              <div className="h-4 w-2 border-r-2 border-white rounded-r-full" />
            </div>
            <span>CoachHub</span>
          </a>

          {/* Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm font-semibold text-slate-800 transition hover:text-indigo-600">
              Why CoachHub
            </a>
            <a href="#" className="text-sm font-semibold text-slate-800 transition hover:text-indigo-600">
              Solutions
            </a>
            <a href="#" className="text-sm font-semibold text-slate-800 transition hover:text-indigo-600">
              Resources
            </a>
            <a href="#" className="text-sm font-semibold text-slate-800 transition hover:text-indigo-600">
              About
            </a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="hidden items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1D2B96] transition hover:opacity-80 sm:flex"
          >
            <span>LOGIN</span>
            <ArrowRight className="h-4 w-4" />
          </a>

          <a
            href="#"
            className="rounded-full border-2 border-[#1D2B96] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1D2B96] transition hover:bg-[#1D2B96] hover:text-white"
          >
            REQUEST DEMO
          </a>

          {/* Language Selector */}
          <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900">
            <span className="text-base">🇺🇸</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1b2382] via-[#2832a8] to-[#1d2787] text-white">
        {/* Soft Background Radial Lighting */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-orange-500/30 blur-[100px]" />

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 py-16 lg:flex-row lg:px-12 lg:py-24">
          {/* Hero Content */}
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Transform People and Organizations
            </h1>

            <p className="text-base font-normal leading-relaxed text-indigo-100 sm:text-lg">
              Empower your people to thrive with personalized, measurable and
              scalable digital coaching programs.
            </p>

            <div className="pt-2">
              <a
                href="#"
                className="inline-block rounded-full bg-[#FF5031] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#e04328]"
              >
                GET STARTED
              </a>
            </div>
          </div>

          {/* Hero Right Visual Column */}
          <div className="relative flex w-full max-w-xl justify-center lg:justify-end">
            {/* Arch Mask Container */}
            <div className="relative h-[420px] w-[320px] overflow-hidden rounded-t-full bg-[#3b47c0]/40 sm:h-[480px] sm:w-[380px]">
              {/* Profile Image */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                alt="Coaching participant"
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Floating Glassmorphism Feature Badges */}
            <div className="absolute left-0 top-12 flex flex-col gap-3 sm:-left-12">
              {/* Badge 1 */}
              <div className="flex items-center gap-3 rounded-2xl bg-orange-200/90 p-3 pr-6 text-slate-900 shadow-xl backdrop-blur-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-indigo-900">
                  <Crown className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Leadership</p>
                  <p className="text-[11px] text-slate-700">development</p>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-6 text-slate-900 shadow-xl backdrop-blur-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Talent</p>
                  <p className="text-[11px] text-slate-700">Management</p>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 pr-6 text-slate-900 shadow-xl backdrop-blur-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Change and</p>
                  <p className="text-[11px] text-slate-700">Transformation</p>
                </div>
              </div>

              {/* Badge 4 */}
              <div className="flex items-center gap-3 rounded-2xl bg-white/60 p-3 pr-6 text-slate-900 shadow-xl backdrop-blur-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Well-being</p>
                  <p className="text-[11px] text-slate-700">and Resilience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUSTED BY BANNER ---------------- */}
      <section className="bg-white py-16 text-center">
        <h2 className="text-2xl font-extrabold text-[#1D2B96] sm:text-3xl">
          Trusted by 1000+ global companies
        </h2>
      </section>
    </div>
  );
}