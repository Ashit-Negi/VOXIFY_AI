import { FileText } from "lucide-react";

export default function TranscriptBox({ transcript, loading, liveTranscript }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-8 min-h-[250px] md:min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-indigo-500" />

        <h2 className="text-xl md:text-2xl font-semibold">Transcript</h2>
      </div>

      {loading ? (
        <div className="text-zinc-400 animate-pulse">
          Generating AI transcript...
        </div>
      ) : (
        <div className="max-h-[350px] overflow-y-auto">
          <p className="text-zinc-300 leading-7 md:leading-8 whitespace-pre-wrap text-sm md:text-base">
            {liveTranscript ||
              transcript ||
              "Start speaking to see live transcript"}
          </p>
        </div>
      )}
    </div>
  );
}
