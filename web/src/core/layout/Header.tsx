import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Globe, ChevronDown, User, LogOut } from 'lucide-react';
import { Logo } from '@/core/components/icons';
import { logout } from '@/modules/auth/services';
import { ROUTES } from '@/core/constants';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const changeLanguage = (lng: string): void => {
        i18n.changeLanguage(lng);
        setIsLangOpen(false);
    };

    const currentLang = i18n.language.split('-')[0].toUpperCase();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-2xl text-indigo-500">
                    <Logo className="h-8 w-8" />
                    <span className="tracking-tighter text-white">Make<span className="text-indigo-500">4Gamers</span></span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link to={ROUTES.GAMES} className="hover:text-indigo-400 transition-colors">{t('nav.games')}</Link>
                    <Link to={ROUTES.RANKING} className="hover:text-indigo-400 transition-colors">{t('nav.ranking')}</Link>
                    <Link to={ROUTES.CHAT} className="hover:text-indigo-400 transition-colors">{t('nav.chat')}</Link>
                </nav>

                <div className="flex items-center gap-4">
                    {/* Menú desplegable de perfil */}
                    <div className="relative">
                        <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsLangOpen(false); }}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                                <User size={16} />
                            </div>
                            <ChevronDown size={14} className={`text-slate-400 hidden sm:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                                <Link to={ROUTES.ACCOUNT} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                                    <User size={16} /><span>{t('nav.account')}</span>
                                </Link>
                                <div className="h-px bg-slate-800 my-1"></div>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors" onClick={() => { logout(); setIsProfileOpen(false); }}>
                                    <LogOut size={16} /><span>{t('nav.logout')}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="md:hidden p-2 text-slate-300"><Menu size={24} /></button>

                    {/* Selector de idioma */}
                    <div className="relative hidden sm:block">
                        <button onClick={() => { setIsLangOpen(!isLangOpen); setIsProfileOpen(false); }}
                            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-sm font-medium">
                            <Globe size={18} /><span>{currentLang}</span>
                            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('es')}>🇪🇸 Español</button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('en')}>🇬🇧 English</button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('cn')}>🇨🇳 中文</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
