import React, { useState } from 'react';
import PokemonCard from './PokemonCard';
import { usePokemonList } from '../../hooks/usePokemon';
import { useTeam } from '../../hooks/useTeam';

const PokemonList = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const { pokemons, loading, error, nextPage, prevPage, hasMore, offset } = usePokemonList(20, 0);
  const { team, addPokemonToTeam, isTeamFull } = useTeam();

  const handleAddToTeam = async (pokemon) => {
    if (isTeamFull) {
      alert('Your team is already full (max 6 Pokémon)');
      return;
    }
    
    const simplifiedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.types,
      stats: pokemon.stats,
      abilities: pokemon.abilities
    };
    
    const success = await addPokemonToTeam(simplifiedPokemon);
    if (success) {
      alert(`${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} added to your team!`);
    }
  };

  const isPokemonInTeam = (pokemonId) => {
    return team.some(p => p.id === pokemonId);
  };

  if (loading && pokemons.length === 0) {
    return <div className="loading">Loading Pokémon...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="pokemon-list-container">
      <h2>Pokémon List</h2>
      
      <div className="pagination-controls">
        <button 
          onClick={prevPage} 
          disabled={offset === 0}
        >
          Previous
        </button>
        <span>Page {Math.floor(offset / 20) + 1}</span>
        <button 
          onClick={nextPage} 
          disabled={!hasMore}
        >
          Next
        </button>
      </div>
      
      <div className="pokemon-grid">
        {pokemons.map(pokemon => (
          <PokemonCard 
            key={pokemon.id}
            pokemon={pokemon}
            onSelect={setSelectedPokemon}
            isSelected={selectedPokemon?.id === pokemon.id}
            isInTeam={isPokemonInTeam(pokemon.id)}
            onAddToTeam={handleAddToTeam}
          />
        ))}
      </div>
      
      {selectedPokemon && (
        <div className="pokemon-details-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedPokemon(null)}>×</button>
            <h2>{selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}</h2>
            <img src={selectedPokemon.image} alt={selectedPokemon.name} />
            
            <div className="stats-container">
              <h3>Stats</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span>HP:</span>
                  <span>{selectedPokemon.stats.hp}</span>
                </div>
                <div className="stat">
                  <span>Attack:</span>
                  <span>{selectedPokemon.stats.attack}</span>
                </div>
                <div className="stat">
                  <span>Defense:</span>
                  <span>{selectedPokemon.stats.defense}</span>
                </div>
                <div className="stat">
                  <span>Sp. Attack:</span>
                  <span>{selectedPokemon.stats['special-attack']}</span>
                </div>
                <div className="stat">
                  <span>Sp. Defense:</span>
                  <span>{selectedPokemon.stats['special-defense']}</span>
                </div>
                <div className="stat">
                  <span>Speed:</span>
                  <span>{selectedPokemon.stats.speed}</span>
                </div>
              </div>
            </div>
            
            <div className="abilities-container">
              <h3>Abilities</h3>
              <ul>
                {selectedPokemon.abilities.map(ability => (
                  <li key={ability}>{ability.replace('-', ' ')}</li>
                ))}
              </ul>
            </div>
            
            {!isPokemonInTeam(selectedPokemon.id) && !isTeamFull && (
              <button 
                className="add-to-team-btn-large"
                onClick={() => handleAddToTeam(selectedPokemon)}
              >
                Add to Team
              </button>
            )}
            
            {isPokemonInTeam(selectedPokemon.id) && (
              <div className="already-in-team">This Pokémon is already in your team</div>
            )}
            
            {!isPokemonInTeam(selectedPokemon.id) && isTeamFull && (
              <div className="team-full-message">Your team is full (max 6 Pokémon)</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonList;