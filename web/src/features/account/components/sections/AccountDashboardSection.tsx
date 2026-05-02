import { useTranslation } from 'react-i18next';
import { Trophy, Star, ChevronRight, Save } from 'lucide-react';
import UserAvatar from '../../../../shared/components/UserAvatar';
import { 
  getTierForScore, 
  getGlobalTier, 
  calculateLazyGlobalScore,
  getGlobalProgress,
  getGameProgress
} from '../../../progression/services/progression.service';

type ProfileSummary = {
  username: string | null;
  avatar_url: string | null;
  role?: string | null;
  location?: string | null;
  subscription_tier?: string | null;
};

type HighScoreEntry = {
  displayTitle: string;
  score: number;
};

type AccountDashboardSectionProps = {
  profile: ProfileSummary;
  highScores: HighScoreEntry[];
};


const getGlobalControllerData = (tier: string) => {
  const basePath = '/assets';
  switch(tier) {
    case 'Hierro': return { name: 'Iniciado', image: `${basePath}/hierro.png`, color: 'text-slate-400', bgClass: 'bg-slate-400', glowClass: 'shadow-[0_0_15px_rgba(148,163,184,0.6)]' };
    case 'Bronce': return { name: 'Bronce', image: `${basePath}/bronce.png`, color: 'text-orange-400', bgClass: 'bg-orange-400', glowClass: 'shadow-[0_0_15px_rgba(251,146,60,0.6)]' };
    case 'Plata': return { name: 'Plata', image: `${basePath}/plata.png`, color: 'text-slate-200', bgClass: 'bg-slate-200', glowClass: 'shadow-[0_0_15px_rgba(226,232,240,0.6)]' };
    case 'Oro': return { name: 'Oro', image: `${basePath}/oro.png`, color: 'text-yellow-400', bgClass: 'bg-yellow-400', glowClass: 'shadow-[0_0_15px_rgba(250,204,21,0.6)]' };
    case 'Obsidiana': return { name: 'Obsidiana', image: `${basePath}/obsidiana.png`, color: 'text-fuchsia-400', bgClass: 'bg-fuchsia-400', glowClass: 'shadow-[0_0_15px_rgba(232,121,249,0.6)]' };
    default: return { name: 'Iniciado', image: `${basePath}/hierro.png`, color: 'text-slate-500', bgClass: 'bg-slate-500', glowClass: 'shadow-[0_0_15px_rgba(100,116,139,0.6)]' };
  }
};

