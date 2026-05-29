"use client";

import Link from "next/link";

import API from "@/utils/api";

import { Copy, Download, Trash2 } from "lucide-react";

export default function HistoryCard({ transcript, onDelete }) {
  const handleCopy = async (e) => {
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(transcript.transcript);

      alert("Transcript copied!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();

    const blob = new Blob([transcript.transcript], {
      type: "text/plain",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${transcript.originalName}.txt`;

    link.click();

    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmDelete = confirm("Delete this transcript?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/api/transcribe/${transcript._id}`);

      onDelete();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Link href={`/transcript/${transcript._id}`}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-indigo-500 transition cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white truncate">
            {transcript.originalName}
          </h3>

          <span className="text-xs text-zinc-500">
            {new Date(transcript.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-zinc-400 line-clamp-3 mb-4">
          {transcript.transcript}
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="text-zinc-400 hover:text-white"
          >
            <Copy size={18} />
          </button>

          <button
            onClick={handleDownload}
            className="text-zinc-400 hover:text-white"
          >
            <Download size={18} />
          </button>

          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
