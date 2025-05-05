import React, { useState, useEffect } from 'react';
import PokemonCard from '../components/pokemon/PokemonCard';
import PokemonModal from '../components/pokemon/PokemonModal';
import '../styles/PokemonListPage.css';

const PokemonListPage = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [team, setTeam] = useState(() => {
    const savedTeam = localStorage.getItem('pokemonTeam');
    return savedTeam ? JSON.parse(savedTeam) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const limit = 20;
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon');
        }
        
        const data = await response.json();
        
        // Fetch details for each Pokémon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            const detailData = await detailResponse.json();
            
            return {
              id: detailData.id,
              name: detailData.name,
              image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
              types: detailData.types.map(type => type.type.name)
            };
          })
        );
        
        setPokemon(pokemonDetails);
      } catch (err) {
        setError('Failed to load Pokémon. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPokemon();
  }, [page, offset]);

  const addToTeam = (pokemon) => {
    if (team.length >= 6) {
      alert('Your team is full! Remove a Pokémon before adding a new one.');
      return;
    }
    
    if (team.some(p => p.id === pokemon.id)) {
      alert('This Pokémon is already in your team!');
      return;
    }
    
    const newTeam = [...team, pokemon];
    setTeam(newTeam);
    localStorage.setItem('pokemonTeam', JSON.stringify(newTeam));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      setSearchQuery('');
      setIsSearching(false);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    
    try {
      setLoading(true);
      setIsSearching(true);
      
      // Try to fetch by exact name or ID first
      try {
        const query = searchQuery.toLowerCase().trim();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        
        if (response.ok) {
          const data = await response.json();
          const pokemonDetail = {
            id: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
            types: data.types.map(type => type.type.name)
          };
          
          setSearchResults([pokemonDetail]);
          setLoading(false);
          return;
        }
      } catch (err) {
        // If exact match fails, continue to search by listing
        console.log("Exact match not found, searching in list...");
      }
      
      // If exact match fails, fetch a larger list and filter
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
      const data = await response.json();
      
      // Filter results that include the search query
      const filteredResults = data.results.filter(p => 
        p.name.includes(searchQuery.toLowerCase().trim())
      );
      
      // Limit to first 20 matches
      const limitedResults = filteredResults.slice(0, 20);
      
      // Fetch details for each match
      const pokemonDetails = await Promise.all(
        limitedResults.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          const detailData = await detailResponse.json();
          
          return {
            id: detailData.id,
            name: detailData.name,
            image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
            types: detailData.types.map(type => type.type.name)
          };
        })
      );
      
      setSearchResults(pokemonDetails);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const openPokemonModal = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const closePokemonModal = () => {
    setSelectedPokemon(null);
  };

  if (loading && pokemon.length === 0 && !isSearching) {
    return (
      <div className="pokemon-list-container">
        <h1>Browse Pokémon</h1>
        <div className="loading">Loading Pokémon...</div>
      </div>
    );
  }

  if (error && !isSearching) {
    return (
      <div className="pokemon-list-container">
        <h1>Browse Pokémon</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="pokemon-list-container">
      <h1>Browse Pokémon</h1>
      
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i> Search
          </button>
          {isSearching && (
            <button type="button" onClick={clearSearch} className="clear-search-button">
              <i className="fas fa-times"></i> Clear
            </button>
          )}
        </form>
      </div>
      
      {loading && <div className="loading">Loading...</div>}
      
      <div className="pokemon-grid">
        {isSearching
          ? searchResults.map(p => (
              <PokemonCard 
                key={p.id} 
                pokemon={p} 
                isInTeam={team.some(tp => tp.id === p.id)}
                onAddToTeam={() => addToTeam(p)}
                showAddButton={true}
                onCardClick={openPokemonModal}
              />
            ))
          : pokemon.map(p => (
              <PokemonCard 
                key={p.id} 
                pokemon={p} 
                isInTeam={team.some(tp => tp.id === p.id)}
                onAddToTeam={() => addToTeam(p)}
                showAddButton={true}
                onCardClick={openPokemonModal}
              />
            ))}
      </div>
      
      {!isSearching && (
        <div className="pagination-controls">
          <button 
            onClick={handlePrevPage} 
            disabled={page === 1 || loading}
            className="pagination-button"
          >
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          <span>Page {page}</span>
          <button 
            onClick={handleNextPage}
            disabled={loading}
            className="pagination-button"
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
      
      {selectedPokemon && (
        <PokemonModal 
          pokemon={selectedPokemon} 
          onClose={closePokemonModal} 
        />
      )}
    </div>
  );
};

export default PokemonListPage;
