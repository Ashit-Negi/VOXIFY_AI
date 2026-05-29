"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import { Trash2 } from "lucide-react";

import API from "@/utils/api";

export default function RecentTranscripts({ refreshKey }) {
  const [transcripts, setTranscripts] = useState([]);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchTranscripts();
  }, [isAuthenticated, refreshKey]);

  const fetchTranscripts = async () => {
    try {
      const { data } = await API.get("/api/transcribe");

      setTranscripts(data.data.slice(0, 4));
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

  if (!isAuthenticated) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-8 mt-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Recent Transcripts
        </h2>

        <p className="text-zinc-500 mb-4">
          Login to view your transcript history.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-8 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">
          Recent Transcripts
        </h2>

        <p className="text-sm text-zinc-500">{transcripts.length} Total</p>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading transcripts...</p>
      ) : transcripts.length > 0 ? (
        <div className="space-y-4">
          {transcripts.map((item) => (
            <Link href={`/transcript/${item._id}`} key={item._id}>
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 md:p-5 hover:border-indigo-500 transition cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  <h3 className="font-medium text-white break-all">
                    {item.originalName}
                  </h3>

                  <div className="flex items-center justify-between md:gap-4">
                    <span className="text-xs text-zinc-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={(e) => {
                        e.preventDefault();

                        handleDelete(item._id);
                      }}
                      className="text-gray-500 hover:text-gray-400 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-sm md:text-base text-zinc-400 line-clamp-3">
                  {item.transcript}
                </p>
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
