import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { Logo } from '@/core/components/icons';

export default function AuthHeader() {
    const { i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = useState(false);

    const changeLanguage = (lng: string): void => {
        i18n.changeLanguage(lng);
        setIsLangOpen(false);
    };

    const currentLang = i18n.language.split('-')[0].toUpperCase();

    return (
        <header className="relative z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 font-bold text-2xl">
                    <Logo className="h-8 w-8 text-indigo-500" />
                    <span className="tracking-tighter text-white">
                        Make<span className="text-indigo-500">4Gamers</span>
                    </span>
                </div>

                <div className="relative z-50">
                    <button onClick={() => setIsLangOpen(!isLangOpen)}
                        className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-sm font-medium">
                        <Globe size={18} />
                        <span>{currentLang}</span>
                        <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isLangOpen && (
                        <>
                            <div className="fixed inset-0 z-100" onClick={() => setIsLangOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-1 z-110">
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('es')}>
                                    <span>🇪🇸</span> Español
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('en')}>
                                    <span>🇬🇧</span> English
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('cn')}>
                                    <span>🇨🇳</span> 中文
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
