import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, Globe, ChevronDown, User, LogOut } from 'lucide-react';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-indigo-500">
                    <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                    <span className="tracking-tighter text-white">Make<span className="text-indigo-500">4Gamers</span></span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link to="/juegos" className="hover:text-indigo-400 transition-colors">Juegos</Link>
                    <Link to="/ranking" className="hover:text-indigo-400 transition-colors">Ranking</Link>
                    <Link to="/chat" className="hover:text-indigo-400 transition-colors">Chat</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Profile Dropdown */}
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
                                    <span>Cuenta</span>
                                </Link>
                                <div className="h-px bg-slate-800 my-1"></div>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors" onClick={() => setIsProfileOpen(false)}>
                                    <LogOut size={16} />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        )}
                    </div>

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
                            <span>ES</span>
                            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setIsLangOpen(false)}>
                                    <span>🇪🇸</span> Español
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setIsLangOpen(false)}>
                                    <span>🇬🇧</span> English
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setIsLangOpen(false)}>
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