export const SITE_NAME = "Make4Gamers";
export const SITE_URL = "https://make4gamers.com";

export const SUPPORTED_LANGUAGES = ["es", "en", "cn"] as const;

export const HREFLANG_MAP: Record<(typeof SUPPORTED_LANGUAGES)[number], string> = {
  es: "es",
  en: "en",
  cn: "zh-CN",
};

export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/og-cover.jpg`;
