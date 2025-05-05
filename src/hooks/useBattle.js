import { useState } from 'react';

export const useBattle = () => {
  const [battleResult, setBattleResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to normalize Pokemon stats into a consistent format
  const normalizeStats = (pokemon) => {
    const normalizedStats = {};
    
    // If stats is an array (like from PokeAPI)
    if (Array.isArray(pokemon.stats)) {
      pokemon.stats.forEach(statObj => {
        const statName = statObj.stat?.name || statObj.name;
        const statValue = statObj.base_stat || statObj.value || 50;
        if (statName) {
          normalizedStats[statName] = statValue;
        }
      });
    } 
    // If stats is already an object
    else if (typeof pokemon.stats === 'object' && pokemon.stats !== null) {
      Object.assign(normalizedStats, pokemon.stats);
    }
    
    // Ensure all required stats exist with default values
    const requiredStats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
    requiredStats.forEach(stat => {
      if (normalizedStats[stat] === undefined) {
        normalizedStats[stat] = 50; // Default value
      }
    });
    
    return normalizedStats;
  };

  const simulateBattle = (pokemon1, pokemon2) => {
    // Create copies with normalized stats
    const p1 = {
      ...pokemon1,
      stats: normalizeStats(pokemon1)
    };
    
    const p2 = {
      ...pokemon2,
      stats: normalizeStats(pokemon2)
    };

    // Battle will be based on comparing stats
    // We'll do 3 rounds, each comparing a different stat
    const statOptions = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
    const selectedStats = [];
    
    // Select 3 random unique stats for the battle
    while (selectedStats.length < 3) {
      const randomStat = statOptions[Math.floor(Math.random() * statOptions.length)];
      if (!selectedStats.includes(randomStat)) {
        selectedStats.push(randomStat);
      }
    }

    // Simulate the rounds
    const rounds = [];
    let p1Wins = 0;
    let p2Wins = 0;

    selectedStats.forEach(stat => {
      // Get the stat values for each Pokémon
      const p1StatValue = p1.stats[stat];
      const p2StatValue = p2.stats[stat];
      
      // Determine the winner of this round
      let winner;
      if (p1StatValue > p2StatValue) {
        winner = p1;
        p1Wins++;
      } else if (p2StatValue > p1StatValue) {
        winner = p2;
        p2Wins++;
      } else {
        // In case of a tie, randomly select a winner
        winner = Math.random() < 0.5 ? p1 : p2;
        if (winner === p1) p1Wins++;
        else p2Wins++;
      }
      
      rounds.push({
        stat,
        winner,
      });
    });

    // Determine the overall winner
    const winner = p1Wins > p2Wins ? p1 : p2;

    return {
      pokemon1: p1,
      pokemon2: p2,
      rounds,
      winner
    };
  };

  const startBattle = async (pokemon1, pokemon2) => {
    if (!pokemon1 || !pokemon2) {
      setError('Both Pokémon must be selected');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Simulate battle between the two Pokémon
      const result = simulateBattle(pokemon1, pokemon2);
      setBattleResult(result);
      setLoading(false);
    } catch (err) {
      console.error('Battle error:', err);
      setError('Failed to complete battle: ' + err.message);
      setLoading(false);
    }
  };

  return {
    battleResult,
    loading,
    error,
    startBattle
  };
};
