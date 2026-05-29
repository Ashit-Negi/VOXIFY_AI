"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import UploadBox from "@/components/dashboard/UploadBox";
import TranscriptBox from "@/components/dashboard/TranscriptBox";
import RecentTranscripts from "@/components/dashboard/RecentTranscripts";
import Recorder from "@/components/dashboard/Recorder";

import { useAuth } from "@/context/AuthContext";

import socket from "@/utils/socket";

export default function Home() {
  const [transcript, setTranscript] = useState("");

  const [liveTranscript, setLiveTranscript] = useState("");

  const [loading, setLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const { isAuthenticated, loading: authLoading } = useAuth();

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
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-zinc-400 text-lg">Loading...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="space-y-20">
        {/* HERO */}
        <section className="text-center py-10 md:py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI Speech To Text
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
            Convert audio into accurate transcripts using AI-powered speech
            recognition. Upload audio files or record directly from your
            microphone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl font-medium transition"
            >
              Get Started Free
            </Link>

            <Link
              href="/login"
              className="border border-zinc-700 hover:border-zinc-500 px-8 py-4 rounded-xl transition"
            >
              Login
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">Features</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-3">Audio Upload</h3>

              <p className="text-zinc-400">
                Upload MP3, WAV and other audio formats and get instant
                transcripts.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-3">Live Recording</h3>

              <p className="text-zinc-400">
                Record directly from your microphone and generate transcripts in
                real time.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-3">Transcript History</h3>

              <p className="text-zinc-400">
                Access, download and manage all your saved transcripts in one
                place.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
              <div className="text-3xl font-bold text-indigo-500 mb-4">1</div>

              <h3 className="font-semibold mb-2">Upload Audio</h3>

              <p className="text-zinc-400">
                Upload a file or record live audio.
              </p>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
              <div className="text-3xl font-bold text-indigo-500 mb-4">2</div>

              <h3 className="font-semibold mb-2">AI Processing</h3>

              <p className="text-zinc-400">
                Voxify AI converts speech into text.
              </p>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
              <div className="text-3xl font-bold text-indigo-500 mb-4">3</div>

              <h3 className="font-semibold mb-2">Get Transcript</h3>

              <p className="text-zinc-400">
                View, download and save transcripts.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">AI Speech Dashboard</h1>

        <p className="text-zinc-400 mt-2">
          Upload audio and generate AI-powered transcripts instantly.
        </p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <UploadBox
          setTranscript={setTranscript}
          setLoading={setLoading}
          onTranscriptCreated={() => setRefreshKey((prev) => prev + 1)}
        />

        <Recorder
          setTranscript={setTranscript}
          setLoading={setLoading}
          onTranscriptCreated={() => setRefreshKey((prev) => prev + 1)}
        />

        <TranscriptBox
          transcript={transcript}
          loading={loading}
          liveTranscript={liveTranscript}
        />
      </div>

      <RecentTranscripts refreshKey={refreshKey} />
    </>
  );
}
