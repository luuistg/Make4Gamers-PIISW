import { NewsCarousel } from "./NewsCarousel";
import { useAuthStatus } from '../../auth/hooks/useAuthStatus';
import GameCardRecomendation from "./GameCardRecomendation";
import { RecomendedGames } from "../constants/RecomendedGames";
import { NeonMarquee } from "./NeonMarquee";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { user } = useAuthStatus();
  const { t } = useTranslation();

  const displayName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email ||
    t("dashboard.userFallback");

  return (
    <>
      <section className="relative flex items-center justify-center px-6 pt-10 text-white">
        <div className="mx-auto w-full max-w-6xl text-center">
          <h1 className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-5xl xl:text-6xl">
            <span className="text-violet-500 drop-shadow-[0_0_6px_rgba(139,92,246,0.35)]">
              {t("dashboard.welcomePrefix")}
            </span>{" "}
            <span className="text-lime-300 drop-shadow-[0_0_6px_rgba(163,230,53,0.35)]">
              {displayName}
            </span>
          </h1>
          <div className="mx-auto mt-8 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-violet-400/60 to-transparent shadow-[0_0_12px_rgba(167,139,250,0.35)]" />
        </div>
      </section>

      <section className="relative mt-16"> 
      <NewsCarousel />
      </section>
      
      <section className="relative mt-24">
        <div className="w-full text-center">
            <NeonMarquee />
        </div>
      </section>

      <div className="min-h-screen p-6">
      {RecomendedGames.map((game) => (
        <GameCardRecomendation 
          key={game.id} // Siempre añade una key única al iterar
          title={game.title}
          description={game.description}
          videoSrc={game.videoSrc}
          gameUrl={game.gameUrl}
        />
      ))}
    </div>
    </>
  );
}