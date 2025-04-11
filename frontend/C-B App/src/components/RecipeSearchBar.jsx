import React, { useState } from 'react';
import axios from 'axios';

export default function RecipeSearchBar({ routeType, onSearchResults }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    try {
      let res;

      if (routeType === 'all') {
        res = await axios.get(`http://localhost:5000/recipe/search?title=${searchText}`);
      } else if (routeType === 'my') {
        const token = localStorage.getItem('token');
        res = await axios.get(`http://localhost:5000/recipe/my/search?title=${searchText}`, {
          headers: { authorization: 'bearer ' + token },
        });
      }

      onSearchResults(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      onSearchResults([]);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search recipe by title..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
