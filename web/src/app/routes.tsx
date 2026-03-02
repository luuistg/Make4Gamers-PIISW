import { type RouteObject } from "react-router-dom";
import { Layout } from "@/core/layout";
import { Login, Register, RecuperarPassword } from "@/modules/auth";
import { Juegos } from "@/modules/games";
import { Home } from "@/modules/home";
import { Ranking } from "@/modules/ranking";
import { Chat } from "@/modules/chat";

export const routes: RouteObject[] = [
  // Rutas de autenticación (sin layout principal)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/recuperar-password",
    element: <RecuperarPassword />,
  },

  // Rutas principales (con layout principal)
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/juegos", element: <Juegos /> },
      { path: "/ranking", element: <Ranking /> },
      { path: "/chat", element: <Chat /> },
    ],
  },
];
