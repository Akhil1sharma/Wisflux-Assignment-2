import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RecipeItems from '../components/RecipeItems';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query?.trim()) {
        const res = await axios.get(`http://localhost:5000/recipe/search?title=${query}`);
        setResults(res.data || []);
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Search Results for "{query}"</h2>
      <RecipeItems recipes={results} />
    </>
  );
}
