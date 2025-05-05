import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const BattleHistoryPage = () => {
  const [battleHistory, setBattleHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBattleHistory = async () => {
      try {
        const response = await fetch('http://localhost:3001/battleSessions?status=completed&_sort=createdAt&_order=desc');
        if (!response.ok) {
          throw new Error('Failed to fetch battle history');
        }
        
        const data = await response.json();
        
        // Fetch Pokemon details for each battle
        const battlesWithDetails = await Promise.all(
          data.map(async (battle) => {
            try {
              const [pokemon1Response, pokemon2Response] = await Promise.all([
                fetch(`https://pokeapi.co/api/v2/pokemon/${battle.player1.pokemonId}`),
                fetch(`https://pokeapi.co/api/v2/pokemon/${battle.player2.pokemonId}`)
              ]);
              
              const pokemon1Data = await pokemon1Response.json();
              const pokemon2Data = await pokemon2Response.json();
              
              return {
                ...battle,
                pokemon1: {
                  id: pokemon1Data.id,
                  name: pokemon1Data.name,
                  image: pokemon1Data.sprites.other['official-artwork'].front_default || pokemon1Data.sprites.front_default
                },
                pokemon2: {
                  id: pokemon2Data.id,
                  name: pokemon2Data.name,
                  image: pokemon2Data.sprites.other['official-artwork'].front_default || pokemon2Data.sprites.front_default
                }
              };
            } catch (err) {
              console.error('Error fetching Pokemon details:', err);
              return battle;
            }
          })
        );
        
        setBattleHistory(battlesWithDetails);
      } catch (err) {
        setError('Failed to load battle history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBattleHistory();
  }, []);
  
  if (loading) {
    return (
      <div className="battle-history-page">
        <h1>Battle History</h1>
        <div className="loading">Loading battle history...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="battle-history-page">
        <h1>Battle History</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }
  
  if (battleHistory.length === 0) {
    return (
      <div className="battle-history-page">
        <h1>Battle History</h1>
        <div className="empty-history">
          <p>You haven't participated in any battles yet.</p>
          <Link to="/battle" className="create-battle-link">Create a Battle</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="battle-history-page">
      <h1>Battle History</h1>
      
      <div className="history-list">
        {battleHistory.map(battle => (
          <div key={battle.id} className="history-item">
            <div className="battle-participants">
              <div className="participant">
                <img src={battle.pokemon1.image} alt={battle.pokemon1.name} />
                <span>{battle.pokemon1.name}</span>
                <span className="trainer-name">{battle.player1.name}</span>
              </div>
              
              <div className="versus">VS</div>
              
              <div className="participant">
                <img src={battle.pokemon2.image} alt={battle.pokemon2.name} />
                <span>{battle.pokemon2.name}</span>
                <span className="trainer-name">{battle.player2.name}</span>
              </div>
            </div>
            
            <div className="battle-outcome">
              <div className="winner">
                Winner: {battle.result.winner === 'player1' 
                  ? `${battle.pokemon1.name} (${battle.player1.name})` 
                  : `${battle.pokemon2.name} (${battle.player2.name})`}
              </div>
              
              <div className="battle-date">
                {format(new Date(battle.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
              
              <Link to={`/battle/session/${battle.id}`} className="view-battle-btn">
                View Battle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleHistoryPage;