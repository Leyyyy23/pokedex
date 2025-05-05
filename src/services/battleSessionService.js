import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:3001';

export const battleSessionService = {
  // Create a new battle session
  createSession: async (player1Name, pokemonId) => {
    const battleId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    
    const session = {
      id: battleId,
      createdAt: now.toISOString(),
      status: 'waiting',
      player1: {
        id: sessionStorage.getItem('playerId') || uuidv4(),
        name: player1Name,
        pokemonId: pokemonId,
        ready: true
      },
      player2: {
        id: null,
        name: null,
        pokemonId: null,
        ready: false
      },
      result: {
        winner: null,
        rounds: [],
        completedAt: null
      },
      expiresAt: expiresAt.toISOString()
    };
    
    const response = await fetch(`${API_URL}/battleSessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(session)
    });
    
    return response.json();
  },
  
  // Get a battle session by ID
  getSession: async (battleId) => {
    const response = await fetch(`${API_URL}/battleSessions/${battleId}`);
    if (!response.ok) {
      throw new Error('Battle session not found');
    }
    return response.json();
  },
  
  // Join a battle session as player 2
  joinSession: async (battleId, player2Name, pokemonId) => {
    // First get the current session
    const session = await battleSessionService.getSession(battleId);
    
    // Update player 2 info
    session.player2 = {
      id: sessionStorage.getItem('playerId') || uuidv4(),
      name: player2Name,
      pokemonId: pokemonId,
      ready: true
    };
    
    // If both players are ready, update status
    if (session.player1.ready && session.player2.ready) {
      session.status = 'ready';
    }
    
    // Update the session
    const response = await fetch(`${API_URL}/battleSessions/${battleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(session)
    });
    
    return response.json();
  },
  
  // Update battle status and results
  updateBattleResult: async (battleId, rounds, winner) => {
    const session = await battleSessionService.getSession(battleId);
    
    session.status = 'completed';
    session.result = {
      winner: winner,
      rounds: rounds,
      completedAt: new Date().toISOString()
    };
    
    const response = await fetch(`${API_URL}/battleSessions/${battleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(session)
    });
    
    return response.json();
  },
  
  // Poll for session updates
  pollSession: async (battleId, interval = 2000) => {
    return new Promise((resolve) => {
      const poll = async () => {
        try {
          const session = await battleSessionService.getSession(battleId);
          if (session.status !== 'waiting') {
            resolve(session);
          } else {
            setTimeout(poll, interval);
          }
        } catch (error) {
          setTimeout(poll, interval);
        }
      };
      
      poll();
    });
  }
};