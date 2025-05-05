import React, { useState, useEffect } from 'react';
import { useTeam } from '../../hooks/useTeam';
import { useBattle } from '../../hooks/useBattle';
import PokemonCard from '../pokemon/PokemonCard';

const BattleSimulator = () => {
  const { team, loading: teamLoading } = useTeam();
  const { battleResult, loading: battleLoading, error, startBattle } = useBattle();
  
  const [selectedPokemon1, setSelectedPokemon1] = useState(null);
  const [selectedPokemon2, setSelectedPokemon2] = useState(null);
  const [battleStarted, setBattleStarted] = useState(false);
  
  // Reset selections when team changes
  useEffect(() => {
    setSelectedPokemon1(null);
    setSelectedPokemon2(null);
    setBattleStarted(false);
  }, [team]);
  
  const handleStartBattle = async () => {
    if (!selectedPokemon1 || !selectedPokemon2) {
      alert('Please select two Pokémon to battle');
      return;
    }
    
    await startBattle(selectedPokemon1, selectedPokemon2);
    setBattleStarted(true);
  };
  
  const handleReset = () => {
    setSelectedPokemon1(null);
    setSelectedPokemon2(null);
    setBattleStarted(false);
  };
  
  if (teamLoading) {
    return <div className="loading">Loading your team...</div>;
  }
  
  if (team.length < 2) {
    return (
      <div className="battle-container">
        <h2>Battle Simulator</h2>
        <div className="not-enough-pokemon">
          <p>You need at least 2 Pokémon in your team to simulate a battle.</p>
          <p>Go to the Pokémon list or search to add more Pokémon to your team!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="battle-container">
      <h2>Battle Simulator</h2>
      
      {!battleStarted ? (
        <div className="battle-selection">
          <div className="selection-side">
            <h3>Select First Pokémon</h3>
            <div className="pokemon-selection-grid">
              {team.map(pokemon => (
                <div 
                  key={pokemon.id} 
                  className={`selection-card ${selectedPokemon1?.id === pokemon.id ? 'selected' : ''}`}
                  onClick={() => {
                    if (selectedPokemon2?.id !== pokemon.id) {
                      setSelectedPokemon1(pokemon);
                    } else {
                      alert('You cannot select the same Pokémon for both sides');
                    }
                  }}
                >
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="selection-side">
            <h3>Select Second Pokémon</h3>
            <div className="pokemon-selection-grid">
              {team.map(pokemon => (
                <div 
                  key={pokemon.id} 
                  className={`selection-card ${selectedPokemon2?.id === pokemon.id ? 'selected' : ''}`}
                  onClick={() => {
                    if (selectedPokemon1?.id !== pokemon.id) {
                      setSelectedPokemon2(pokemon);
                    } else {
                      alert('You cannot select the same Pokémon for both sides');
                    }
                  }}
                >
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="battle-controls">
            <button 
              className="start-battle-btn"
              disabled={!selectedPokemon1 || !selectedPokemon2}
              onClick={handleStartBattle}
            >
              Start Battle
            </button>
          </div>
        </div>
      ) : (
        <div className="battle-results">
          {battleLoading ? (
            <div className="battle-loading">Simulating battle...</div>
          ) : error ? (
            <div className="battle-error">{error}</div>
          ) : battleResult && (
            <>
              <h3 className="battle-headline">Battle Results</h3>
              
              <div className="battle-competitors">
                <div className="competitor">
                  <PokemonCard pokemon={battleResult.pokemon1} />
                </div>
                
                <div className="versus">VS</div>
                
                <div className="competitor">
                  <PokemonCard pokemon={battleResult.pokemon2} />
                </div>
              </div>
              
              <div className="battle-rounds">
                <h4>Round Results</h4>
                <div className="rounds-list">
                  {battleResult.rounds.map((round, index) => (
                    <div key={index} className="round">
                      <div className="round-stat">
                        <span className="stat-name">{round.stat.toUpperCase()}</span>
                        <div className="stat-values">
                          <span>{battleResult.pokemon1.stats[round.stat]}</span>
                          <span>vs</span>
                          <span>{battleResult.pokemon2.stats[round.stat]}</span>
                        </div>
                      </div>
                      <div className="round-winner">
                        Winner: {round.winner.name.charAt(0).toUpperCase() + round.winner.name.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="battle-winner">
                <h3>Battle Winner</h3>
                <div className="winner-display">
                  <PokemonCard pokemon={battleResult.winner} />
                  <div className="winner-name">
                    {battleResult.winner.name.charAt(0).toUpperCase() + battleResult.winner.name.slice(1)}
                  </div>
                </div>
              </div>
              
              <button className="reset-battle-btn" onClick={handleReset}>
                New Battle
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BattleSimulator;