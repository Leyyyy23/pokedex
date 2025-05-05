import React, { useState, useEffect } from 'react';
import '../../styles/PokemonModal.css';

const PokemonModal = ({ pokemon, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
        const data = await response.json();
        
        setDetails({
          id: data.id,
          name: data.name,
          height: data.height / 10, // Convert to meters
          weight: data.weight / 10, // Convert to kg
          abilities: data.abilities.map(ability => ability.ability.name),
          stats: data.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat
          })),
          types: data.types.map(type => type.type.name),
          image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          moves: data.moves.slice(0, 5).map(move => move.move.name) // Just get first 5 moves
        });
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemon.id]);

  // Get background color based on Pokemon type
  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#A8A878';
  };

  return (
    <div className="pokemon-modal-backdrop" onClick={onClose}>
      <div className="pokemon-modal-content" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="pokemon-modal-loading">Loading details...</div>
        ) : details ? (
          <>
            <button className="pokemon-modal-close" onClick={onClose}>×</button>
            
            <div className="pokemon-modal-header" 
                 style={{ background: `linear-gradient(135deg, ${getTypeColor(details.types[0])}88, ${getTypeColor(details.types[0])}44)` }}>
              <img src={details.image} alt={details.name} className="pokemon-modal-image" />
              <h2 className="pokemon-modal-title">
                {details.name.charAt(0).toUpperCase() + details.name.slice(1)} <span className="pokemon-modal-id">#{details.id}</span>
              </h2>
              <div className="pokemon-modal-types">
                {details.types.map(type => (
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
            
            <div className="pokemon-modal-body">
              <div className="pokemon-modal-section">
                <h3>Base Stats</h3>
                <div className="pokemon-modal-stats">
                  {details.stats.map(stat => (
                    <div key={stat.name} className="pokemon-modal-stat">
                      <span className="pokemon-modal-stat-name">
                        {stat.name.replace('-', ' ')}:
                      </span>
                      <div className="pokemon-modal-stat-bar-container">
                        <div 
                          className="pokemon-modal-stat-bar" 
                          style={{ 
                            width: `${Math.min(100, (stat.value / 150) * 100)}%`,
                            backgroundColor: getTypeColor(details.types[0])
                          }}
                        ></div>
                        <span className="pokemon-modal-stat-value">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pokemon-modal-info-grid">
                <div className="pokemon-modal-section">
                  <h3>Physical</h3>
                  <p><strong>Height:</strong> {details.height}m</p>
                  <p><strong>Weight:</strong> {details.weight}kg</p>
                </div>
                
                <div className="pokemon-modal-section">
                  <h3>Abilities</h3>
                  <ul className="pokemon-modal-abilities">
                    {details.abilities.map(ability => (
                      <li key={ability}>{ability.replace('-', ' ')}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="pokemon-modal-section">
                <h3>Sample Moves</h3>
                <div className="pokemon-modal-moves">
                  {details.moves.map(move => (
                    <span key={move} className="pokemon-modal-move">
                      {move.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="pokemon-modal-error">Failed to load Pokemon details</div>
        )}
      </div>
    </div>
  );
};

export default PokemonModal;