"use client";

import { useState } from "react";

import UploadBox from "@/components/dashboard/UploadBox";

import TranscriptBox from "@/components/dashboard/TranscriptBox";

import RecentTranscripts from "@/components/dashboard/RecentTranscripts";

export default function Home() {
  const [transcript, setTranscript] = useState("");

  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">AI Speech Dashboard</h1>

        <p className="text-zinc-400 mt-2">
          Upload audio and generate AI-powered transcripts instantly.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <UploadBox setTranscript={setTranscript} setLoading={setLoading} />

        <TranscriptBox transcript={transcript} loading={loading} />
      </div>

      <RecentTranscripts />
    </>
  );
}
