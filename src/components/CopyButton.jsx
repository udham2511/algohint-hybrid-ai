import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";

export const CopyButton = ({ text, label }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard.`);
    } catch (error) {
      console.error(`Unable to copy ${label.toLowerCase()}:`, error);
      toast.error(`Unable to copy ${label.toLowerCase()}.`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className="inline-flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 transition hover:border-indigo-500 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <FiCopy aria-hidden="true" />
      Copy {label}
    </button>
  );
};
