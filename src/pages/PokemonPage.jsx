import React from 'react';
import PokemonList from '../components/pokemon/PokemonList';

const PokemonPage = () => {
  return (
    <div className="pokemon-page">
      <h1>Browse Pokémon</h1>
      <PokemonList />
    </div>
  );
};

export default PokemonPage;