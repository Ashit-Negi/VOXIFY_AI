import { FileText } from "lucide-react";

export default function TranscriptBox({ transcript, loading }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-indigo-500" />

        <h2 className="text-2xl font-semibold">Transcript</h2>
      </div>

      {loading ? (
        <div className="text-zinc-400 animate-pulse">
          Generating AI transcript...
        </div>
      ) : (
        <p className="text-zinc-300 leading-8 whitespace-pre-wrap">
          {transcript || "Upload audio to generate transcript"}
        </p>
      )}
    </div>
  );
}
