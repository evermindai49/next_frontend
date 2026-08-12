// components/AmbientBackground.tsx
"use client";

import React from "react";

export default function AmbientBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
    >
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute top-[40%] -right-[10%] w-[45%] h-[45%] rounded-full bg-purple-600/20 blur-[120px]" />
    </div>
  );
}