import React, { createContext, useContext, useState } from 'react';
import { battleSessionService } from '../services/battleSessionService';
import { useTeam } from '../hooks/useTeam';
import { usePokemon } from '../hooks/usePokemon';

const BattleSessionContext = createContext();

export const useBattleSession = () => useContext(BattleSessionContext);

export const BattleSessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { team } = useTeam();
  const { getPokemonById } = usePokemon();
  
  // Create a new battle session
  const createBattleSession = async (playerName, pokemonId) => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await battleSessionService.createSession(playerName, pokemonId);
      setCurrentSession(session);
      
      return session;
    } catch (err) {
      setError('Failed to create battle session');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Join an existing battle session
  const joinBattleSession = async (battleId, playerName, pokemonId) => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await battleSessionService.joinSession(battleId, playerName, pokemonId);
      setCurrentSession(session);
      
      return session;
    } catch (err) {
      setError('Failed to join battle session');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Get session by ID
  const getBattleSession = async (battleId) => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await battleSessionService.getSession(battleId);
      setCurrentSession(session);
      
      return session;
    } catch (err) {
      setError('Battle session not found');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Wait for player 2 to join
  const waitForOpponent = async (battleId) => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await battleSessionService.pollSession(battleId);
      setCurrentSession(session);
      
      return session;
    } catch (err) {
      setError('Error while waiting for opponent');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Complete the battle with results
  const completeBattle = async (battleId, rounds, winner) => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await battleSessionService.updateBattleResult(battleId, rounds, winner);
      setCurrentSession(session);
      
      return session;
    } catch (err) {
      setError('Failed to update battle results');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    currentSession,
    loading,
    error,
    createBattleSession,
    joinBattleSession,
    getBattleSession,
    waitForOpponent,
    completeBattle
  };
  
  return (
    <BattleSessionContext.Provider value={value}>
      {children}
    </BattleSessionContext.Provider>
  );
};