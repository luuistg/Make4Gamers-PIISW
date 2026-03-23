import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GameRules from '../features/games/components/GameRules';
import { getGameById } from '../features/games/services/getGameById.service'; // ajusta ruta/nombre real
import { useTranslation } from 'react-i18next';

type RulesNavState = {
  game?: {
    id: string;
    title?: string;
    rules_markdown_url?: string | null;
  };
};

export default function GameRulesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navState = (location.state as RulesNavState | null)?.game;

  const [rulesUrl, setRulesUrl] = useState(navState?.rules_markdown_url ?? '');
  const [title, setTitle] = useState(t("gameplay.rulesTitle"));
  const [loadingMeta, setLoadingMeta] = useState(!navState?.rules_markdown_url);
  const [metaError, setMetaError] = useState<string | null>(null);

  useEffect(() => {
    if (navState?.rules_markdown_url) return;
    if (!id) return;

    const loadRulesUrl = async () => {
      setLoadingMeta(true);
      setMetaError(null);

      try {
        const game = await getGameById(id); // servicio de dominio
        if (!game?.manual_url) throw new Error('URL de reglas no disponible');

        setTitle(game.title ?? 'Reglas del juego');
        setRulesUrl(game.manual_url);
      } catch (err) {
        console.error(err);
        setMetaError('No se pudieron cargar las reglas del juego.');
      } finally {
        setLoadingMeta(false);
      }
    };

    loadRulesUrl();
  }, [id, navState?.rules_markdown_url]);

  return (
    <section className="relative min-h-[100svh] px-4 py-12 text-white">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-violet-400/20 bg-slate-900/70 p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-xl font-extrabold md:text-2xl">{title}</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-violet-400/35 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-200"
          >
            {t("gameplay.backButton")}
          </button>
        </div>

        {loadingMeta && <p className="text-slate-300">Cargando...</p>}
        {metaError && <p className="text-rose-300">{metaError}</p>}
        {!loadingMeta && !metaError && rulesUrl && <GameRules markdownUrl={rulesUrl} />}
      </div>
    </section>
  );
}