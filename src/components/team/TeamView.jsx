import React from 'react';
import { useTeam } from '../../hooks/useTeam';
import PokemonCard from '../pokemon/PokemonCard';

const TeamView = () => {
  const { team, loading, error, removePokemonFromTeam } = useTeam();
  
  if (loading) {
    return <div className="loading">Loading your team...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="team-container">
      <h2>Your Pokémon Team</h2>
      
      {team.length === 0 ? (
        <div className="empty-team">
          <p>Your team is empty. Browse or search for Pokémon to add them to your team!</p>
        </div>
      ) : (
        <>
          <div className="team-stats">
            <p>{team.length} of 6 Pokémon in your team</p>
          </div>
          
          <div className="team-grid">
            {team.map(pokemon => (
              <div key={pokemon.id} className="team-pokemon-card">
                <PokemonCard 
                  pokemon={pokemon}
                  isInTeam={true}
                />
                <button 
                  className="remove-from-team-btn"
                  onClick={() => removePokemonFromTeam(pokemon.id)}
                >
                  Remove from Team
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamView;