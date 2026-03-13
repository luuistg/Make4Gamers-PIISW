import { X } from "lucide-react";
import { Link } from "react-router-dom";

type AlertType = "success" | "error" | "warning" | "info";

type AlertProps = {
  message: string;
  type?: AlertType;
  title?: string;
  onClose?: () => void;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
};

const stylesByType: Record<AlertType, { container: string; button: string }> = {
  success: {
    container:
      "border-emerald-400/40 from-emerald-500/20 to-emerald-700/10 text-emerald-100",
    button: "bg-emerald-400 hover:bg-emerald-300 text-slate-900",
  },
  error: {
    container:
      "border-rose-400/40 from-rose-500/20 to-rose-700/10 text-rose-100",
    button: "bg-rose-400 hover:bg-rose-300 text-slate-900",
  },
  warning: {
    container:
      "border-amber-400/40 from-amber-500/20 to-amber-700/10 text-amber-100",
    button: "bg-amber-400 hover:bg-amber-300 text-slate-900",
  },
  info: {
    container:
      "border-sky-400/40 from-sky-500/20 to-sky-700/10 text-sky-100",
    button: "bg-sky-400 hover:bg-sky-300 text-slate-900",
  },
};

export const Alert = ({
  message,
  type = "info",
  title,
  onClose,
  actionLabel,
  actionTo,
  onAction,
}: AlertProps) => {
  const palette = stylesByType[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 w-[26rem] max-w-[calc(100vw-2rem)] rounded-2xl border bg-gradient-to-br p-5 shadow-2xl backdrop-blur-md ${palette.container}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
          <p className="text-sm leading-relaxed">{message}</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-white/10"
            aria-label="Close alert"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {actionLabel && (actionTo || onAction) && (
        <div className="mt-4">
          {actionTo ? (
            <Link
              to={actionTo}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${palette.button}`}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${palette.button}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};