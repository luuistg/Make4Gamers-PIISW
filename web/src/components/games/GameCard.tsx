import { Users, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GameCardProps {
    id: number;
    title: string;
    category: string;
    players: number;
    rating: number;
    image: string;
}

const GameCard = ({ title, category, players, rating, image }: GameCardProps) => {
    const { t } = useTranslation();

    return (
        <div className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer">
            {/* Imagen */}
            <div className="relative h-48 overflow-hidden bg-slate-800">
                <img 
                    src={image} 
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-white">{rating}</span>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white text-lg line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h3>
                </div>

                <p className="text-sm text-slate-400 mb-3">{category}</p>

                <div className="flex items-center gap-1 text-slate-400">
                    <Users size={16} />
                    <span className="text-sm">{players.toLocaleString()} {t('home.players')}</span>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
