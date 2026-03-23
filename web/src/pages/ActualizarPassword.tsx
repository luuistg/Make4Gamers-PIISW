import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, KeyRound, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  recoverSessionWithOtpToken,
  recoverSessionWithTokens,
  updatePassword,
} from "../../../packages/api/src";
import AuthHeader from "../features/auth/components/AuthHeader";
import { supabase } from "../supabase";

type UiMessage = { tipo: "exito" | "error"; texto: string } | null;

type RecoveryParams = {
  tokenHash: string | null;
  type: string | null;
  accessToken: string | null;
  refreshToken: string | null;
};

function parseRecoveryParams(): RecoveryParams {
  const fromSearch = new URLSearchParams(window.location.search);
  const hashValue = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  const hashSegments: string[] = [];

  if (hashValue.includes("?")) {
    hashSegments.push(hashValue.slice(hashValue.indexOf("?") + 1));
  }

  if (hashValue.includes("access_token=")) {
    hashSegments.push(hashValue.slice(hashValue.indexOf("access_token=")));
  }

  if (hashValue.includes("#")) {
    const secondHash = hashValue.slice(hashValue.lastIndexOf("#") + 1);
    hashSegments.push(secondHash);
  }

  const fromHash = new URLSearchParams(hashSegments.join("&"));

  return {
    tokenHash: fromSearch.get("token_hash") ?? fromHash.get("token_hash"),
    type: fromSearch.get("type") ?? fromHash.get("type"),
    accessToken: fromSearch.get("access_token") ?? fromHash.get("access_token"),
    refreshToken: fromSearch.get("refresh_token") ?? fromHash.get("refresh_token"),
  };
}

export default function ActualizarPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState<UiMessage>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  const recoveryParams = useMemo(() => parseRecoveryParams(), []);

  useEffect(() => {
    let isMounted = true;

    async function ensureRecoverySession() {
      try {
        if (recoveryParams.tokenHash && recoveryParams.type === "recovery") {
          const { error } = await recoverSessionWithOtpToken(
            supabase,
            recoveryParams.tokenHash,
            "recovery",
          );
          if (error) throw error;

          if (isMounted) {
            setSessionReady(true);
          }
          window.history.replaceState({}, document.title, "/#/actualizar-password");
          return;
        }

        if (recoveryParams.accessToken && recoveryParams.refreshToken) {
          const { error } = await recoverSessionWithTokens(
            supabase,
            recoveryParams.accessToken,
            recoveryParams.refreshToken,
          );
          if (error) throw error;

          if (isMounted) {
            setSessionReady(true);
          }
          window.history.replaceState({}, document.title, "/#/actualizar-password");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setSessionReady(Boolean(session));
          if (!session) {
            setMensaje({
              tipo: "error",
              texto:
                  t("auth.updatePassword.invalidOrExpiredLink") ||
                  "Este enlace de recuperación no es válido o ha expirado. Solicita uno nuevo.",
            });
          }
        }
      } catch (error) {
        if (isMounted) {
            const message =
              error instanceof Error
                ? error.message
                : t("auth.updatePassword.validateLinkError") ||
                  "No se pudo validar el enlace de recuperación.";
          setMensaje({ tipo: "error", texto: message });
          setSessionReady(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    ensureRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [recoveryParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (password.length < 8) {
      setMensaje({
        tipo: "error",
        texto:
          t("auth.updatePassword.minLength") ||
          "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMensaje({
        tipo: "error",
        texto: t("auth.updatePassword.mismatch") || "Las contraseñas no coinciden.",
      });
      return;
    }

    if (!sessionReady) {
      setMensaje({
        tipo: "error",
        texto:
          t("auth.updatePassword.sessionNotActive") ||
          "Tu sesión de recuperación no está activa. Vuelve a solicitar el enlace.",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await updatePassword(supabase, password);

    setIsLoading(false);

    if (error) {
      setMensaje({ tipo: "error", texto: error.message });
      return;
    }

    setMensaje({
      tipo: "exito",
      texto:
        t("auth.updatePassword.success") ||
        "Contraseña actualizada correctamente. Te redirigimos al login.",
    });

    setPassword("");
    setConfirmPassword("");

    window.setTimeout(() => {
      navigate("/login");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl transition-all duration-300">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              {t("auth.updatePassword.title") || "Actualizar contraseña"}
            </h1>
            <p className="text-slate-400 text-center mb-8 text-sm">
              {t("auth.updatePassword.subtitle") ||
                "Define una nueva contraseña segura para tu cuenta."}
            </p>

            {mensaje && (
              <div
                className={`mb-6 p-3 rounded-lg text-sm border flex items-start gap-2 ${
                  mensaje.tipo === "error"
                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                }`}
              >
                {mensaje.tipo === "error" ? (
                  <AlertCircle size={18} className="mt-0.5" />
                ) : (
                  <CheckCircle2 size={18} className="mt-0.5" />
                )}
                <span>{mensaje.texto}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
                  {t("auth.updatePassword.newPasswordLabel") || "Nueva contraseña"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    placeholder={t("auth.updatePassword.newPasswordPlaceholder") || "Mínimo 8 caracteres"}
                    disabled={isLoading || isCheckingSession}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="confirmPassword">
                  {t("auth.updatePassword.confirmPasswordLabel") || "Confirmar contraseña"}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    placeholder={t("auth.updatePassword.confirmPasswordPlaceholder") || "Repite la contraseña"}
                    disabled={isLoading || isCheckingSession}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isCheckingSession || !sessionReady}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isCheckingSession
                  ? t("auth.updatePassword.validating") || "Validando enlace..."
                  : isLoading
                    ? t("auth.updatePassword.updating") || "Actualizando..."
                    : t("auth.updatePassword.save") || "Guardar nueva contraseña"}
              </button>

              <p className="text-center text-slate-400 text-sm">
                {t("auth.updatePassword.needAnotherLink") || "¿Necesitas solicitar otro enlace?"}{" "}
                <Link to="/recuperar-password" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  {t("auth.updatePassword.backToRecover") || "Volver a recuperar contraseña"}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
