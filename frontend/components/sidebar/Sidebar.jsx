"use client";

import { LayoutDashboard, History, Mic } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-[250px] bg-zinc-950 border-r border-zinc-800 p-6 hidden md:block">
      <h1 className="text-3xl font-bold mb-10 text-indigo-500">Voxify AI</h1>

      <nav className="space-y-4">
        <div className="flex items-center gap-3 text-zinc-300 hover:text-white cursor-pointer transition">
          <LayoutDashboard size={20} />

          <span>Dashboard</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-300 hover:text-white cursor-pointer transition">
          <History size={20} />

          <span>History</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-300 hover:text-white cursor-pointer transition">
          <Mic size={20} />

          <span>Recorder</span>
        </div>
      </nav>
    </aside>
  );
}
