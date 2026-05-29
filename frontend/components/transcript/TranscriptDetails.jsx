"use client";

import { Copy, Download, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

import API from "@/utils/api";

export default function TranscriptDetails({ transcript }) {
  const router = useRouter();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript.transcript);

      alert("Transcript copied!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = () => {
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

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this transcript?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/api/transcribe/${transcript._id}`);

      alert("Transcript deleted");

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold mb-2 break-words">
            {transcript.originalName}
          </h1>

          <p className="text-zinc-500 text-xs md:text-sm">
            {new Date(transcript.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 md:p-6">
          <p className="text-zinc-300 leading-7 md:leading-8 whitespace-pre-wrap break-words text-sm md:text-base">
            {transcript.transcript}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <button
            onClick={handleCopy}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Copy size={18} />
            Copy
          </button>

          <button
            onClick={handleDownload}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Download size={18} />
            Download
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
