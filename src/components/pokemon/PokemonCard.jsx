import React from 'react';
import '../../styles/PokemonCard.css'; // Correct path from components/pokemon to src/styles


const PokemonCard = ({ pokemon, isInTeam, onAddToTeam, showAddButton = false, onCardClick }) => {
  // Get the background color based on the first type
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

  const mainType = pokemon.types[0];
  const cardStyle = {
    backgroundColor: `${getTypeColor(mainType)}22`, // 22 is hex for low opacity
    borderColor: getTypeColor(mainType)
  };

  const handleAddClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    if (!isInTeam) {
      // Add animation class
      e.currentTarget.classList.add('add-animation');
      // Remove animation class after animation completes
      setTimeout(() => {
        e.currentTarget.classList.remove('add-animation');
      }, 500);
      onAddToTeam();
    }
  };

  return (
    <div className="pokemon-card" style={cardStyle} onClick={() => onCardClick && onCardClick(pokemon)}>
      <div className="pokemon-image-container">
        <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
      </div>
      <div className="pokemon-info">
        <h3 className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span 
              key={type} 
              className="type-badge" 
              style={{ backgroundColor: getTypeColor(type) }}
            >
              {type}
            </span>
          ))}
        </div>
        
        {showAddButton && (
          <button 
            onClick={handleAddClick} 
            disabled={isInTeam}
            className={`add-team-button ${isInTeam ? 'in-team' : 'available'}`}
          >
            <i className={isInTeam ? 'fas fa-check' : 'fas fa-plus'}></i>
            {isInTeam ? "In Team" : "Add to Team"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;