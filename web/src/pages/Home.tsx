import { useState } from "react";
import { Logo } from '../shared/icons/Logo'
import { ScrollSplitHero } from '../features/landing/components/ScrollSplitHero'
import Typewriter from 'typewriter-effect'
import { useAuthStatus } from "../features/auth/hooks/useAuthStatus";
import { Alert } from "../shared/layout/Alert";
import { t } from "i18next";



function Home() {

  const { loading: authLoading, isAuthenticated } = useAuthStatus();
  const [showAuthNotice, setShowAuthNotice] = useState(true);
  
  return (
    <>

      {!authLoading && !isAuthenticated && showAuthNotice && (
        <Alert
          type="warning"
          title={t("auth.loginRequiredTitle")}
          message={t("auth.loginRequired")}
          actionLabel={t("auth.loginButton")}
          actionTo="/login"
          onClose={() => setShowAuthNotice(false)}
        />
      )}

      <section className="relative flex min-h-[100svh] items-center justify-center px-8 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
          <div className="mb-6 text-sm font-semibold uppercase tracking-[0.45em] text-lime-200 md:text-base">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('Challenge the Top,')
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString('Be the Top.')
                  .start()
              }}
            />
          </div>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white drop-shadow-[0_0_10px_rgba(192,132,252,0.25)] md:text-8xl xl:text-[10rem]">
            <span className="text-violet-700 drop-shadow-[0_0_10px_rgba(139,92,246,0.4)]">Made</span>4Gamers
          </h1>

          <div className="relative mt-8 inline-flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center [animation:spin_14s_linear_infinite]">
              <Logo className="h-80 w-auto text-fuchsia-400/55 blur-xl" />
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center [animation:pulse_3.8s_ease-in-out_infinite]">
              <Logo className="h-80 w-auto text-lime-300/70 blur-md" />
            </div>
            <Logo className="h-80 w-auto text-lime-200 drop-shadow-[0_0_28px_rgba(163,230,53,0.75)]" />
          </div>


          <svg
            viewBox="0 0 1200 260"
            className="mt-8 w-full max-w-5xl"
            role="img"
            aria-label="Decoración visual Made4Gamers"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="limeLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#bef264" stopOpacity="0" />
                <stop offset="20%" stopColor="#bef264" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#bef264" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#bef264" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="glow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="1200" height="260" fill="url(#glow)" />
            <path
              d="M20 170 C160 70, 340 250, 520 160 C700 70, 880 250, 1180 120"
              fill="none"
              stroke="url(#limeLine)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M20 200 C210 120, 360 240, 590 170 C820 100, 980 210, 1180 170"
              fill="none"
              stroke="url(#limeLine)"
              strokeWidth="2"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      <ScrollSplitHero
        direction="right"
        imageSrc="/assets/ps5.png"
        imageAlt="Producto"
        title={
          <h2 className="text-6xl font-black leading-tight text-white">
            Al igual que el mundo de los videjuegos evoluciona, en <br /> <span className="text-lime-200">Made</span>4Gamers tu podrás hacerlo.
          </h2>
        }
      />
      <ScrollSplitHero
        direction="left"
        imageSrc="/assets/ps3.png"
        imageAlt="Producto"
        title={
          <h2 className="text-6xl font-black leading-tight text-white">
            Comienza desde abajo, compite con gente de tu nivel y llega al<span className="text-lime-200"> Top</span>.
          </h2>
        }
      />
      <ScrollSplitHero
        direction="right"
        imageSrc="/assets/nintendo.png"
        imageAlt="Producto"
        title={
          <h2 className="text-6xl font-black leading-tight text-white">
            <span className="text-lime-200">EVOLUCIONA</span> y llegarás a ser el mejor.
          </h2>
        }
      />
    </>
  )
}

export default Home
