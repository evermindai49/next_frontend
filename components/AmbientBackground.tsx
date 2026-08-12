"use client";

import React from "react";

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Primary Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
      <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[140px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[160px]" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.8) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}