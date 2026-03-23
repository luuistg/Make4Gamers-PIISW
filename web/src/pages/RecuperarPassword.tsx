import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { requestPasswordReset } from "../../../packages/api/src";
import AuthHeader from "../features/auth/components/AuthHeader";
import { supabase } from "../supabase";

export default function RecuperarPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordResetRedirectTo = `${window.location.origin}/#/actualizar-password`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMensaje({ tipo: "error", texto: t("auth.recoverPassword.invalidEmail") || "Por favor, introduce un email válido." });
      return;
    }

    setIsLoading(true);

    const { error } = await requestPasswordReset(supabase, email, passwordResetRedirectTo);

    setIsLoading(false);

    if (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } else {
      setMensaje({ 
        tipo: "exito", 
        texto: t("auth.recoverPassword.success") || "¡Correo enviado! Revisa tu bandeja de entrada o spam para restablecer tu contraseña." 
      });
      setEmail("");
    }
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
            <h1 className="text-3xl font-bold text-white mb-2 text-center">{t("auth.recoverPassword.title") || "Recuperar contraseña"}</h1>
            <p className="text-slate-400 text-center mb-8 text-sm">
              {t("auth.recoverPassword.subtitle") || "Introduce tu correo y te enviaremos un enlace para restablecerla."}
            </p>

            {mensaje && (
              <div
                className={`mb-6 p-3 rounded-lg text-sm border flex items-start gap-2 ${
                  mensaje.tipo === "error"
                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                }`}
              >
                {mensaje.tipo === "error" ? <AlertCircle size={18} className="mt-0.5" /> : <CheckCircle2 size={18} className="mt-0.5" />}
                <span>{mensaje.texto}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">
                  {t("auth.recoverPassword.emailLabel") || "Correo electrónico"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    placeholder={t("auth.recoverPassword.emailPlaceholder") || "tu@email.com"}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading
                  ? t("auth.recoverPassword.sending") || "Enviando..."
                  : t("auth.recoverPassword.send") || "Enviar enlace"}
              </button>

              <p className="text-center text-slate-400 text-sm">
                {t("auth.recoverPassword.remembered") || "¿Recordaste tu contraseña?"}{" "}
                <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  {t("auth.recoverPassword.backToLogin") || "Volver al login"}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}