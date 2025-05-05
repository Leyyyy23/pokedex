import React from 'react';
import { Link } from 'react-router-dom';
import BattleSimulator from '../components/battle/BattleSimulator';

const BattlePage = () => {
  return (
    <div className="battle-page">
      <h1>Pokémon Battle Simulator</h1>
      
      <div className="battle-options">
        <div className="battle-option-card">
          <h2>Single Player</h2>
          <p>Battle with your team Pokémon against each other.</p>
          <BattleSimulator />
        </div>
        
        <div className="battle-option-card">
          <h2>Multiplayer</h2>
          <p>Challenge a friend to a real-time Pokémon battle!</p>
          <div className="multiplayer-options">
            <Link to="/battle/create" className="battle-option-btn">Create Battle</Link>
            <Link to="/battle/join" className="battle-option-btn secondary">Join Battle</Link>
            <Link to="/battle/history" className="battle-option-btn secondary">Battle History</Link>          </div>
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
