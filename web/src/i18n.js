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
                    auth: {
                        login: "Iniciar sesión",
                        register: "Registrarse",
                        email: "Correo electrónico",
                        password: "Contraseña",
                        confirmPassword: "Confirmar contraseña",
                        fullName: "Nombre completo",
                        username: "Nombre de usuario",
                        loginButton: "Iniciar sesión",
                        registerButton: "Crear cuenta",
                        noAccount: "¿No tienes cuenta?",
                        haveAccount: "¿Ya tienes cuenta?",
                        loginLink: "Inicia sesión",
                        registerLink: "Regístrate",
                        forgotPassword: "¿Olvidaste tu contraseña?",
                        rememberMe: "Recuérdame",
                        or: "o",
                        continueWithGoogle: "Continuar con Google",
                        errors: {
                            emailRequired: "El correo es obligatorio",
                            invalidEmail: "El correo no es válido",
                            passwordRequired: "La contraseña es obligatoria",
                            passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
                            passwordMismatch: "Las contraseñas no coinciden",
                            nameRequired: "El nombre es obligatorio",
                            usernameRequired: "El nombre de usuario es obligatorio"
                        },
                        loginRequiredTitle: "Inicia sesión",
                        loginRequired: "Inicia sesión para guardar progreso y acceder a todas las funciones."
                    },
                    game: {
                        popular: "Juegos Populares",
                        search: "Buscar juegos...",
                        allGames: "Todos los Juegos",
                        noResults: "No se encontraron juegos",
                        filters: {
                            category: "Categoría",
                            all: "Todos",
                            action: "Acción",
                            arcade: "Arcade",
                            rpg: "RPG",
                            puzzle: "Puzle"
                        },
                        players: "jugadores",
                        filtersLabel: "Filtros:",
                        gamesCount: "juegos"
                    },
                    genres: {
                        arcade: "Arcade",
                        action: "Acción",
                        rpg: "RPG",
                        puzzle: "Puzle"
                    },
                    gameplay: {
                        loading: "Cargando juego...",
                        notFound: "No se encontró el juego.",
                        noGenre: "Sin género",
                        viewRanking: "Ver ranking",
                        myScore: "Mi score",
                        chat: "Chat",
                        history: "Historial",
                        noMessages: "Sin mensajes todavía.",
                        writeMessage: "Escribe un mensaje...",
                        send: "Enviar",
                        noMovesRequired: "Este juego no requiere historial de movimientos.",
                        noMovesYet: "Sin movimientos aún.",
                        backToGames: "Volver a juegos"
                    },
                    home: {
                        splitHero: {
                            one: {
                                imageAlt: "Producto",
                                prefix: "A medida que el mundo gaming evoluciona, en",
                                brand: "Made",
                                suffix: "4Gamers tú también puedes hacerlo."
                            },
                            two: {
                                imageAlt: "Producto",
                                prefix: "Empieza desde abajo, compite con jugadores de tu nivel y alcanza la",
                                highlight: "Cima"
                            },
                            three: {
                                imageAlt: "Producto",
                                highlight: "EVOLUCIONA",
                                suffix: " y te convertirás en el mejor."
                            }
                        },
                        ranks: {
                            title: "Escala en nuestra clasificación",
                            firstButton: "Comenzar  ➜"
                        }
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
                    auth: {
                        login: "Sign In",
                        register: "Sign Up",
                        email: "Email",
                        password: "Password",
                        confirmPassword: "Confirm Password",
                        fullName: "Full Name",
                        username: "Username",
                        loginButton: "Sign In",
                        registerButton: "Create Account",
                        noAccount: "Don't have an account?",
                        haveAccount: "Already have an account?",
                        loginLink: "Sign in here",
                        registerLink: "Sign up here",
                        forgotPassword: "Forgot your password?",
                        rememberMe: "Remember me",
                        or: "or",
                        continueWithGoogle: "Continue with Google",
                        errors: {
                            emailRequired: "Email is required",
                            invalidEmail: "Email is invalid",
                            passwordRequired: "Password is required",
                            passwordTooShort: "Password must be at least 6 characters",
                            passwordMismatch: "Passwords don't match",
                            nameRequired: "Name is required",
                            usernameRequired: "Username is required"
                        },
                        loginRequiredTitle: "Sign in",
                        loginRequired: "Sign in to save progress and access all features."
                    },
                    game: {
                        popular: "Popular Games",
                        search: "Search games...",
                        allGames: "All Games",
                        noResults: "No games found",
                        filters: {
                            category: "Category",
                            all: "All",
                            action: "Action",
                            arcade: "Arcade",
                            rpg: "RPG",
                            puzzle: "Puzzle"
                        },
                        players: "players",
                        filtersLabel: "Filters:",
                        gamesCount: "games"
                    },
                    genres: {
                        arcade: "Arcade",
                        action: "Action",
                        rpg: "RPG",
                        puzzle: "Puzzle"
                    },
                    gameplay: {
                        loading: "Loading game...",
                        notFound: "Game not found.",
                        noGenre: "No genre",
                        viewRanking: "View ranking",
                        myScore: "My score",
                        chat: "Chat",
                        history: "History",
                        noMessages: "No messages yet.",
                        writeMessage: "Write a message...",
                        send: "Send",
                        noMovesRequired: "This game does not require move history.",
                        noMovesYet: "No moves yet.",
                        backToGames: "Back to games"
                    },
                    home: {
                        splitHero: {
                            one: {
                                imageAlt: "Product",
                                prefix: "As the gaming world evolves, in",
                                brand: "Made",
                                suffix: "4Gamers you can do it too."
                            },
                            two: {
                                imageAlt: "Product",
                                prefix: "Start from the bottom, compete with players at your level and reach the",
                                highlight: "Top"
                            },
                            three: {
                                imageAlt: "Product",
                                highlight: "EVOLVE",
                                suffix: " and you will become the best."
                            }
                        },
                        ranks: {
                            title: "Climb our ranking",
                            firstButton: "Start ➜"
                        }
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
                    auth: {
                        login: "登录",
                        register: "注册",
                        email: "电子邮件",
                        password: "密码",
                        confirmPassword: "确认密码",
                        fullName: "全名",
                        username: "用户名",
                        loginButton: "登录",
                        registerButton: "创建账户",
                        noAccount: "没有账户？",
                        haveAccount: "已有账户？",
                        loginLink: "在这里登录",
                        registerLink: "在这里注册",
                        forgotPassword: "忘记密码？",
                        rememberMe: "记住我",
                        or: "或",
                        continueWithGoogle: "使用Google继续",
                        errors: {
                            emailRequired: "电子邮件是必需的",
                            invalidEmail: "电子邮件无效",
                            passwordRequired: "密码是必需的",
                            passwordTooShort: "密码至少需要6个字符",
                            passwordMismatch: "密码不匹配",
                            nameRequired: "名称是必需的",
                            usernameRequired: "用户名是必需的"
                        },
                        loginRequiredTitle: "请登录",
                        loginRequired: "登录后可保存进度并访问所有功能。"
                    },
                    game: {
                        popular: "热门游戏",
                        search: "搜索游戏...",
                        allGames: "所有游戏",
                        noResults: "未找到游戏",
                        filters: {
                            category: "类别",
                            all: "全部",
                            action: "动作",
                            arcade: "街机",
                            rpg: "角色扮演",
                            puzzle: "益智"
                        },
                        players: "玩家",
                        filtersLabel: "筛选:",
                        gamesCount: "游戏"
                    },
                    genres: {
                        arcade: "街机",
                        action: "动作",
                        rpg: "角色扮演",
                        puzzle: "益智"
                    },
                    gameplay: {
                        loading: "正在加载游戏...",
                        notFound: "未找到游戏。",
                        noGenre: "无类型",
                        viewRanking: "查看排行榜",
                        myScore: "我的分数",
                        chat: "聊天",
                        history: "历史记录",
                        noMessages: "暂无消息。",
                        writeMessage: "输入消息...",
                        send: "发送",
                        noMovesRequired: "该游戏不需要操作历史。",
                        noMovesYet: "暂无操作记录。",
                        backToGames: "返回游戏列表"
                    },
                    home: {
                        splitHero: {
                            one: {
                                imageAlt: "产品",
                                prefix: "正如游戏世界不断进化，在",
                                brand: "Made",
                                suffix: "4Gamers 你也可以做到。"
                            },
                            two: {
                                imageAlt: "产品",
                                prefix: "从底部开始，与同级玩家竞争并冲向",
                                highlight: "巅峰"
                            },
                            three: {
                                imageAlt: "产品",
                                highlight: "进化",
                                suffix: "，你将成为最强。"
                            }
                        },
                        ranks: {
                            title: "提升我们的排名",
                            firstButton: "开始 ➜"
                        }
                    }
                }
            }
        },
        fallbackLng: "es",
        interpolation: { escapeValue: false }
    });

export default i18n;