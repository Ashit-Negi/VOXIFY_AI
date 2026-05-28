"use client";

import { Copy, Download, Trash2 } from "lucide-react";

import API from "@/utils/api";
import { useRouter } from "next/navigation";

export default function TranscriptDetails({ transcript }) {
  const router = useRouter();

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
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{transcript.originalName}</h1>

          <p className="text-zinc-500 text-sm">
            {new Date(transcript.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl flex items-center gap-2 transition"
          >
            <Copy size={18} />
            Copy
          </button>

          <button
            onClick={handleDownload}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl flex items-center gap-2 transition"
          >
            <Download size={18} />
            Download
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl flex items-center gap-2 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
        <p className="text-zinc-300 leading-8 whitespace-pre-wrap">
          {transcript.transcript}
        </p>
      </div>
    </div>
  );
}
