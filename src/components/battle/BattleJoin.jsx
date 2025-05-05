import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBattleSession } from '../../contexts/BattleSessionContext';
import { useTeam } from '../../hooks/useTeam';

const BattleJoin = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const { team } = useTeam();
  const { getBattleSession, joinBattleSession, loading, error } = useBattleSession();
  
  const [battleData, setBattleData] = useState(null);
  const [loadingBattle, setLoadingBattle] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [joining, setJoining] = useState(false);
  
  // Debug output
  console.log("BattleJoin component rendering");
  console.log("Battle ID from params:", battleId);
  console.log("Team data:", team);
  
  useEffect(() => {
    const fetchBattleSession = async () => {
      try {
        console.log("Fetching battle session with ID:", battleId);
        setLoadingBattle(true);
        
        // Make a direct fetch to the JSON server to check if the battle exists
        const response = await fetch(`http://localhost:3001/battleSessions/${battleId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch battle session: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Battle session data:", data);
        
        setBattleData(data);
        
        // If the battle is already completed or has both players, redirect
        if (data.status === 'completed' || (data.player2 && data.player2.id)) {
          console.log("Battle already has both players or is completed, redirecting...");
          navigate(`/battle/session/${battleId}`);
          return;
        }
      } catch (err) {
        console.error("Error fetching battle session:", err);
        setErrorMessage(`Failed to load battle: ${err.message}`);
      } finally {
        setLoadingBattle(false);
      }
    };
    
    if (battleId) {
      fetchBattleSession();
    }
  }, [battleId, navigate]);

  const handlePokemonSelect = (pokemonId) => {
    setSelectedPokemonId(pokemonId);
  };

  const handleJoinBattle = async () => {
    if (!selectedPokemonId) {
      alert('Please select a Pokémon for battle');
      return;
    }

    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setJoining(true);
    try {
      const result = await joinBattleSession(battleId, playerName, selectedPokemonId);
      if (result) {
        navigate(`/battle/session/${battleId}`);
      }
    } catch (err) {
      setErrorMessage(`Failed to join battle: ${err.message}`);
    } finally {
      setJoining(false);
    }
  };

  // Get opponent's Pokémon details
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  useEffect(() => {
    const fetchOpponentPokemon = async () => {
      if (battleData && battleData.player1 && battleData.player1.pokemonId) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${battleData.player1.pokemonId}`);
          if (response.ok) {
            const data = await response.json();
            setOpponentPokemon({
              id: data.id,
              name: data.name,
              image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
              types: data.types.map(type => type.type.name)
            });
          }
        } catch (err) {
          console.error("Error fetching opponent's Pokémon:", err);
        }
      }
    };

    fetchOpponentPokemon();
  }, [battleData]);

  // Find selected Pokémon details
  const selectedPokemon = team?.find(p => p.id === selectedPokemonId);
  
  return (
    <div className="battle-join-container">
      <h2>Join Battle Challenge</h2>
      
      {loadingBattle ? (
        <div className="loading">
          <div className="loader"></div>
          <p>Loading battle information...</p>
        </div>
      ) : errorMessage ? (
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{errorMessage}</p>
          <p>Make sure your JSON server is running at http://localhost:3001</p>
          <button className="try-again-btn" onClick={() => window.location.reload()}>Try Again</button>
          <button className="back-btn" onClick={() => navigate('/battle')}>Back to Battles</button>
        </div>
      ) : !battleData ? (
        <div className="error-message">
          <h3>Battle Not Found</h3>
          <p>The battle might have been deleted or never existed.</p>
          <button className="back-btn" onClick={() => navigate('/battle')}>Back to Battles</button>
        </div>
      ) : (
        <div className="battle-join-content">
          <div className="opponent-info">
            <h3>Battle Challenge from {battleData.player1?.name || "Unknown"}</h3>
            
            {opponentPokemon && (
              <div className="opponent-pokemon">
                <img src={opponentPokemon.image} alt={opponentPokemon.name} />
                <p className="pokemon-name">{opponentPokemon.name}</p>
                <div className="pokemon-types">
                  {opponentPokemon.types.map(type => (
                    <span 
                      key={type} 
                      className="type-badge"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="join-battle-form">
            <div className="form-group">
              <label htmlFor="playerName">Your Name:</label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            
            {team && team.length > 0 ? (
              <div className="pokemon-selection">
                <h3>Select Your Pokémon</h3>
                <div className="pokemon-selection-grid">
                  {team.map(pokemon => (
                    <div 
                      key={pokemon.id} 
                      className={`selection-card ${selectedPokemonId === pokemon.id ? 'selected' : ''}`}
                      onClick={() => handlePokemonSelect(pokemon.id)}
                    >
                      <img src={pokemon.image} alt={pokemon.name} />
                      <p className="pokemon-name">{pokemon.name}</p>
                      <div className="pokemon-types">
                        {pokemon.types && pokemon.types.map(type => (
                          <span 
                            key={type} 
                            className="type-badge"
                            style={{ backgroundColor: getTypeColor(type) }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-team-message">
                <p>You need at least one Pokémon in your team to join a battle.</p>
                <button className="add-pokemon-btn" onClick={() => navigate('/pokemon')}>
                  Add Pokémon to Team
                </button>
              </div>
            )}
            
            {team && team.length > 0 && (
              <div className="battle-preview">
                <h3>Battle Preview</h3>
                <div className="battle-competitors">
                  <div className="competitor">
                    {opponentPokemon && (
                      <>
                        <img src={opponentPokemon.image} alt={opponentPokemon.name} />
                        <span className="pokemon-name">{opponentPokemon.name}</span>
                        <span className="player-name">{battleData.player1?.name || "Unknown"}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="versus">VS</div>
                  
                  <div className="competitor">
                    {selectedPokemon ? (
                      <>
                        <img src={selectedPokemon.image} alt={selectedPokemon.name} />
                        <span className="pokemon-name">{selectedPokemon.name}</span>
                        <span className="player-name">{playerName || "You"}</span>
                      </>
                    ) : (
                      <div className="select-prompt">Select your Pokémon</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="battle-actions">
              <button 
                className="back-btn"
                onClick={() => navigate('/battle')}
              >
                Cancel
              </button>
              
              <button 
                className="join-battle-btn"
                onClick={handleJoinBattle}
                disabled={joining || !selectedPokemonId || !playerName.trim() || team.length === 0}
              >
                {joining ? 'Joining...' : 'Join Battle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on Pokémon type
function getTypeColor(type) {
  const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
    default: '#777777'
  };
  
  return typeColors[type] || typeColors.default;
}

export default BattleJoin;
