import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; 
import Layout from "./shared/layout/Layout";
import SeoManager from "./shared/seo/SeoManager";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Ranking from "./pages/Ranking";
import Juegos from "./pages/Juegos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecuperarPassword from "./pages/RecuperarPassword";
import ActualizarPassword from "./pages/ActualizarPassword";
import GameplayPage from "./pages/GamePlay";
import PerfilUsuario from './pages/PerfilUsuario';
import Cuenta from './pages/Cuenta'; 
import GameRules from "./pages/GameRules";
import Ayuda from './pages/Ayuda';
import Contacto from './pages/Contacto';
import AdminSugerencias from './pages/AdminSugerencias';
import AdminTickets from './pages/AdminTickets';
import AdminFiltro from './pages/AdminFiltro';
import Estadisticas from './pages/Estadisticas';
import AdminFormulas from './pages/AdminFormulas';
import AdminLayout from './shared/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminSolicitudesDev from './pages/AdminSolicitudesDev';
function App() {
  return (
    <>
     
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
        <SeoManager />
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/actualizar-password" element={<ActualizarPassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sugerencias" element={<AdminSugerencias />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="filtro" element={<AdminFiltro />} />
            <Route path="formulas" element={<AdminFormulas />} />
            <Route path="solicitudes" element={<AdminSolicitudesDev />} />
          </Route>

          {/* Main */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/game/:id" element={<GameplayPage />} />
            <Route path="/juegos/:id/reglas" element={<GameRules />} />
            <Route path="/contacto" element={<Contacto />} />
            
            {/* Cuenta */}
            <Route path="/cuenta" element={<Cuenta />} /> 
            <Route path="/usuario/:username" element={<PerfilUsuario />} />
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
