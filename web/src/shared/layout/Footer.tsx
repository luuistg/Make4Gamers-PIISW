import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { Logo } from '../icons/Logo';
import { Twitter } from '../icons/Twitter';
import { Discord } from '../icons/Discord';
import { Twitch } from '../icons/Twitch';

const Footer = () => {
    const { t } = useTranslation(); 

    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                            <Logo className="h-8 w-8 text-indigo-500" />
                            <span className="text-white">Made4Gamers</span>
                        </Link>
                        <p className="text-slate-400 text-sm max-w-xs">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Links - Explorar */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('footer.explore.title')}</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/populares" className="hover:text-indigo-400">{t('footer.explore.popular')}</Link></li>
                            <li><Link to="/novedades" className="hover:text-indigo-400">{t('footer.explore.new')}</Link></li>
                            <li><Link to="/ofertas" className="hover:text-indigo-400">{t('footer.explore.offers')}</Link></li>
                        </ul>
                    </div>

                    {/* Soporte */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('footer.support.title')}</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/ayuda" className="hover:text-indigo-400">{t('footer.support.help')}</Link></li>
                            <li><Link to="/reembolsos" className="hover:text-indigo-400">{t('footer.support.refunds')}</Link></li>
                            <li><Link to="/contacto" className="hover:text-indigo-400">{t('footer.support.contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('footer.legal.title')}</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/privacidad" className="hover:text-indigo-400">{t('footer.legal.privacy')}</Link></li>
                            <li><Link to="/terminos" className="hover:text-indigo-400">{t('footer.legal.terms')}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 Made4Gamers Inc. {t('footer.rights')}</p>
                    <div className="flex gap-6">
                        <a href="https://twitter.com/made4gamers" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                            <Twitter className='h-4 w-4' />
                        </a>
                        <a href="https://discord.gg/made4gamers" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                            <Discord className='h-4 w-4' />
                        </a>
                        <a href="https://twitch.tv/made4gamers" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                            <Twitch className='h-4 w-4' />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;