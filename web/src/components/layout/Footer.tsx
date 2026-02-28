import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                            <span className="text-white">Make4Gamers</span>
                        </Link>
                        <p className="text-slate-400 text-sm max-w-xs">
                            La plataforma definitiva para descubrir, jugar y compartir tus experiencias de juego favoritas.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Explorar</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/populares" className="hover:text-indigo-400">Populares</Link></li>
                            <li><Link to="/novedades" className="hover:text-indigo-400">Novedades</Link></li>
                            <li><Link to="/ofertas" className="hover:text-indigo-400">Ofertas</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Soporte</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/ayuda" className="hover:text-indigo-400">Ayuda</Link></li>
                            <li><Link to="/reembolsos" className="hover:text-indigo-400">Reembolsos</Link></li>
                            <li><Link to="/contacto" className="hover:text-indigo-400">Contacto</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/privacidad" className="hover:text-indigo-400">Privacidad</Link></li>
                            <li><Link to="/terminos" className="hover:text-indigo-400">Términos</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 Make4Gamers Inc. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-indigo-200">Twitter</a>
                        <a href="#" className="hover:text-indigo-200">Discord</a>
                        <a href="#" className="hover:text-indigo-200">Twitch</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;