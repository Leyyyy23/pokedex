import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BattleListPage = () => {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableBattles = async () => {
      try {
        setLoading(true);
        // Fetch battles with status "waiting" (no player2 yet)
        const response = await fetch('http://localhost:3001/battleSessions?status=waiting');
        
        if (!response.ok) {
          throw new Error('Failed to fetch available battles');
        }
        
        const data = await response.json();
        
        // Fetch Pokemon details for each battle
        const battlesWithDetails = await Promise.all(
          data.map(async (battle) => {
            try {
              const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${battle.player1.pokemonId}`);
              const pokemonData = await pokemonResponse.json();
              
              return {
                ...battle,
                player1Pokemon: {
                  name: pokemonData.name,
                  image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default
                }
              };
            } catch (err) {
              console.error('Error fetching Pokemon details:', err);
              return battle;
            }
          })
        );
        
        setBattles(battlesWithDetails);
      } catch (err) {
        setError('Failed to load available battles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableBattles();
    
    // Poll for new battles every 10 seconds
    const interval = setInterval(fetchAvailableBattles, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading && battles.length === 0) {
    return (
      <div className="battle-list-page">
        <h1>Available Battles</h1>
        <div className="loading">Loading available battles...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="battle-list-page">
        <h1>Available Battles</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }
  
  if (battles.length === 0) {
    return (
      <div className="battle-list-page">
        <h1>Available Battles</h1>
        <div className="no-battles-message">
          <p>There are no battles available to join right now.</p>
          <Link to="/battle/create" className="create-battle-link">Create a Battle</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="battle-list-page">
      <h1>Available Battles</h1>
      
      <div className="battles-list">
        {battles.map(battle => (
          <div key={battle.id} className="battle-item">
            <div className="battle-creator">
              <span className="creator-name">{battle.player1.name}</span> is waiting for a challenger!
            </div>
            
            <div className="battle-pokemon">
              <img 
                src={battle.player1Pokemon?.image || '/pokeball.png'} 
                alt={battle.player1Pokemon?.name || 'Pokemon'} 
              />
              <span className="pokemon-name">{battle.player1Pokemon?.name || 'Unknown Pokemon'}</span>
            </div>
            
            <Link to={`/battle/join/${battle.id}`} className="join-battle-btn">
              Join Battle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleListPage;
