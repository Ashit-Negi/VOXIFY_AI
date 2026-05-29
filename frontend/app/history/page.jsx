"use client";

import { useEffect, useMemo, useState } from "react";

import { Search } from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import API from "@/utils/api";

import HistoryCard from "@/components/history/HistoryCard";

export default function HistoryPage() {
  const [transcripts, setTranscripts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const router = useRouter();

  const { isAuthenticated } = useAuth();

  const fetchHistory = async () => {
    try {
      const { data } = await API.get("/api/transcribe");

      setTranscripts(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");

      return;
    }

    fetchHistory();
  }, [isAuthenticated]);

  const filteredTranscripts = useMemo(() => {
    return transcripts.filter((item) => {
      const query = search.toLowerCase();

      return (
        item.originalName.toLowerCase().includes(query) ||
        item.transcript.toLowerCase().includes(query)
      );
    });
  }, [transcripts, search]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div className="text-zinc-400">Loading history...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">Transcript History</h1>

        <p className="text-zinc-500 mt-2">
          View all previously generated transcripts
        </p>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder="Search transcripts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-indigo-500"
        />
      </div>

      {filteredTranscripts.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          No matching transcripts found
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTranscripts.map((transcript) => (
            <HistoryCard
              key={transcript._id}
              transcript={transcript}
              onDelete={fetchHistory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
