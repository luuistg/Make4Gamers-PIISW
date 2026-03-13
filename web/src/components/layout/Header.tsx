import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Globe, ChevronDown, User, LogOut } from 'lucide-react';
import { Logo } from '../icons/Logo';
import { logout } from '../../services/LogOutService';
import { useAuthStatus } from '../../services/session/notAuthenticated';
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { t, i18n } = useTranslation(); 
    const { isAuthenticated } = useAuthStatus();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const navigate = useNavigate();

    // Función para cambiar el idioma
    const changeLanguage = (lng: string): void => {
        i18n.changeLanguage(lng);
        setIsLangOpen(false);   
    };

    const currentLang = (i18n.language ?? 'es').split('-')[0].toUpperCase();

    const handleLogout = async () => {
        await logout();
        setIsProfileOpen(false);
        navigate("/login"); // con HashRouter -> .../#/login
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-indigo-500">
                    <Logo className="h-8 w-8" />
                    <span className="tracking-tighter text-white">Made<span className="text-indigo-500">4Gamers</span></span>
                </Link>

                {/* Desktop Nav - Usando t() para los textos */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link to="/juegos" className="hover:text-indigo-400 transition-colors">{t('nav.games')}</Link>
                    <Link to="/ranking" className="hover:text-indigo-400 transition-colors">{t('nav.ranking')}</Link>
                    <Link to="/chat" className="hover:text-indigo-400 transition-colors">{t('nav.chat')}</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Profile Dropdown / Login Button */}
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsLangOpen(false); }}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                                    <User size={16} />
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 hidden sm:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                                    <Link to="/cuenta" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                                        <User size={16} />
                                        <span>{t('nav.account')}</span>
                                    </Link>
                                    <div className="h-px bg-slate-800 my-1"></div>
                                    <button
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} />
                                        <span>{t('nav.logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            <span className="hidden sm:inline">{t('auth.login')}</span>
                        </Link>
                    )}

                    <button className="md:hidden p-2 text-slate-300">
                        <Menu size={24} />
                    </button>

                    {/* Language Selector */}
                    <div className="relative hidden sm:block">
                        <button
                            onClick={() => { setIsLangOpen(!isLangOpen); setIsProfileOpen(false); }}
                            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-sm font-medium"
                        >
                            <Globe size={18} />
                            <span>{currentLang}</span>
                            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-1 z-50">
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
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;