import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2';
const JSON_SERVER_URL = 'http://localhost:3001';

// PokéAPI services
export const fetchPokemons = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${API_URL}/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon list:', error);
    throw error;
  }
};

export const fetchPokemonDetails = async (nameOrId) => {
  try {
    const response = await axios.get(`${API_URL}/pokemon/${nameOrId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for Pokémon ${nameOrId}:`, error);
    throw error;
  }
};

export const searchPokemon = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/pokemon/${query.toLowerCase()}`);
    return [response.data]; // Return as array for consistency
  } catch (error) {
    console.error('Error searching for Pokémon:', error);
    return []; // Return empty array if not found
  }
};

// json-server services
export const getTeam = async () => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/team`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};

export const addToTeam = async (pokemon) => {
  try {
    const team = await getTeam();
    if (team.length >= 6) {
      throw new Error('Team is already full (max 6 Pokémon)');
    }
    
    const response = await axios.post(`${JSON_SERVER_URL}/team`, pokemon);
    return response.data;
  } catch (error) {
    console.error('Error adding Pokémon to team:', error);
    throw error;
  }
};

export const removeFromTeam = async (id) => {
  try {
    await axios.delete(`${JSON_SERVER_URL}/team/${id}`);
    return true;
  } catch (error) {
    console.error('Error removing Pokémon from team:', error);
    throw error;
  }
};

export const saveBattleResult = async (battleData) => {
  try {
    const response = await axios.post(`${JSON_SERVER_URL}/battles`, {
      ...battleData,
      date: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error saving battle result:', error);
    throw error;
  }
};

export const getBattleHistory = async () => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/battles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching battle history:', error);
    throw error;
  }
};