import toast, { Toaster } from "react-hot-toast";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiLoader,
  FiX,
} from "react-icons/fi";

export const AppToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      success: { iconTheme: { primary: "#34d399", secondary: "#0f172a" } },
      error: { iconTheme: { primary: "#fb7185", secondary: "#0f172a" } },
    }}
  >
    {(t) => (
      <div
        className="app-toast"
        data-visible={t.visible}
        data-type={t.type}
        role={t.type === "error" ? "alert" : "status"}
        aria-live={t.type === "error" ? "assertive" : "polite"}
      >
        <span className="app-toast-icon" aria-hidden="true">
          {t.type === "success" ? (
            <FiCheckCircle />
          ) : t.type === "error" ? (
            <FiAlertCircle />
          ) : t.type === "loading" ? (
            <FiLoader className="app-toast-spinner" />
          ) : (
            <FiInfo />
          )}
        </span>
        <div className="app-toast-copy">
          <span className="app-toast-title">
            {t.type === "success"
              ? "Success"
              : t.type === "error"
                ? "Action needed"
                : t.type === "loading"
                  ? "In progress"
                  : "Notice"}
          </span>
          <div className="app-toast-message">{t.message}</div>
        </div>
        <button
          type="button"
          className="app-toast-close"
          onClick={() => toast.dismiss(t.id)}
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
    )}
  </Toaster>
);
