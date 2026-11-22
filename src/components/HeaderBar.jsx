import { FiCpu, FiGlobe, FiWifi, FiWifiOff } from "react-icons/fi";

export const HeaderBar = ({
  forceOffline,
  onToggleOffline,
  telemetry,
  nanoStatus,
  isOnline,
}) => {
  const badgeStyles = {
    "on-device": "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    "cloud-fallback": "bg-amber-500/15 text-amber-300 border-amber-500/40",
    cloud: "bg-sky-500/15 text-sky-300 border-sky-500/40",
    error: "bg-rose-500/15 text-rose-300 border-rose-500/40",
    idle: "bg-slate-800 text-slate-400 border-slate-700",
  };

  const badgeLabels = {
    "on-device": "⚡ On-Device · Gemini Nano",
    "cloud-fallback": "☁️ Auto-Fallback · Cloud Gemini",
    cloud: "☁️ Deep Reasoning · Cloud Gemini",
    error: "⚠️ Execution Notice",
    idle: `Nano Status: ${nanoStatus}`,
  };

  const currentSource = telemetry?.executionSource || "idle";
  const nanoLabels = {
    "checking...": "Checking...",
    available: "Available",
    downloadable: "Download required",
    downloading: "Downloading",
    unavailable: "Unavailable",
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/90 px-6 py-3.5">
      {/* Brand */}
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold tracking-wider text-white">
            HYBRID AI
          </span>
          <h1 className="text-lg font-bold text-white">AlgoHint</h1>
        </div>
      </div>

      {/* Telemetry Pill + Offline Simulator */}
      <div className="flex items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              isOnline
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-300"
            }`}
          >
            {isOnline ? (
              <FiWifi aria-hidden="true" />
            ) : (
              <FiWifiOff aria-hidden="true" />
            )}
            {isOnline ? "Internet: Online" : "Internet: Offline"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-300">
            <FiCpu aria-hidden="true" />
            Nano: {nanoLabels[nanoStatus] || nanoStatus}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium ${badgeStyles[currentSource]}`}
        >
          <span>{badgeLabels[currentSource]}</span>
          {telemetry?.latencyMs != null && (
            <span className="border-l border-current/30 pl-2 font-mono">
              {telemetry.latencyMs}ms
            </span>
          )}
        </div>

        <button
          onClick={onToggleOffline}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            forceOffline
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
              : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          title="Force ONLY_ON_DEVICE mode to simulate studying offline"
        >
          <span className="inline-flex items-center gap-1.5">
            {forceOffline ? (
              <FiWifiOff aria-hidden="true" />
            ) : (
              <FiGlobe aria-hidden="true" />
            )}
            {forceOffline
              ? "Offline Mode: ON (Local Only)"
              : "Hybrid Mode: Auto"}
          </span>
        </button>
      </div>
    </header>
  );
};
