import React, { useState } from 'react';
import { usePokemonSearch } from '../../hooks/usePokemon';
import PokemonCard from './PokemonCard';
import { useTeam } from '../../hooks/useTeam';

const PokemonSearch = () => {
  const [query, setQuery] = useState('');
  const { searchResults, searching, searchError, performSearch } = usePokemonSearch();
  const { team, addPokemonToTeam, isTeamFull } = useTeam();
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

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

  return (
    <div className="pokemon-search-container">
      <h2>Search Pokémon</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Pokémon name or ID"
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {searchError && <div className="search-error">{searchError}</div>}
      
      <div className="search-results">
        {searchResults.length > 0 ? (
          <div className="pokemon-grid">
            {searchResults.map(pokemon => (
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
        ) : query && !searching && !searchError ? (
          <div className="no-results">No Pokémon found. Try a different name or ID.</div>
        ) : null}
      </div>
      
      {selectedPokemon && (
        <div className="pokemon-details-modal">
          {/* Same modal content as in PokemonList component */}
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

export default PokemonSearch;