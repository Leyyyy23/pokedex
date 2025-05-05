import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import BattleInvitation from '../components/battle/BattleInvitation';
import BattleJoin from '../components/battle/BattleJoin';
import BattleSession from '../components/battle/BattleSession';
import { BattleSessionProvider } from '../contexts/BattleSessionContext';

const BattleMultiplayerPage = () => {
  return (
    <BattleSessionProvider>
      <div className="battle-multiplayer-page">
        <h1>Pokémon Battle Arena</h1>
        
        <Routes>
          <Route path="/" element={<BattleMultiplayerHome />} />
          <Route path="/invite/:battleId" element={<BattleInvitation />} />
          <Route path="/join/:battleId" element={<BattleJoin />} />
          <Route path="/session/:battleId" element={<BattleSession />} />
        </Routes>
      </div>
    </BattleSessionProvider>
  );
};

const BattleMultiplayerHome = () => {
  return (
    <div className="battle-multiplayer-home">
      <div className="battle-options">
        <div className="battle-option-card">
          <h2>Create a Battle</h2>
          <p>Challenge a friend to a Pokémon battle! Select your Pokémon and generate a QR code or link to share.</p>
          <Link to="/battle/create" className="battle-option-btn">Create Battle</Link>
        </div>
        
        <div className="battle-option-card">
          <h2>Recent Battles</h2>
          <p>View your recent multiplayer battles and their results.</p>
          <Link to="/battle/history" className="battle-option-btn">View History</Link>
        </div>
      </div>
    </div>
  );
};

export default BattleMultiplayerPage;