import { useEffect, useState } from "react";
import { AppToaster } from "../components/AppToaster.jsx";
import { CodeWorkspace } from "../components/CodeWorkspace";
import { HeaderBar } from "../components/HeaderBar";
import { HintPanel } from "../components/HintPanel";
import { useHintHistory } from "../hooks/useHintHistory";
import { useHintTask } from "../hooks/useHintTask";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { loadDraft, saveDraft } from "../utils/draftStorage.utils.js";

export default function App() {
  const [code, setCode] = useState(loadDraft);
  const [forceOffline, setForceOffline] = useState(false);
  const [activeResult, setActiveResult] = useState(null);
  
  const isOnline = useNetworkStatus();

  const { handleDeleteHistoryItem, handleOpenHistoryItem, history, userId } =
    useHintHistory(isOnline, setCode, setActiveResult);

  const { handleTriggerTask, loadingTask, nanoStatus } = useHintTask({
    code,
    forceOffline,
    isOnline,
    userId,
    setActiveResult,
  });

  useEffect(() => {
    saveDraft(code);
  }, [code]);

  const handleCodeChange = (nextCode) => {
    setCode(nextCode);
    setActiveResult(null);
  };

  const handleResetCode = () => {
    setCode("");
    setActiveResult(null);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <AppToaster />
      <HeaderBar
        forceOffline={forceOffline}
        onToggleOffline={() => setForceOffline((prev) => !prev)}
        telemetry={activeResult}
        nanoStatus={nanoStatus}
        isOnline={isOnline}
      />

      <main className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,25fr)_minmax(0,75fr)] sm:grid-rows-[minmax(0,35fr)_minmax(0,65fr)] lg:grid-cols-12 lg:grid-rows-1">
        <div className="min-h-0 lg:col-span-5">
          <CodeWorkspace
            code={code}
            onChangeCode={handleCodeChange}
            onResetCode={handleResetCode}
          />
        </div>

        <div className="min-h-0 lg:col-span-7">
          <HintPanel
            loadingTask={loadingTask}
            activeResult={activeResult}
            forceOffline={forceOffline}
            isOnline={isOnline}
            hasSubmission={Boolean(code.trim())}
            history={history}
            onOpenHistoryItem={handleOpenHistoryItem}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onTriggerTask={handleTriggerTask}
          />
        </div>
      </main>
    </div>
  );
}
