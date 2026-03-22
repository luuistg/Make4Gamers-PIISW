import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; 
import Layout from "./shared/layout/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Ranking from "./pages/Ranking";
import Juegos from "./pages/Juegos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecuperarPassword from "./pages/RecuperarPassword";
import GameplayPage from "./pages/GamePlay";
import Cuenta from './pages/Cuenta'; 
import Ayuda from './pages/Ayuda';

function App() {
  return (
    <>
      {/* 2. COMPONENTE TOASTER GLOBAL PARA LAS NOTIFICACIONES */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b', 
            color: '#fff',
            border: '1px solid #334155', 
          },
        }} 
      />

      <HashRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />

          {/* Main */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/game/:id" element={<GameplayPage />} />
            
            {/* Cuenta */}
            <Route path="/cuenta" element={<Cuenta />} /> 
            <Route path="/ayuda" element={<Ayuda />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;