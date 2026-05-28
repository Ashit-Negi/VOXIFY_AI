"use client";

import { useEffect, useRef, useState } from "react";

import API from "@/utils/api";

import socket from "@/utils/socket";

import { Mic, Square } from "lucide-react";

export default function Recorder({ setTranscript, setLoading }) {
  const mediaRecorderRef = useRef(null);

  const mediaRecorderPackageRef = useRef(null);

  const audioChunksRef = useRef([]);

  const [recording, setRecording] = useState(false);

  const [language, setLanguage] = useState("en");

  // LOAD WAV RECORDER ONLY IN BROWSER
  useEffect(() => {
    const setupWavEncoder = async () => {
      const { MediaRecorder, register } =
        await import("extendable-media-recorder");

      const { connect } = await import("extendable-media-recorder-wav-encoder");

      await register(await connect());

      mediaRecorderPackageRef.current = MediaRecorder;
    };

    setupWavEncoder();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new mediaRecorderPackageRef.current(stream, {
        mimeType: "audio/wav",
      });

      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      // LIVE CHUNKS
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

      // FINAL TRANSCRIPT
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
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      // SEND CHUNK EVERY SECOND
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Mic className="text-indigo-500" />

        <h2 className="text-2xl font-semibold">Live Recorder</h2>
      </div>

      <p className="text-zinc-400 mb-6">
        Record audio directly from your microphone.
      </p>

      <div className="mb-6">
        <p className="text-sm text-zinc-400">
          Realtime captions are currently optimized for English.
        </p>
      </div>
      {!recording ? (
        <button
          onClick={startRecording}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Mic size={18} />
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Square size={18} />
          Stop Recording
        </button>
      )}
    </div>
  );
}
