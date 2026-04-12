import { useTranslation } from "react-i18next";

export const NeonMarquee = () => {
  const { t } = useTranslation();

  const items = [
    { text: t("dashboard.marquee.play"), icon: "/assets/nintendo.png" },
    { text: t("dashboard.marquee.chat"), icon: "/assets/nintendo.png" },
    { text: t("dashboard.marquee.compete"), icon: "/assets/nintendo.png" },
    { text: t("dashboard.marquee.climb"), icon: "/assets/nintendo.png" },
    { text: t("dashboard.marquee.play"), icon: "/assets/nintendo.png" },
    { text: t("dashboard.marquee.chat"), icon: "/assets/nintendo.png" },
    { text: t("dashboard.marquee.compete"), icon: "/assets/nintendo.png" },
    { text: t("dashboard.marquee.climb"), icon: "/assets/nintendo.png" },
  ];

  // Duplicamos los elementos para el loop infinito
  const doubleItems = [...items, ...items];

  return (
    <div className="relative flex overflow-x-hidden bg-violet-700 py-4 shadow-[0_0_30px_rgba(88,101,242,0.4)] border-y border-white/10">
      {/* Usamos la animación definida en el CSS */}
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {doubleItems.map((item, index) => (
          <div key={`${item.text}-${index}`} className="flex items-center mx-10">
            <span className="text-white text-4xl font-black italic tracking-tighter uppercase">
              {item.text}
            </span>

            <img
              src={item.icon}
              alt={item.text}
              className="ml-10 mr-10 h-8 w-8 object-contain md:h-16 md:w-16"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};