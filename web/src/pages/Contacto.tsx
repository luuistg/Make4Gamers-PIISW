import { useState, type FormEvent } from 'react';
import { Send, MessageSquare, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function Contacto() {
  const [category, setCategory] = useState('Idea/Mejora');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("Debes iniciar sesión para enviar una sugerencia.");
      }

      // Guardar en la BBDD
      const { error: insertError } = await supabase
        .from('suggestions')
        .insert([
          {
            user_id: user.id,
            category: category,
            content: content
          }
        ]);

      if (insertError) throw insertError;

      setFeedback({ type: 'success', message: '¡Gracias! Tu mensaje ha sido enviado al equipo de desarrollo.' });
      setContent('');
      
    } catch (error: any) {
      console.error("Error al enviar sugerencia:", error);
      setFeedback({ type: 'error', message: error.message || 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <MessageSquare size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Buzón de Sugerencias</h1>
            <p className="text-slate-400 mt-1">Ayúdanos a mejorar Make4Gamers con tus ideas o reportando fallos.</p>
          </div>
        </div>

        {feedback && (
          <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <p>{feedback.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
              ¿Qué tipo de mensaje es?
            </label>
            <select 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Idea/Mejora">Tengo una idea o sugerencia de mejora</option>
              <option value="Bug/Error">He encontrado un error</option>
              <option value="Duda/Soporte">Necesito ayuda con la plataforma</option>
              <option value="Otro">Otro tema</option>
            </select>
          </div>

          {/* Área de Texto */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
              Detalles de tu mensaje
            </label>
            <textarea 
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              placeholder="Explícanos con detalle..."
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            ></textarea>
          </div>
          
          {/* Enviar */}
          <button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              'Enviando...'
            ) : (
              <>
                <Send size={18} />
                Enviar Mensaje
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}