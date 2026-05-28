"use client";

import { useState, useEffect } from "react";

import UploadBox from "@/components/dashboard/UploadBox";

import TranscriptBox from "@/components/dashboard/TranscriptBox";

import RecentTranscripts from "@/components/dashboard/RecentTranscripts";

import Recorder from "@/components/dashboard/Recorder";

import socket from "@/utils/socket";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    socket.on("live-transcript", (text) => {
      setLiveTranscript(text);
    });

    return () => {
      socket.off("connect");
      socket.off("live-transcript");
    };
  }, []);
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">AI Speech Dashboard</h1>

        <p className="text-zinc-400 mt-2">
          Upload audio and generate AI-powered transcripts instantly.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <UploadBox setTranscript={setTranscript} setLoading={setLoading} />
        <Recorder setTranscript={setTranscript} setLoading={setLoading} />
        <TranscriptBox
          transcript={transcript}
          loading={loading}
          liveTranscript={liveTranscript}
        />
      </div>

      <RecentTranscripts />
    </>
  );
}
