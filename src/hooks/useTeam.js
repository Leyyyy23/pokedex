import { useState, useEffect } from 'react';

export const useTeam = () => {
  const [team, setTeam] = useState(() => {
    const savedTeam = localStorage.getItem('pokemonTeam');
    return savedTeam ? JSON.parse(savedTeam) : [];
  });

  useEffect(() => {
    localStorage.setItem('pokemonTeam', JSON.stringify(team));
  }, [team]);

  const addToTeam = (pokemon) => {
    if (team.length >= 6) {
      return { success: false, message: 'Team is full' };
    }
    
    if (team.some(p => p.id === pokemon.id)) {
      return { success: false, message: 'Pokémon already in team' };
    }
    
    setTeam([...team, pokemon]);
    return { success: true };
  };

  const removeFromTeam = (pokemonId) => {
    setTeam(team.filter(pokemon => pokemon.id !== pokemonId));
  };

  return { team, addToTeam, removeFromTeam };
};