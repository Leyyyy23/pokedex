import { useState, useEffect } from 'react';
import { fetchPokemons, fetchPokemonDetails, searchPokemon } from '../services/pokeApi';

export const usePokemonList = (limit = 20, initialOffset = 0) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemons(limit, offset);
        setTotal(data.count);
        setHasMore(offset + limit < data.count);
        
        // Fetch details for each Pokémon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const details = await fetchPokemonDetails(pokemon.name);
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
              types: details.types.map(type => type.type.name),
              stats: details.stats.reduce((acc, stat) => {
                acc[stat.stat.name] = stat.base_stat;
                return acc;
              }, {}),
              abilities: details.abilities.map(ability => ability.ability.name)
            };
          })
        );
        
        setPokemons(pokemonDetails);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Pokémon. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, [limit, offset]);

  const nextPage = () => {
    if (hasMore) {
      setOffset(prev => prev + limit);
    }
  };

  const prevPage = () => {
    if (offset >= limit) {
      setOffset(prev => prev - limit);
    }
  };

  return { pokemons, loading, error, nextPage, prevPage, hasMore, offset, total };
};

export const usePokemonSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await searchPokemon(query);
      setSearchResults(results);
      setSearchError(null);
    } catch (err) {
      setSearchError('No Pokémon found with that name.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return { searchResults, searching, searchError, performSearch };
};

export function usePokemon() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemons(limit, offset);
        setPokemons(data.results);
        setTotal(data.count);
        setHasMore(offset + limit < data.count);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Pokémon list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, [limit, offset]);

  const nextPage = () => {
    if (hasMore) {
      setOffset(prev => prev + limit);
    }
  };

  const prevPage = () => {
    if (offset >= limit) {
      setOffset(prev => prev - limit);
    }
  };

  return { pokemons, loading, error, nextPage, prevPage, hasMore, offset, total };
}

export const usePokemonDetails = (nameOrId) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPokemonDetails = async () => {
      if (!nameOrId) return;
      
      try {
        setLoading(true);
        const details = await fetchPokemonDetails(nameOrId);
        
        setPokemon({
          id: details.id,
          name: details.name,
          image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
          types: details.types.map(type => type.type.name),
          stats: details.stats.reduce((acc, stat) => {
            acc[stat.stat.name] = stat.base_stat;
            return acc;
          }, {}),
          abilities: details.abilities.map(ability => ability.ability.name),
          height: details.height / 10, // Convert to meters
          weight: details.weight / 10, // Convert to kg
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch Pokémon details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemonDetails();
  }, [nameOrId]);

  return { pokemon, loading, error };
};