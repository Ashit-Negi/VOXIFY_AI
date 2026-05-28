"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import API from "@/utils/api";

import Link from "next/link";

export default function RecentTranscripts() {
  const [transcripts, setTranscripts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const { data } = await API.get("/api/transcribe");

      setTranscripts(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this transcript?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/api/transcribe/${id}`);

      setTranscripts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Recent Transcripts</h2>

        <p className="text-sm text-zinc-500">{transcripts.length} Total</p>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading transcripts...</p>
      ) : transcripts.length > 0 ? (
        <div className="space-y-4">
          {transcripts.map((item) => (
            <Link href={`/transcript/${item._id}`} key={item._id}>
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 hover:border-indigo-500 transition cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white truncate">
                    {item.originalName}
                  </h3>

                  <span className="text-xs text-zinc-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();

                      handleDelete(item._id);
                    }}
                    className="text-gray-500  hover:text-gray-400 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-zinc-400 line-clamp-3">{item.transcript}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">No transcripts found</p>
      )}
    </div>
  );
}
