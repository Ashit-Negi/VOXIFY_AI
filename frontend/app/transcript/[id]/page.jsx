"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import API from "@/utils/api";

import TranscriptDetails from "@/components/transcript/TranscriptDetails";

export default function TranscriptPage() {
  const params = useParams();

  const [transcript, setTranscript] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranscript();
  }, []);

  const fetchTranscript = async () => {
    try {
      const { data } = await API.get(`/api/transcribe/${params.id}`);

      setTranscript(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-zinc-400">Loading transcript...</p>;
  }

  if (!transcript) {
    return <p className="text-red-500">Transcript not found</p>;
  }

  return <TranscriptDetails transcript={transcript} />;
}