const getGameControllerData = (tier: string) => {
  const basePath = '/assets/emblems';
  switch(tier) {
    case 'SNES': return { name: 'SNES', image: `${basePath}/nintendoEmblem.png`, color: 'text-slate-400', glow: 'shadow-slate-500/40', border: 'hover:border-slate-500/50', bgClass: 'bg-slate-400' };
    case 'PS1': return { name: 'PS1', image: `${basePath}/ps1Emblem.png`, color: 'text-orange-400', glow: 'shadow-orange-500/40', border: 'hover:border-orange-500/50', bgClass: 'bg-orange-400' };
    case 'PS3': return { name: 'PS3', image: `${basePath}/ps3Emblem.png`, color: 'text-slate-200', glow: 'shadow-slate-300/50', border: 'hover:border-slate-300/50', bgClass: 'bg-slate-200' };
    case 'PS4': return { name: 'PS4', image: `${basePath}/ps4Emblem.png`, color: 'text-yellow-400', glow: 'shadow-yellow-500/50', border: 'hover:border-yellow-500/50', bgClass: 'bg-yellow-400' };
    case 'PS5': return { name: 'PS5', image: `${basePath}/ps5Emblem.png`, color: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/60', border: 'hover:border-fuchsia-500/50', bgClass: 'bg-fuchsia-400' };
    default: return { name: 'SNES', image: `${basePath}/nintendoEmblem.png`, color: 'text-slate-500', glow: 'shadow-slate-500/20', border: 'hover:border-slate-500/50', bgClass: 'bg-slate-500' };
  }
};
export function AccountDashboardSection({ profile, highScores }: AccountDashboardSectionProps) {
  const { t } = useTranslation();
  

  const globalScore = calculateLazyGlobalScore(highScores || []);
  const globalTier = getGlobalTier(globalScore);
  const globalEmblem = getGlobalControllerData(globalTier);
  const progress = getGlobalProgress(globalScore);

  return (
    <section className="space-y-6 w-full pb-8">
      
      <div className="relative w-full overflow-hidden bg-slate-950 border border-slate-700/50 rounded-[2.5rem] p-5 sm:p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e515_1px,transparent_1px),linear-gradient(to_bottom,#4f46e515_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-[80px]"></div>
        <div className={`absolute bottom-0 left-10 w-64 h-64 ${globalEmblem.color} opacity-20 blur-[60px] rounded-full bg-current`}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full min-w-0">
          
          <div className="relative group shrink-0">
            <div className={`absolute inset-0 blur-[40px] opacity-40 bg-current ${globalEmblem.color}`}></div>
            <img 
              src={globalEmblem.image} 
              alt={globalEmblem.name} 
              className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            />
          </div>

          <div className="text-center md:text-left space-y-4 flex-1 min-w-0 w-full overflow-hidden">
            <div>
               <span className="inline-block px-3 sm:px-4 py-1.5 bg-slate-900/80 text-slate-300 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] border border-slate-700 backdrop-blur-sm">
                 Rango de Plataforma
               </span>
               <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter ${globalEmblem.color} italic break-all md:break-words w-full mt-2`}>
                 {globalEmblem.name}
               </h2>
               <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                 <Star className="text-yellow-500 shrink-0" size={20} fill="currentColor" />
                 <p className="text-white text-lg sm:text-xl font-bold truncate">
                   {globalScore} <span className="text-slate-400 text-xs sm:text-sm font-normal">Puntos Globales</span>
                 </p>
               </div>
            </div>

            <p className="text-slate-400 text-sm max-w-lg mx-auto md:mx-0">
               Juega a más juegos y mejora tus récords para subir tu Rango Global. ¡Cada punto cuenta para desbloquear el siguiente mando!
            </p>

            <div className="max-w-md mx-auto md:mx-0 w-full bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-inner mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                   {progress.isMaxLevel ? (
                     <Trophy size={12} className="text-fuchsia-400" />
                   ) : (
                     <ChevronRight size={12} className={globalEmblem.color} />
                   )}
                  {progress.isMaxLevel ? 'Nivel Máximo Alcanzado' : `Siguiente: ${progress.nextTierName}`}
                </span>
                {!progress.isMaxLevel && (
                  <span className="text-[10px] font-bold text-white bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Faltan {progress.pointsNeeded} pts
                  </span>
                )}
              </div>

              {/* Contenedor de la barra */}
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 relative shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]">
     
                 <div 
                   className={`h-full rounded-full transition-all duration-1000 ease-out ${globalEmblem.bgClass} ${globalEmblem.glowClass}`}
                   style={{ width: `${progress.percentage}%` }}
                 ></div>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-[10px]">
                <span className={`font-bold ${globalEmblem.color}`}>{globalEmblem.name}</span>
                {!progress.isMaxLevel && (
                  <span className="font-bold text-slate-500">
                     Siguiente rango a los {progress.nextTierThreshold} pts
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl w-full">
        <UserAvatar src={profile.avatar_url} name={profile.username} size={80} />
        <div className="flex-1 text-center sm:text-left min-w-0 w-full">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-white text-2xl font-bold truncate">
              {profile.username || t('account.dashboard.defaultUser')}
            </h3>

            {profile.subscription_tier === 'premium' && (
              <span title="Usuario Premium" className="flex items-center">
                <Save 
                  size={24} 
                  className="text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] shrink-0 animate-pulse" 
                />
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0"><Trophy size={24} /></div>
          <h3 className="text-xl font-bold text-white truncate">Récords por Juego</h3>
        </div>

        {highScores && highScores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        
            {highScores.map((record, index) => {
              const tier = getTierForScore(record.displayTitle, record.score);
              const consoleEmblem = getGameControllerData(tier);
              
             
              const progress = getGameProgress(record.displayTitle, record.score);

              return (
             
                <div key={index} className="group relative bg-slate-900 border border-slate-700/50 rounded-2xl p-4 flex flex-col hover:border-indigo-500/50 transition-colors overflow-hidden h-full">
                  
                 
                  <div className="flex justify-between items-start mb-2 flex-shrink-0">
                    <span className="font-bold text-white group-hover:text-indigo-400 truncate">{record.displayTitle}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-950/50 rounded-lg ${consoleEmblem.color}`}>{consoleEmblem.name}</span>
                  </div>

         
                  <div className="relative w-full h-24 flex items-center justify-center mb-4 mt-2 flex-shrink-0">
                    <div className={`absolute w-20 h-20 rounded-full blur-[40px] opacity-20 ${consoleEmblem.glow} bg-current ${consoleEmblem.color}`}></div>
                    <img src={consoleEmblem.image} className="relative z-10 h-full object-contain group-hover:scale-110 transition-all duration-500" alt="rank" />
                  </div>

           
                  <div className="text-center w-full mb-5 flex-shrink-0">
                    <span className="text-3xl font-black text-white tracking-tighter">{record.score}</span>
                    <span className="text-indigo-400 text-xs font-bold uppercase ml-1">PTS</span>
                  </div>

                
                  <div className="mt-auto pt-3 border-t border-slate-800/50 w-full flex-shrink-0">
                    <div className="flex justify-between items-end mb-1.5 overflow-visible">
                      <span className="text-[10px] text-slate-400 font-medium tracking-wider whitespace-nowrap">
                        {progress.nextTierName === 'MAX' ? 'NIVEL MÁXIMO' : `HACIA ${progress.nextTierName}`}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">
                        {progress.pointsNeeded > 0 ? `${progress.pointsNeeded} pts rest.` : 'MAX'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner border border-slate-800">
                      <div 
                        className={`h-full rounded-full ${consoleEmblem.bgClass} transition-all duration-1000 ease-out`}
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                </div>
              );
            })}
           
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/30 border-dashed">
            <Trophy size={48} className="mx-auto text-slate-600 mb-3 opacity-50" />
            <p className="text-slate-400">Aún no tienes récords. ¡Juega para subir tu Nivel Global!</p>
          </div>
        )}
      </div>
    </section>
  );
}