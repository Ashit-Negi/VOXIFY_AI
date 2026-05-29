"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import API from "@/utils/api";

import { Upload } from "lucide-react";

export default function UploadBox({
  setTranscript,
  setLoading,
  onTranscriptCreated,
}) {
  const [file, setFile] = useState(null);

  const [language, setLanguage] = useState("en");

  const router = useRouter();

  const { isAuthenticated } = useAuth();

  const handleUpload = async () => {
    if (!isAuthenticated) {
      alert("Please login to start transcribing audio.");

      router.push("/login");

      return;
    }

    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("audio", file);

      formData.append("language", language);

      const { data } = await API.post("/api/transcribe", formData);

      setTranscript(data.data.transcript);

      onTranscriptCreated?.();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="text-indigo-500" />

        <h2 className="text-xl md:text-2xl font-semibold">Upload Audio</h2>
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm text-zinc-400">
          Select Language
        </label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none text-sm md:text-base"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="auto">Auto Detect</option>
        </select>
      </div>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 block w-full text-sm text-zinc-400"
      />

      {!isAuthenticated && (
        <p className="text-sm text-zinc-500 mb-4">
          Create an account to upload and transcribe audio.
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!isAuthenticated}
        className={`w-full px-6 py-3 rounded-xl font-medium transition ${
          isAuthenticated
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-zinc-700 cursor-not-allowed"
        }`}
      >
        {isAuthenticated ? "Upload & Transcribe" : "Login Required"}
      </button>
    </div>
  );
}
