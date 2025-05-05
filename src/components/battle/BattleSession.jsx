import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBattleSession } from '../../contexts/BattleSessionContext';
import PokemonCard from '../pokemon/PokemonCard';

const BattleSession = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const { getBattleSession, completeBattle, currentSession, loading, error } = useBattleSession();
  
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [battleRounds, setBattleRounds] = useState([]);
  
  useEffect(() => {
    const fetchBattleSession = async () => {
      const session = await getBattleSession(battleId);
      
      if (session) {
        // If session is not ready yet, redirect to appropriate page
        if (session.status === 'waiting') {
          if (isPlayer1(session)) {
            navigate(`/battle/invite/${battleId}`);
          } else {
            navigate(`/battle/join/${battleId}`);
          }
          return;
        }
        
        // Fetch both Pokemon details
        const fetchPokemonDetails = async () => {
          try {
            const [response1, response2] = await Promise.all([
              fetch(`https://pokeapi.co/api/v2/pokemon/${session.player1.pokemonId}`),
              fetch(`https://pokeapi.co/api/v2/pokemon/${session.player2.pokemonId}`)
            ]);
            
            const data1 = await response1.json();
            const data2 = await response2.json();
            
            const pokemon1 = {
              id: data1.id,
              name: data1.name,
              image: data1.sprites.other['official-artwork'].front_default || data1.sprites.front_default,
              types: data1.types.map(type => type.type.name),
              stats: {
                hp: data1.stats.find(stat => stat.stat.name === 'hp').base_stat,
                attack: data1.stats.find(stat => stat.stat.name === 'attack').base_stat,
                defense: data1.stats.find(stat => stat.stat.name === 'defense').base_stat,
                speed: data1.stats.find(stat => stat.stat.name === 'speed').base_stat
              },
              player: session.player1.name
            };
            
            const pokemon2 = {
              id: data2.id,
              name: data2.name,
              image: data2.sprites.other['official-artwork'].front_default || data2.sprites.front_default,
              types: data2.types.map(type => type.type.name),
              stats: {
                hp: data2.stats.find(stat => stat.stat.name === 'hp').base_stat,
                attack: data2.stats.find(stat => stat.stat.name === 'attack').base_stat,
                defense: data2.stats.find(stat => stat.stat.name === 'defense').base_stat,
                speed: data2.stats.find(stat => stat.stat.name === 'speed').base_stat
              },
              player: session.player2.name
            };
            
            setPokemon1(pokemon1);
            setPokemon2(pokemon2);
            
            // If session is completed, show results
            if (session.status === 'completed') {
              setBattleStarted(true);
              setBattleRounds(session.result.rounds);
              setBattleResult({
                winner: session.result.winner === 'player1' ? pokemon1 : pokemon2
              });
            }
          } catch (err) {
            console.error('Failed to fetch Pokemon details:', err);
          }
        };
        
        fetchPokemonDetails();
      }
    };
    
    fetchBattleSession();
  }, [battleId]);
  
  const isPlayer1 = (session) => {
    const playerId = sessionStorage.getItem('playerId');
    return session.player1.id === playerId;
  };
  
  const startBattle = async () => {
    if (!pokemon1 || !pokemon2) return;
    
    setBattleStarted(true);
    
    // Simulate battle rounds
    const rounds = [];
    const stats = ['hp', 'attack', 'speed'];
    let player1Wins = 0;
    let player2Wins = 0;
    
    stats.forEach(stat => {
      const p1Stat = pokemon1.stats[stat];
      const p2Stat = pokemon2.stats[stat];
      
      let winner;
      if (p1Stat > p2Stat) {
        winner = pokemon1;
        player1Wins++;
      } else if (p2Stat > p1Stat) {
        winner = pokemon2;
        player2Wins++;
      } else {
        // In case of a tie, randomly select winner
        winner = Math.random() < 0.5 ? pokemon1 : pokemon2;
        if (winner === pokemon1) player1Wins++;
        else player2Wins++;
      }
      
      rounds.push({
        stat,
        values: {
          player1: p1Stat,
          player2: p2Stat
        },
        winner
      });
    });
    
    setBattleRounds(rounds);
    
    // Determine overall winner
    const winner = player1Wins > player2Wins ? pokemon1 : pokemon2;
    setBattleResult({ winner });
    
    // Save battle result to server
    await completeBattle(
      battleId,
      rounds.map(round => ({
        stat: round.stat,
        values: round.values,
        winner: round.winner === pokemon1 ? 'player1' : 'player2'
      })),
      winner === pokemon1 ? 'player1' : 'player2'
    );
  };
  
  if (loading && (!pokemon1 || !pokemon2)) {
    return (
      <div className="battle-session-container">
        <h2>Pokémon Battle</h2>
        <div className="loading">Loading battle information...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="battle-session-container">
        <h2>Pokémon Battle</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="battle-session-container">
      <h2>Pokémon Battle</h2>
      
      {pokemon1 && pokemon2 && (
        <>
          <div className="battle-competitors">
            <div className="competitor">
              <div className="player-name">{pokemon1.player}</div>
              <PokemonCard pokemon={pokemon1} />
            </div>
            
            <div className="versus">VS</div>
            
            <div className="competitor">
              <div className="player-name">{pokemon2.player}</div>
              <PokemonCard pokemon={pokemon2} />
            </div>
          </div>
          
          {!battleStarted ? (
            <div className="battle-controls">
              <button 
                className="start-battle-btn"
                onClick={startBattle}
              >
                Start Battle
              </button>
            </div>
          ) : (
            <div className="battle-results">
              <h3 className="battle-headline">Battle Results</h3>
              
              <div className="battle-rounds">
                <h4>Round Results</h4>
                <div className="rounds-list">
                  {battleRounds.map((round, index) => (
                    <div key={index} className="round">
                      <div className="round-stat">
                        <span className="stat-name">{round.stat.toUpperCase()}</span>
                        <div className="stat-values">
                          <span>{round.values.player1}</span>
                          <span>vs</span>
                          <span>{round.values.player2}</span>
                        </div>
                      </div>
                      <div className="round-winner">
                        Winner: {round.winner.name.charAt(0).toUpperCase() + round.winner.name.slice(1)}
                        ({round.winner.player})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {battleResult && (
                <div className="battle-winner">
                  <h3>Battle Winner</h3>
                  <div className="winner-display">
                    <PokemonCard pokemon={battleResult.winner} />
                    <div className="winner-name">
                      {battleResult.winner.name.charAt(0).toUpperCase() + battleResult.winner.name.slice(1)}
                    </div>
                    <div className="winner-player">
                      Trainer: {battleResult.winner.player}
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                className="back-to-battles-btn"
                onClick={() => navigate('/battle')}
              >
                Back to Battles
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BattleSession;