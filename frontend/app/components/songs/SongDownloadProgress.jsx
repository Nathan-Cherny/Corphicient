"use client";

const LABELS = {
  starting: "Starting download...",
  pending: "Starting download...",
  downloading: "Downloading",
  processing: "Converting to mp3...",
  done: "Download complete",
  error: "Download failed",
};

export default function SongDownloadProgress({ state }) {
  if (!state) return null;

  const percent = Math.min(100, Math.max(0, state.progress ?? 0));
  const failed = state.status === "error";
  // Converting has no measurable progress, so show a full bar rather than a stuck one
  const showPercent = state.status === "downloading";

  return (
    <section
      className="flex flex-col gap-2 rounded-xl border border-sky-200 bg-white p-5 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between text-sm font-medium text-sky-900">
        <span>{LABELS[state.status] ?? state.status}</span>
        {showPercent && <span>{Math.round(percent)}%</span>}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-sky-100">
        <div
          className={`h-full rounded-full transition-all duration-200 ${
            failed ? "bg-red-400" : "bg-[#c98f66]"
          } ${state.status === "processing" ? "animate-pulse" : ""}`}
          style={{ width: `${failed ? 100 : percent}%` }}
        />
      </div>
      {failed && state.message && (
        <p className="text-sm text-red-700">{state.message}</p>
      )}
    </section>
  );
}
