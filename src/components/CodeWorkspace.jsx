import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { FiTrash2 } from "react-icons/fi";
import { CopyButton } from "./CopyButton";

export const CodeWorkspace = ({ code, onChangeCode, onResetCode }) => {
  return (
    <section className="flex h-full min-h-0 flex-col border-r border-slate-800 bg-slate-950 p-5">
      {/* Editor Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Your Code or Problem
        </span>
        <div className="flex items-center gap-3">
          <CopyButton text={code} label="Input" />
          <button
            type="button"
            onClick={onResetCode}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400"
          >
            <FiTrash2 aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>

      <div className="code-editor flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <CodeMirror
          value={code}
          onChange={onChangeCode}
          extensions={[javascript()]}
          theme={oneDark}
          height="100%"
          aria-label="Code or problem statement"
          placeholder="Paste or write your problem statement, code, or both..."
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
          }}
        />
      </div>
    </section>
  );
};
