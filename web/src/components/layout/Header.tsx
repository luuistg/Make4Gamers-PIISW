import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu } from 'lucide-react';

const Header = () => {
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
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar juegos..."
                            className="rounded-full bg-slate-900 py-1.5 pl-10 pr-4 text-sm border border-slate-800 focus:outline-none focus:border-indigo-500 transition-all w-64"
                        />
                    </div>
                    <button className="p-2 text-slate-300 hover:text-white relative">
                        <ShoppingCart size={22} />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-indigo-500 rounded-full"></span>
                    </button>
                    <button className="md:hidden p-2 text-slate-300">
                        <Menu size={24} />
                    </button>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20 cursor-pointer"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;