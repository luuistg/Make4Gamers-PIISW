import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            es: {
                translation: {
                    nav: {
                    games: "Juegos",
                    ranking: "Ranking",
                    chat: "Chat",
                    account: "Cuenta",
                    logout: "Cerrar sesión"
                    },
                    footer: {
                    description: "La plataforma definitiva para descubrir, jugar y compartir tus experiencias de juego favoritas.",
                    rights: "Todos los derechos reservados.",
                    explore: {
                        title: "Explorar",
                        popular: "Populares",
                        new: "Novedades",
                        offers: "Ofertas"
                    },
                    support: {
                        title: "Soporte",
                        help: "Ayuda",
                        refunds: "Reembolsos",
                        contact: "Contacto"
                    },
                    legal: {
                        title: "Legal",
                        privacy: "Privacidad",
                        terms: "Términos"
                    }
                    },
                    home: {
                        popular: "Juegos Populares",
                        search: "Buscar juegos...",
                        allGames: "Todos los Juegos",
                        noResults: "No se encontraron juegos",
                        filters: {
                            category: "Categoría",
                            price: "Precio",
                            all: "Todos",
                            action: "Acción",
                            adventure: "Aventura",
                            rpg: "RPG",
                            strategy: "Estrategia",
                            sports: "Deportes",
                            free: "Gratis",
                            under20: "Menos de 20€",
                            under50: "Menos de 50€",
                            premium: "Premium"
                        },
                        players: "jugadores"
                    }
                }
            },
            en: {
                translation: {
                    nav: {
                        games: "Games",
                        ranking: "Ranking",
                        chat: "Chat",
                        account: "Account",
                        logout: "Sign Out"
                    },
                    footer: {
                        description: "The ultimate platform to discover, play and share your favorite gaming experiences.",
                        rights: "All rights reserved.",
                        explore: {
                            title: "Explore",
                            popular: "Popular",
                            new: "New",
                            offers: "Offers"
                        },
                        support: {
                            title: "Support",
                            help: "Help",
                            refunds: "Refunds",
                            contact: "Contact"
                        },
                        legal: {
                            title: "Legal",
                            privacy: "Privacy",
                            terms: "Terms"
                        }
                    },
                    home: {
                        popular: "Popular Games",
                        search: "Search games...",
                        allGames: "All Games",
                        noResults: "No games found",
                        filters: {
                            category: "Category",
                            price: "Price",
                            all: "All",
                            action: "Action",
                            adventure: "Adventure",
                            rpg: "RPG",
                            strategy: "Strategy",
                            sports: "Sports",
                            free: "Free",
                            under20: "Under $20",
                            under50: "Under $50",
                            premium: "Premium"
                        },
                        players: "players"
                    }
                }
            },
            cn: {
                translation: {
                    nav: {
                        games: "游戏",
                        ranking: "排行榜",
                        chat: "聊天",
                        account: "账户",
                        logout: "退出登录"
                    },
                    footer: {
                        description: "发现、玩耍和分享您最喜爱的游戏体验的终极平台。",
                        rights: "版权所有。",
                        explore: {
                            title: "探索",
                            popular: "热门",
                            new: "新品",
                            offers: "优惠"
                        },
                        support: {
                            title: "支持",
                            help: "帮助",
                            refunds: "退款",
                            contact: "联系"
                        },
                        legal: {
                            title: "法律",
                            privacy: "隐私",
                            terms: "条款"
                        }
                    },
                    home: {
                        popular: "热门游戏",
                        search: "搜索游戏...",
                        allGames: "所有游戏",
                        noResults: "未找到游戏",
                        filters: {
                            category: "类别",
                            price: "价格",
                            all: "全部",
                            action: "动作",
                            adventure: "冒险",
                            rpg: "角色扮演",
                            strategy: "策略",
                            sports: "体育",
                            free: "免费",
                            under20: "20元以下",
                            under50: "50元以下",
                            premium: "高级"
                        },
                        players: "玩家"
                    }
                }
            }
        },
        fallbackLng: "es",
        interpolation: { escapeValue: false }
    });

export default i18n;