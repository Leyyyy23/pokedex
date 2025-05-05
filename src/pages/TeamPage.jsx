import React, { useState, useEffect } from 'react';
import PokemonCard from '../components/pokemon/PokemonCard';

const TeamPage = () => {
  const [team, setTeam] = useState([]);
  
  useEffect(() => {
    const savedTeam = localStorage.getItem('pokemonTeam');
    if (savedTeam) {
      setTeam(JSON.parse(savedTeam));
    }
  }, []);
  
  const removeFromTeam = (pokemonId) => {
    const newTeam = team.filter(pokemon => pokemon.id !== pokemonId);
    setTeam(newTeam);
    localStorage.setItem('pokemonTeam', JSON.stringify(newTeam));
  };
  
  if (team.length === 0) {
    return (
      <div className="team-container">
        <h1>Your Pokémon Team</h1>
        <div className="empty-team">
          <p>Your team is empty! Go to the Browse page to add Pokémon to your team.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="team-container">
      <h1>Your Pokémon Team</h1>
      
      <div className="team-stats">
        <p>Team size: {team.length}/6</p>
      </div>
      
      <div className="team-grid">
        {team.map(pokemon => (
          <div key={pokemon.id} className="team-pokemon-card">
            <PokemonCard pokemon={pokemon} />
            <button 
              className="remove-from-team-btn"
              onClick={() => removeFromTeam(pokemon.id)}
            >
              Remove from Team
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
