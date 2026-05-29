"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import API from "@/utils/api";

import socket from "@/utils/socket";

import { Mic, Square } from "lucide-react";

export default function Recorder({
  setTranscript,
  setLoading,
  onTranscriptCreated,
}) {
  const mediaRecorderRef = useRef(null);

  const mediaRecorderPackageRef = useRef(null);

  const audioChunksRef = useRef([]);

  const [recording, setRecording] = useState(false);

  const [language] = useState("en");

  const router = useRouter();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const setupWavEncoder = async () => {
      try {
        const { MediaRecorder, register } =
          await import("extendable-media-recorder");

        const { connect } =
          await import("extendable-media-recorder-wav-encoder");

        try {
          await register(await connect());
        } catch {
          console.log("Encoder already registered");
        }

        mediaRecorderPackageRef.current = MediaRecorder;
      } catch (error) {
        console.log(error);
      }
    };

    setupWavEncoder();
  }, []);

  const startRecording = async () => {
    if (!isAuthenticated) {
      alert("Please login to start transcribing audio.");

      router.push("/login");

      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new mediaRecorderPackageRef.current(stream, {
        mimeType: "audio/wav",
      });

      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);

          const arrayBuffer = await event.data.arrayBuffer();

          socket.emit("audio-chunk", {
            audio: arrayBuffer,
            language,
          });
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const formData = new FormData();

        formData.append("audio", audioBlob, "recording.wav");

        formData.append("language", language);

        try {
          setLoading(true);

          const { data } = await API.post("/api/transcribe", formData);

          setTranscript(data.data.transcript);

          onTranscriptCreated?.();
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      mediaRecorder.start(250);

      setRecording(true);
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();

    setRecording(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Mic className="text-indigo-500" />

        <h2 className="text-xl md:text-2xl font-semibold">Live Recorder</h2>
      </div>

      <p className="text-sm md:text-base text-zinc-400 mb-6">
        Record audio directly from your microphone.
      </p>

      <div className="mb-6">
        <p className="text-sm text-zinc-400">
          Realtime captions are optimized for English.
        </p>
      </div>

      {!isAuthenticated && (
        <p className="text-sm text-zinc-500 mb-4">
          Create an account to use live recording.
        </p>
      )}

      {!recording ? (
        <button
          onClick={startRecording}
          disabled={!isAuthenticated}
          className={`w-full px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition ${
            isAuthenticated
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-zinc-700 cursor-not-allowed"
          }`}
        >
          <Mic size={18} />

          {isAuthenticated ? "Start Recording" : "Login Required"}
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Square size={18} />
          Stop Recording
        </button>
      )}
    </div>
  );
}
