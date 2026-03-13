import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Ranking from "./pages/Ranking";
import Juegos from "./pages/Juegos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecuperarPassword from "./pages/RecuperarPassword";
import GameplayPage from "./pages/GamePlay";

function App() {
  return (
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
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;