import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";
import { FiMaximize2, FiMinimize2, FiTrash2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cleanMarkdown } from "../utils/formatMarkdown.utils";
import { CopyButton } from "./CopyButton";

const HIGHLIGHT_LANGUAGES = {
  javascript,
  js: javascript,
  typescript,
  ts: typescript,
  json,
  python,
  py: python,
};

const LOCAL_ACTIONS = [
  {
    id: "CONCEPT_NUDGE",
    label: "💡 1. Concept Nudge",
    sub: "Pattern & data structure clue",
  },
  {
    id: "COMPLEXITY_CHECK",
    label: "⏱️ 2. Complexity Check",
    sub: "Spot Big-O bottlenecks",
  },
  {
    id: "EDGE_CASE_GUARD",
    label: "🛡️ 3. Edge Case Guard",
    sub: "Catch subtle loop bugs",
  },
];

export const HintPanel = ({
  loadingTask,
  activeResult,
  forceOffline,
  isOnline,
  hasSubmission,
  history,
  onOpenHistoryItem,
  onDeleteHistoryItem,
  onTriggerTask,
}) => {
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);

  useEffect(() => {
    if (!isOutputExpanded) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOutputExpanded(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOutputExpanded]);

  return (
    <section className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto bg-slate-950 p-4 sm:gap-5 sm:p-5">
      {/* Section 1: On-Device Local Hints */}
      <div className="shrink-0">
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            <span className="sm:hidden">Local Hints</span>
            <span className="hidden sm:inline">
              Step 1 · Zero-Spoiler Local Hints (On-Device Nano / Auto-Fallback)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
          {LOCAL_ACTIONS.map((action) => (
            <button
              key={action.id}
              disabled={Boolean(loadingTask) || !hasSubmission}
              onClick={() => onTriggerTask(action.id)}
              className="flex min-w-0 flex-col items-start rounded-xl border border-slate-800 bg-slate-900 p-2 text-left transition hover:border-emerald-500/50 hover:bg-slate-800/80 disabled:opacity-50 sm:p-3"
            >
              <span className="text-xs font-semibold text-white sm:text-sm">
                {loadingTask === action.id ? "Thinking..." : action.label}
              </span>
              <span className="mt-1 hidden text-[10px] leading-tight text-slate-400 sm:block sm:text-xs">
                {action.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Cloud Gemini Deep Analysis */}
      <div className="shrink-0">
        <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-sky-400">
          <span className="sm:hidden">Cloud Post-Mortem</span>
          <span className="hidden sm:inline">
            Step 2 · Heavy Reasoning & Test Suite (Cloud Gemini)
          </span>
        </h3>
        <button
          disabled={
            Boolean(loadingTask) || forceOffline || !isOnline || !hasSubmission
          }
          onClick={() => onTriggerTask("CLOUD_POSTMORTEM")}
          className="flex w-full items-center justify-between rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-left transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div>
            <div className="text-sm font-semibold text-sky-200">
              {loadingTask === "CLOUD_POSTMORTEM"
                ? "Generating Edge Cases & Complexity Analysis..."
                : "🚀 Generate 5 Adversarial Edge Cases & Post-Mortem"}
            </div>
            <div className="hidden text-xs text-sky-300/70 sm:block">
              {forceOffline
                ? "Disabled while Offline Mode is toggled ON"
                : !isOnline
                  ? "Unavailable without an internet connection"
                  : "Routes to Cloud Gemini for multi-step stress testing & follow-ups"}
            </div>
          </div>
          <span className="rounded-md bg-sky-500/20 px-2.5 py-1 font-mono text-xs text-sky-300">
            ONLY_IN_CLOUD
          </span>
        </button>
      </div>

      {/* Active AI Response Card */}
      <div
        className={`flex min-h-0 flex-col rounded-xl border border-slate-800 bg-slate-900/90 p-4 ${
          isOutputExpanded
            ? "fixed inset-3 z-50 shadow-2xl"
            : activeResult
              ? "relative min-h-56 flex-1"
              : "relative flex-none"
        }`}
      >
        <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Coach Output
          </span>
          <div className="flex items-center gap-3">
            {activeResult && (
              <>
                <span className="font-mono text-xs text-slate-400">
                  {activeResult.executionSource} · {activeResult.latencyMs}ms
                </span>
                <CopyButton text={activeResult.text} label="Output" />
                <button
                  type="button"
                  onClick={() => setIsOutputExpanded((expanded) => !expanded)}
                  aria-expanded={isOutputExpanded}
                  aria-controls="coach-output-content"
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 transition hover:border-indigo-500 hover:text-indigo-300"
                >
                  <span className="inline-flex items-center gap-1">
                    {isOutputExpanded ? (
                      <FiMinimize2 aria-hidden="true" />
                    ) : (
                      <FiMaximize2 aria-hidden="true" />
                    )}
                    {isOutputExpanded ? "Collapse" : "Expand"}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {activeResult ? (
          <div
            id="coach-output-content"
            className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto text-sm leading-relaxed text-slate-200"
          >
            <div
              id="coach-output-content"
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto text-sm leading-loose text-slate-200"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                  rehypeKatex,
                  [
                    rehypeHighlight,
                    { detect: true, languages: HIGHLIGHT_LANGUAGES },
                  ],
                ]}
                components={{
                  p: ({ children }) => (
                    <p className="my-3 leading-loose text-slate-200">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="mt-7 mb-3 border-b border-slate-700 pb-2 text-xl font-bold text-white first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mt-6 mb-2.5 border-b border-slate-800 pb-1.5 text-lg font-semibold text-white first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-5 mb-2 text-base font-semibold text-indigo-200 first:mt-0">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-3 list-disc space-y-2.5 pl-6 [&_ul]:my-2 [&_ul]:space-y-2 [&_ol]:my-2 [&_ol]:space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-3 list-decimal space-y-2.5 pl-6 [&_ul]:my-2 [&_ul]:space-y-2 [&_ol]:my-2 [&_ol]:space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-loose text-slate-200 [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 border-l-2 border-indigo-400 pl-4 text-slate-400 [&>p]:my-0">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="my-4 overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full border-collapse text-left text-xs">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border-b border-slate-700 bg-slate-800/80 px-3.5 py-2.5 font-semibold text-slate-100">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border-b border-slate-800 px-3.5 py-2.5 text-slate-300 [&>p]:my-0">
                      {children}
                    </td>
                  ),
                  code: ({ className, children }) => {
                    const isBlock = Boolean(className);
                    return isBlock ? (
                      <pre className="my-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs">
                        <code className={className}>{children}</code>
                      </pre>
                    ) : (
                      <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                        {children}
                      </code>
                    );
                  },
                  hr: () => <hr className="my-5 border-slate-800" />,
                }}
              >
                {cleanMarkdown(activeResult.text)}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Click any hint button above to analyze your code locally with Gemini
            Nano, or run a Cloud Post-Mortem for edge-case stress tests.
          </p>
        )}
      </div>

      {/* Firestore activity history */}
      <div className="shrink-0 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent Hint Activity (Firestore · {history.length})
        </div>
        <p className="mb-2 text-xs text-slate-500">
          When signed in, your submission and coach response are saved to your
          account so you can reopen them. Delete entries here to remove them.
        </p>
        <div className="max-h-32 space-y-1.5 overflow-y-auto text-xs">
          {history.length ? (
            history.map((item, idx) => {
              const canOpen =
                typeof item.userCode === "string" &&
                typeof item.coachOutput === "string";

              return (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-2 rounded-lg bg-slate-950/70 px-2.5 py-1.5 text-slate-300"
                >
                  <button
                    type="button"
                    disabled={!canOpen}
                    onClick={() => onOpenHistoryItem(item)}
                    title={
                      canOpen
                        ? "Restore this submission and coach response"
                        : "This older entry contains activity metadata only"
                    }
                    className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="truncate">
                      <strong className="text-indigo-300">
                        {item.taskType}
                      </strong>{" "}
                      · {item.executionSource}
                      {!canOpen && " · Older activity"}
                    </span>
                    <span className="shrink-0 font-mono text-slate-500">
                      {item.latencyMs}ms
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="shrink-0 rounded px-1.5 py-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
                    aria-label={`Delete ${item.taskType} activity`}
                    title="Delete this activity"
                  >
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="py-1 text-slate-500">
              Your recent hint activity will appear here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
