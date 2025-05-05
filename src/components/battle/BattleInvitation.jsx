import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useBattleSession } from '../../contexts/BattleSessionContext';
import { useTeam } from '../../hooks/useTeam';
import PokemonCard from '../pokemon/PokemonCard';

const BattleInvitation = () => {
  const { team } = useTeam();
  const { createBattleSession, currentSession, waitForOpponent, loading, error } = useBattleSession();
  
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [battleUrl, setBattleUrl] = useState('');
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // If we have a session and we're waiting for an opponent
    if (currentSession && currentSession.status === 'waiting' && waitingForOpponent) {
      const waitForPlayer2 = async () => {
        await waitForOpponent(currentSession.id);
        // Once opponent joins, we'll be redirected to the battle page
      };
      
      waitForPlayer2();
    }
    
    // If session is ready, redirect to battle
    if (currentSession && currentSession.status === 'ready') {
      window.location.href = `/battle/session/${currentSession.id}`;
    }
  }, [currentSession, waitingForOpponent]);
  
  const handleCreateBattle = async () => {
    if (!selectedPokemon) {
      alert('Please select a Pokémon for battle');
      return;
    }
    
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    const session = await createBattleSession(playerName, selectedPokemon.id);
    
    if (session) {
      const url = `${window.location.origin}/battle/join/${session.id}`;
      setBattleUrl(url);
      setWaitingForOpponent(true);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(battleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!team || team.length === 0) {
    return (
      <div className="battle-invitation-container">
        <h2>Create Battle Invitation</h2>
        <div className="empty-team-message">
          <p>You need at least one Pokémon in your team to create a battle.</p>
          <p>Go to the Pokémon list or search to add Pokémon to your team!</p>
        </div>
      </div>
    );
  }  
  return (
    <div className="battle-invitation-container">
      <h2>Create Battle Invitation</h2>
      
      {!battleUrl ? (
        <>
          <div className="player-info-form">
            <div className="form-group">
              <label htmlFor="playerName">Your Name:</label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="player-name-input"
              />
            </div>
          </div>
          
          <div className="pokemon-selection">
            <h3>Select Your Pokémon</h3>
            <div className="pokemon-selection-grid">
              {team.map(pokemon => (
                <div 
                  key={pokemon.id} 
                  className={`selection-card ${selectedPokemon?.id === pokemon.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPokemon(pokemon)}
                >
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="create-battle-btn"
            onClick={handleCreateBattle}
            disabled={loading || !selectedPokemon || !playerName.trim()}
          >
            {loading ? 'Creating...' : 'Create Battle Invitation'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </>
      ) : (
        <div className="battle-invitation">
          <h3>Battle Invitation Created!</h3>
          
          <div className="selected-pokemon">
            <p>You selected:</p>
            <PokemonCard pokemon={selectedPokemon} />
          </div>
          
          <div className="qr-code-container">
            <p>Share this QR code with your opponent:</p>
            <QRCodeSVG value={battleUrl} size={200} />
          </div>
          
          <div className="battle-link-container">
            <p>Or share this link:</p>
            <div className="battle-link">
              <input type="text" value={battleUrl} readOnly />
              <button onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="waiting-message">
            <p>Waiting for opponent to join...</p>
            {loading && <div className="loader"></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleInvitation;