# Plataforma de Juegos - Monorepo

Bienvenido al repositorio oficial de la Plataforma de Juegos. Este proyecto opera como un **Monorepo** que contiene tanto la aplicación web como la aplicación móvil, compartiendo el backend y la lógica de base de datos a través de Supabase.

---

## Tech Stack & Versiones

### Core
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Web (`apps/web`)
* **Framework:** Vite + React
* **Estilos:** Tailwind CSS **v4** (`@tailwindcss/vite`)
* **Routing:** React Router

### Móvil (`apps/mobile`)
* **Framework:** React Native + Expo (Expo Router)
* **Estilos:** NativeWind **v2** + Tailwind CSS **v3.3.2**
* **Iconos:** Lucide React Native

---

## ⚠️ NOTA CRÍTICA SOBRE VERSIONES

Para evitar conflictos, es vital respetar las versiones de Tailwind en cada entorno:

1.  **En WEB:** Usamos la última versión (v4).
2.  **En MÓVIL:** Usamos una versión fijada (v3.3.2). **NO ACTUALIZAR `tailwindcss` en la carpeta móvil**, ya que NativeWind v2 aún no es compatible con la v4.

---

## Guía de Instalación

Sigue estos pasos para configurar tu entorno local desde cero.

### 1. Clonar el Proyecto

Si eres colaborador, primero haz un **Fork** del repositorio. Luego clónalo:

```bash
# Si usas HTTPS
git clone [https://github.com/TU_USUARIO/mi-app-juegos.git](https://github.com/TU_USUARIO/mi-app-juegos.git)

# Entra en la carpeta del proyecto
cd mi-app-juegos
```

## Instalar WEB

```bash
cd apps/web
npm install
```

## Instalar MÓVIL

```bash
cd apps/mobile
npm install
```

## Ejecutar


```bash
# WEB
cd apps/web
npm run dev

# Móvil
cd apps/mobile
npx expo start -c
```



## Estrutura del proyecto

```
mi-app-juegos/
├── apps/
│   ├── web/               # Cliente Web (Vite)
│   │   ├── src/
│   │   │   ├── supabase.ts    # Cliente Supabase Web
│   │   │   └── main.tsx
│   │   └── index.css      # Configuración Tailwind v4 (@import)
│   │
│   └── mobile/            # Cliente Móvil (Expo)
│       ├── app/           # Pantallas (Expo Router)
│       ├── lib/           # Utilidades
│       │   └── supabase.ts    # Cliente Supabase Móvil (SecureStore)
│       ├── components/    # Componentes UI
│       ├── babel.config.js    # Configuración NativeWind
│       └── tailwind.config.js # Configuración Tailwind v3
│
└── README.md
```
