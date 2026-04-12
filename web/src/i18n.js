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
                        loginRequired: "Inicia sesión para guardar progreso y acceder a todas las funciones.",
                        recoverPassword: {
                            title: "Recuperar contraseña",
                            subtitle: "Introduce tu correo y te enviaremos un enlace para restablecerla.",
                            emailLabel: "Correo electrónico",
                            emailPlaceholder: "tu@email.com",
                            invalidEmail: "Por favor, introduce un email válido.",
                            success: "¡Correo enviado! Revisa tu bandeja de entrada o spam para restablecer tu contraseña.",
                            sending: "Enviando...",
                            send: "Enviar enlace",
                            remembered: "¿Recordaste tu contraseña?",
                            backToLogin: "Volver al login"
                        },
                        updatePassword: {
                            title: "Actualizar contraseña",
                            subtitle: "Define una nueva contraseña segura para tu cuenta.",
                            newPasswordLabel: "Nueva contraseña",
                            newPasswordPlaceholder: "Mínimo 8 caracteres",
                            confirmPasswordLabel: "Confirmar contraseña",
                            confirmPasswordPlaceholder: "Repite la contraseña",
                            invalidOrExpiredLink: "Este enlace de recuperación no es válido o ha expirado. Solicita uno nuevo.",
                            validateLinkError: "No se pudo validar el enlace de recuperación.",
                            minLength: "La contraseña debe tener al menos 8 caracteres.",
                            mismatch: "Las contraseñas no coinciden.",
                            sessionNotActive: "Tu sesión de recuperación no está activa. Vuelve a solicitar el enlace.",
                            success: "Contraseña actualizada correctamente. Te redirigimos al login.",
                            validating: "Validando enlace...",
                            updating: "Actualizando...",
                            save: "Guardar nueva contraseña",
                            needAnotherLink: "¿Necesitas solicitar otro enlace?",
                            backToRecover: "Volver a recuperar contraseña"
                        }
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
                        backToGames: "Volver a juegos",
                        rules: "Reglas",
                        rulesTitle: "Reglas del juego",
                        rulesLoading: "Cargando reglas...",
                        rulesError: "No se pudieron cargar las reglas.",
                        backButton: "Volver"
                    },

                    ranking: {
                        currentSeason: "Temporada Actual",
                        title: "Ranking Global",
                        subtitle: "Asciende de liga en liga hasta alcanzar el nivel Ray-Tracing.",
                        selectGame: "Selecciona un juego",
                        unknownGame: "Juego Desconocido",
                        noScoresTitle: "Aún no hay puntuaciones",
                        noScoresDesc: "¡Sé el primero en jugar y corona el Top 1!",
                        you: "(Tú)",
                        colPos: "Pos",
                        colPlayer: "Jugador",
                        colTier: "Liga / Rango",
                        colScore: "Puntuación",
                        yourPosition: "Tu posición actual",
                        keepPlaying: "Sigue jugando para subir de liga"
                    },


                    chat: {
                        unauthorizedTitle: "¡Alto ahí!",
                        unauthorizedDesc: "Para poder chatear con otros usuarios y acceder a tus mensajes privados, necesitas iniciar sesión en tu cuenta.",
                        loginButton: "Ir a Iniciar Sesión",
                        myStatus: "Mi estado:",
                        status: {
                            online: "Disponible",
                            away: "Ausente",
                            busy: "Ocupado",
                            offline: "Invisible",
                            disconnected: "Desconectado"
                        },
                        messagesTitle: "Mensajes",
                        addFriendTooltip: "Añadir amigo",
                        selectFriend: "Selecciona un amigo de la lista para empezar a chatear.",
                        errorLoading: "Hubo un error al preparar el chat. Inténtalo de nuevo.",
                        breakIce: "¡Rompe el hielo!",
                        firstMessage: "Envía el primer mensaje a {{name}}.", 
                        placeholder: "Escribe un mensaje a {{name}}..."
                    },
                    home: {
                        splitHero: {
                            one: {
                                imageAlt: "Producto",
                                prefix: "As el mundo gaming evoluciona, en",
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
                                highlight: "COMPITE, PRACTICA",
                                suffix: " y llegarás a ser el mejor."
                            }
                        },
                        ranks: {
                            title: "Escala en nuestra clasificación",
                            firstButton: "Comenzar  ➜"
                        }
                    },
                    dashboard: {
                        welcomePrefix: "Bienvenido,",
                        userFallback: "Jugador",
                        marquee: {
                            play: "JUEGA",
                            chat: "CHATEA",
                            compete: "COMPITE",
                            climb: "ESCALA"
                        }
                    },
                    seo: {
                        default: {
                            title: "Plataforma de videojuegos",
                            description: "Make4Gamers es tu plataforma para descubrir juegos, competir en rankings y conectar con la comunidad gamer."
                        },
                        home: {
                            title: "Inicio",
                            description: "Descubre Make4Gamers, mejora tus habilidades y conecta con jugadores de tu nivel."
                        },
                        games: {
                            title: "Juegos",
                            description: "Explora el catalogo de juegos, aplica filtros y encuentra tu proximo reto en Make4Gamers."
                        },
                        ranking: {
                            title: "Ranking",
                            description: "Consulta la clasificacion y sube posiciones compitiendo en Make4Gamers."
                        },
                        login: {
                            title: "Iniciar sesion",
                            description: "Accede a tu cuenta de Make4Gamers para guardar progreso y usar funciones sociales."
                        },
                        register: {
                            title: "Registro",
                            description: "Crea tu cuenta en Make4Gamers y empieza a competir con la comunidad."
                        },
                        recoverPassword: {
                            title: "Recuperar contrasena",
                            description: "Restablece tu contrasena de forma segura para volver a tu cuenta Make4Gamers."
                        },
                        chat: {
                            title: "Chat",
                            description: "Habla con tus amigos y coordina partidas desde el chat de Make4Gamers."
                        },
                        account: {
                            title: "Cuenta",
                            description: "Gestiona tu perfil, preferencias y datos de cuenta en Make4Gamers."
                        },
                        gameplay: {
                            title: "Partida",
                            description: "Juega y mejora tus resultados en Make4Gamers con seguimiento de puntuacion."
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

                    ranking: {
                        currentSeason: "Current Season",
                        title: "Global ranking",
                        subtitle: "Climb from tier to tier until you reach Ray-Tracing level.",
                        selectGame: "Select a game",
                        unknownGame: "Unknown Game",
                        noScoresTitle: "No scores yet",
                        noScoresDesc: "Be the first to play and claim the Top 1!",
                        you: "(You)",
                        colPos: "Pos",
                        colPlayer: "Player",
                        colTier: "Tier / League",
                        colScore: "Score",
                        yourPosition: "Your current position",
                        keepPlaying: "Keep playing to rank up"
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
                        loginRequired: "Sign in to save progress and access all features.",
                        recoverPassword: {
                            title: "Recover password",
                            subtitle: "Enter your email and we will send you a link to reset it.",
                            emailLabel: "Email",
                            emailPlaceholder: "you@email.com",
                            invalidEmail: "Please enter a valid email.",
                            success: "Email sent! Check your inbox or spam folder to reset your password.",
                            sending: "Sending...",
                            send: "Send link",
                            remembered: "Remembered your password?",
                            backToLogin: "Back to login"
                        },
                        updatePassword: {
                            title: "Update password",
                            subtitle: "Set a new secure password for your account.",
                            newPasswordLabel: "New password",
                            newPasswordPlaceholder: "At least 8 characters",
                            confirmPasswordLabel: "Confirm password",
                            confirmPasswordPlaceholder: "Repeat your password",
                            invalidOrExpiredLink: "This recovery link is invalid or has expired. Please request a new one.",
                            validateLinkError: "The recovery link could not be validated.",
                            minLength: "Password must be at least 8 characters long.",
                            mismatch: "Passwords do not match.",
                            sessionNotActive: "Your recovery session is not active. Request a new link.",
                            success: "Password updated successfully. Redirecting you to login.",
                            validating: "Validating link...",
                            updating: "Updating...",
                            save: "Save new password",
                            needAnotherLink: "Need another link?",
                            backToRecover: "Back to recover password"
                        }
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
                        backToGames: "Back to games",
                        rules: "Rules",
                        rulesTitle: "Game Rules",
                        rulesLoading: "Loading rules...",
                        rulesError: "Could not load rules.",
                        backButton: "Back"
                    },
                    chat: {
                        unauthorizedTitle: "Hold on!",
                        unauthorizedDesc: "To chat with other users and access your private messages, you need to sign in to your account.",
                        loginButton: "Go to Sign In",
                        myStatus: "My status:",
                        status: {
                            online: "Online",
                            away: "Away",
                            busy: "Busy",
                            offline: "Invisible",
                            disconnected: "Offline"
                        },
                        messagesTitle: "Messages",
                        addFriendTooltip: "Add friend",
                        selectFriend: "Select a friend from the list to start chatting.",
                        errorLoading: "There was an error setting up the chat. Please try again.",
                        breakIce: "Break the ice!",
                        firstMessage: "Send the first message to {{name}}.",
                        placeholder: "Write a message to {{name}}..."
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
                                highlight: "COMPETE, PRACTICE",
                                suffix: " and you will become the best."
                            }
                        },
                        ranks: {
                            title: "Climb our ranking",
                            firstButton: "Start ➜"
                        }
                    },
                    dashboard: {
                        welcomePrefix: "Welcome,",
                        userFallback: "Player",
                        marquee: {
                            play: "PLAY",
                            chat: "CHAT",
                            compete: "COMPETE",
                            climb: "CLIMB"
                        }
                    },
                    seo: {
                        default: {
                            title: "Gaming platform",
                            description: "Make4Gamers helps you discover games, climb rankings, and connect with the gaming community."
                        },
                        home: {
                            title: "Home",
                            description: "Discover Make4Gamers, level up your skills, and connect with players at your level."
                        },
                        games: {
                            title: "Games",
                            description: "Browse the game catalog, apply filters, and find your next challenge on Make4Gamers."
                        },
                        ranking: {
                            title: "Ranking",
                            description: "Check the leaderboard and climb positions by competing on Make4Gamers."
                        },
                        login: {
                            title: "Sign in",
                            description: "Access your Make4Gamers account to save progress and use social features."
                        },
                        register: {
                            title: "Sign up",
                            description: "Create your Make4Gamers account and start competing with the community."
                        },
                        recoverPassword: {
                            title: "Recover password",
                            description: "Reset your password securely to get back into your Make4Gamers account."
                        },
                        chat: {
                            title: "Chat",
                            description: "Talk with friends and coordinate matches in the Make4Gamers chat."
                        },
                        account: {
                            title: "Account",
                            description: "Manage your profile, preferences, and account data on Make4Gamers."
                        },
                        gameplay: {
                            title: "Match",
                            description: "Play and improve your scores with match tracking on Make4Gamers."
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
                        loginRequired: "登录后可保存进度并访问所有功能。",
                        recoverPassword: {
                            title: "找回密码",
                            subtitle: "输入你的邮箱，我们会发送一个重置链接。",
                            emailLabel: "电子邮箱",
                            emailPlaceholder: "you@email.com",
                            invalidEmail: "请输入有效的邮箱地址。",
                            success: "邮件已发送！请检查收件箱或垃圾邮件以重置密码。",
                            sending: "发送中...",
                            send: "发送链接",
                            remembered: "想起密码了？",
                            backToLogin: "返回登录"
                        },
                        updatePassword: {
                            title: "更新密码",
                            subtitle: "为你的账户设置一个新的安全密码。",
                            newPasswordLabel: "新密码",
                            newPasswordPlaceholder: "至少 8 个字符",
                            confirmPasswordLabel: "确认密码",
                            confirmPasswordPlaceholder: "再次输入密码",
                            invalidOrExpiredLink: "该恢复链接无效或已过期，请重新申请。",
                            validateLinkError: "无法验证恢复链接。",
                            minLength: "密码至少需要 8 个字符。",
                            mismatch: "两次输入的密码不一致。",
                            sessionNotActive: "恢复会话未激活，请重新申请链接。",
                            success: "密码更新成功，正在跳转到登录页。",
                            validating: "正在验证链接...",
                            updating: "正在更新...",
                            save: "保存新密码",
                            needAnotherLink: "需要新的恢复链接？",
                            backToRecover: "返回找回密码"
                        }
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
                        backToGames: "返回游戏列表",
                        rules: "规则",
                        rulesTitle: "游戏规则",
                        rulesLoading: "正在加载规则...",
                        rulesError: "无法加载规则。",
                        backButton: "返回"
                    },

                    ranking: {
                        currentSeason: "当前赛季",
                        title: "全球排名",
                        subtitle: "在各个级别中攀升，直到达到光线追踪级别。",
                        selectGame: "选择一个游戏",
                        unknownGame: "未知游戏",
                        noScoresTitle: "暂无分数",
                        noScoresDesc: "成为第一个玩并占据榜首的人！",
                        you: "(你)",
                        colPos: "排名",
                        colPlayer: "玩家",
                        colTier: "段位 / 联赛",
                        colScore: "分数",
                        yourPosition: "你当前的位置",
                        keepPlaying: "继续游戏以提升排名"
                    },
                    chat: {
                        unauthorizedTitle: "请等一下！",
                        unauthorizedDesc: "要与其他用户聊天并访问您的私人消息，您需要登录您的账户。",
                        loginButton: "去登录",
                        myStatus: "我的状态：",
                        status: {
                            online: "在线", 
                            away: "离开", 
                            busy: "忙碌", 
                            offline: "隐身", 
                            disconnected: "离线" 
                        },
                        messagesTitle: "消息",
                        addFriendTooltip: "添加好友",
                        selectFriend: "从列表中选择一个好友开始聊天。",
                        errorLoading: "准备聊天时出错，请重试。",
                        breakIce: "打破僵局！",
                        firstMessage: "给 {{name}} 发送第一条消息。",
                        placeholder: "给 {{name}} 发送消息..."
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
                    },
                    dashboard: {
                        welcomePrefix: "欢迎你，",
                        userFallback: "玩家",
                        marquee: {
                            play: "游玩",
                            chat: "聊天",
                            compete: "竞技",
                            climb: "攀升"
                        }
                    },
                    seo: {
                        default: {
                            title: "游戏平台",
                            description: "Make4Gamers 帮助你发现游戏、冲击排行榜并与玩家社区连接。"
                        },
                        home: {
                            title: "首页",
                            description: "探索 Make4Gamers，提升你的实力，并与同水平玩家互动。"
                        },
                        games: {
                            title: "游戏",
                            description: "浏览游戏目录，使用筛选功能，在 Make4Gamers 找到下一场挑战。"
                        },
                        ranking: {
                            title: "排行榜",
                            description: "查看排行榜并通过比赛在 Make4Gamers 提升名次。"
                        },
                        login: {
                            title: "登录",
                            description: "登录 Make4Gamers 账户以保存进度并使用社交功能。"
                        },
                        register: {
                            title: "注册",
                            description: "创建你的 Make4Gamers 账户并开始与社区一起竞技。"
                        },
                        recoverPassword: {
                            title: "找回密码",
                            description: "安全重置密码，重新进入你的 Make4Gamers 账户。"
                        },
                        chat: {
                            title: "聊天",
                            description: "在 Make4Gamers 聊天中与好友沟通并协调对局。"
                        },
                        account: {
                            title: "账户",
                            description: "在 Make4Gamers 管理你的个人资料、偏好设置和账户信息。"
                        },
                        gameplay: {
                            title: "对局",
                            description: "在 Make4Gamers 进行对局并通过成绩追踪持续提升。"
                        }
                    }
                }
            }
        },
        fallbackLng: "es",
        interpolation: { escapeValue: false }
    });

export default i18n;