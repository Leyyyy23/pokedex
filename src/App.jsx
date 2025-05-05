import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import PokemonListPage from './pages/PokemonListPage';
import TeamPage from './pages/TeamPage';
import BattlePage from './pages/BattlePage';
import BattleMultiplayerPage from './pages/BattleMultiplayerPage';
import BattleCreatePage from './pages/BattleCreatePage';
import BattleHistoryPage from './pages/BattleHistoryPage';
import BattleListPage from './pages/BattleListPage'; // Add this import
import BattleJoin from './components/battle/BattleJoin';
import BattleSession from './components/battle/BattleSession';
import Footer from './components/layout/Footer';
import { getPlayerId } from './utils/playerUtils';
import { BattleSessionProvider } from './contexts/BattleSessionContext';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize player ID on app load
    getPlayerId();
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pokemon" element={<PokemonListPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/battle" element={<BattlePage />} />
            <Route path="/battle/multiplayer/*" element={<BattleMultiplayerPage />} />
            <Route path="/battle/create" element={<BattleCreatePage />} />
            <Route path="/battle/history" element={<BattleHistoryPage />} />
            <Route path="/battle/join" element={<BattleListPage />} /> {/* This route */}
            <Route path="/battle/join/:battleId" element={
              <BattleSessionProvider>
                <BattleJoin />
              </BattleSessionProvider>
            } />
            <Route path="/battle/session/:battleId" element={
              <BattleSessionProvider>
                <BattleSession />
              </BattleSessionProvider>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
