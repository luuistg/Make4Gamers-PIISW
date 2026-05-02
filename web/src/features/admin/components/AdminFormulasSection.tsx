import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase';
import { useNavigate } from 'react-router-dom';
import { Settings2, Save, Info, Check} from 'lucide-react';
import { getScoringSettings, updateScoringSetting } from '../services/settings.service';

export default function AdminFormulas() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      setLoading(true);
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      const user = session?.user;

      if (authError || !user) {
        navigate('/');
        return;
      }

     
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }

    
      const res = await getScoringSettings(supabase);
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (error) {
      console.error("Error validando admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, newValue: string) => {
    setSettings(settings.map(s => 
      s.setting_key === key ? { ...s, setting_value: newValue } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
     
      for (const setting of settings) {
        await updateScoringSetting(supabase, setting.setting_key, Number(setting.setting_value));
      }
      setMessage({ type: 'success', text: t('admin.formulasPage.success') });
      setTimeout(() => setMessage(null), 4000); 
    } catch (error) {
      setMessage({ type: 'error', text: t('admin.formulasPage.error') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white">
        <Settings2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

 
  const rankingMultiplier = Number(settings.find(s => s.setting_key === 'ranking_multiplier')?.setting_value || 1);
  const baseScore = Number(settings.find(s => s.setting_key === 'base_score')?.setting_value || 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
           
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{t('admin.formulasPage.title')}</h1>
            <p className="text-slate-400 mt-1">{t('admin.formulasPage.subtitle')}</p>
          </div>
        </div>

        {/* Mensaje de éxito/error */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            <Check size={20} />
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Simulador */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Info size={18} className="text-amber-400" /> {t('admin.formulasPage.previewTitle')}
          </h3>
          <p className="text-sm text-slate-400">
            {t('admin.formulasPage.previewText.beforeScore')} <strong className="text-white">{baseScore} {t('admin.formulasPage.points')}</strong>{' '}
            {t('admin.formulasPage.previewText.beforeMultiplier')} <strong className="text-indigo-400">x{rankingMultiplier}</strong>{' '}
            {t('admin.formulasPage.previewText.beforeTotal')} <strong className="text-green-400 text-lg">{Math.round(baseScore * rankingMultiplier)} {t('admin.formulasPage.points')}</strong>{' '}
            {t('admin.formulasPage.previewText.afterTotal')}
          </p>
        </div>

        {/* Lista de Configuraciones */}
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-1 uppercase tracking-wider text-sm">
                    {setting.setting_key.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-slate-500">{setting.description}</p>
                </div>
                
                <div className="w-full md:w-64 shrink-0">
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min={setting.setting_key.includes('multiplier') ? "0" : "10"} 
                      max={setting.setting_key.includes('multiplier') ? "5" : "5000"} 
                      step={setting.setting_key.includes('multiplier') ? "0.1" : "10"}
                      value={setting.setting_value}
                      onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                      className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <input 
                      type="number"
                      value={setting.setting_value}
                      onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Settings2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? t('admin.formulasPage.saving') : t('admin.formulasPage.saveApply')}
          </button>
        </div>

      </div>
    </div>
  );
}
