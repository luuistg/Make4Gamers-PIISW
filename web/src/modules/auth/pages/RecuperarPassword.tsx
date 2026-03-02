import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/core/config";
import { ROUTES } from "@/core/constants";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    if (!email || !email.includes("@")) {
      setMensaje({ tipo: "error", texto: "Por favor, introduce un email válido." });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/actualizar-password",
    });
    setIsLoading(false);
    if (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } else {
      setMensaje({ tipo: "exito", texto: "¡Correo enviado! Revisa tu bandeja de entrada o spam para restablecer tu contraseña." });
      setEmail("");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2a2e40] p-8 rounded-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-white mb-4 tracking-wide">Recuperar Contraseña</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Introduce tu correo y te enviaremos un enlace para crear una nueva contraseña.</p>
        {mensaje && (
          <div className={`mb-6 p-3 rounded-md text-sm text-center border ${mensaje.tipo === "error" ? "bg-red-900/30 border-red-500/50 text-red-400" : "bg-green-900/30 border-green-500/50 text-green-400"}`}>
            {mensaje.texto}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white-700 mb-1" htmlFor="email">Correo Electrónico</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1c29] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#615fff] focus:border-[#615fff] outline-none transition-all placeholder-gray-500"
              placeholder="Correo Electrónico" disabled={isLoading} />
          </div>
          <button type="submit" disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-bold tracking-wide transition-all ${isLoading ? "bg-[#615fff]/50 cursor-not-allowed" : "bg-[#615fff] hover:bg-[#4d4beb] active:transform active:scale-95 shadow-lg shadow-[#615fff]/20"}`}>
            {isLoading ? "Enviado" : "Enviar Enlace"}
          </button>
          <div className="text-center mt-4">
            <Link to={ROUTES.LOGIN} className="text-sm text-gray-400 hover:text-white transition-colors">Volver a Inicio de Sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
