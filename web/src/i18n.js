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
                        noMovesYet: "Sin movimientos aún."
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
                        noMovesYet: "No moves yet."
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
                        noMovesYet: "暂无操作记录。"
                    }
                }
            }
        },
        fallbackLng: "es",
        interpolation: { escapeValue: false }
    });

export default i18n;