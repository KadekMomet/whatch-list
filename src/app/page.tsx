'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/Components/Navbar';
import HeroSection from '@/Components/HeroSection';
import FilterBar from '@/Components/FilterBar';
import MovieGrid from '@/Components/MovieGrid';
import MovieForm from '@/Components/MovieForm';
import TrailerModal from '@/Components/TrailerModal';

// Tambahkan interface untuk Movie dan Category
type Movie = {
  id: string;
  title: string;
  description: string;
  country: string;
  release_year: number;
  genre: string;
  type: string;
  rating: number;
  is_favorite: boolean;
  is_watched: boolean;
  watch_later: boolean;
  trailer_url?: string;
  // tambahkan field lain sesuai kebutuhan
};

type Category = {
  id: string;
  name: string;
  type: string;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    year: '',
    genre: '',
    type: '',
    sort: 'rating_desc',
  });

  // Fetch movies and categories
  useEffect(() => {
    const fetchMovies = async () => {
      const { data, error } = await supabase.from('movies').select('*');
      if (!error && data) {
        setMovies(data);
        setFilteredMovies(data);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data) setCategories(data);
    };

    fetchMovies();
    fetchCategories();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...movies];
     
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) || 
        movie.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Country filter
    if (filters.country) {
      result = result.filter(movie => movie.country === filters.country);
    }
    
    // Year filter
    if (filters.year) {
      result = result.filter(movie => movie.release_year === parseInt(filters.year));
    }
    
    // Genre filter
    if (filters.genre) {
      result = result.filter(movie => movie.genre === filters.genre);
    }
    
    // Type filter
    if (filters.type) {
      result = result.filter(movie => movie.type === filters.type);
    }
    
    // Sorting
    if (filters.sort === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'rating_asc') {
      result.sort((a, b) => a.rating - b.rating);
    } else if (filters.sort === 'year_desc') {
      result.sort((a, b) => b.release_year - a.release_year);
    } else if (filters.sort === 'year_asc') {
      result.sort((a, b) => a.release_year - b.release_year);
    }
    
    setFilteredMovies(result);
  }, [movies, filters]);

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const handleSortChange = (sortOption: string) => {
    setFilters({ ...filters, sort: sortOption });
  };

  const handleCreateMovie = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleDeleteMovie = async (id: string) => {
    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (!error) {
      setMovies(movies.filter(movie => movie.id !== id));
    }
  };

  const handleSaveMovie = async (movieData: Partial<Movie>) => {

    if (editingMovie) {
      // Update existing movie
      const { data, error } = await supabase
        .from('movies')
        .update(movieData)
        .eq('id', editingMovie.id)
        .select();
      
      if (!error && data) {
        setMovies(movies.map(m => m.id === editingMovie.id ? data[0] : m));
      }
    } else {
      // Create new movie
      const { data, error } = await supabase
        .from('movies')
        .insert([movieData])
        .select();
      
      if (!error && data) {
        setMovies([...movies, data[0]]);
      }
    }
    setShowForm(false);
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    const { error } = await supabase
      .from('movies')
      .update({ is_favorite: !isFavorite })
      .eq('id', id);
    
    if (!error) {
      setMovies(movies.map(movie => 
        movie.id === id ? { ...movie, is_favorite: !isFavorite } : movie
      ));
    }
  };

  const handleToggleWatched = async (id: string, isWatched: boolean) => {
    const { error } = await supabase
      .from('movies')
      .update({ is_watched: !isWatched })
      .eq('id', id);
    
    if (!error) {
      setMovies(movies.map(movie => 
        movie.id === id ? { ...movie, is_watched: !isWatched } : movie
      ));
    }
  };

  const handleToggleWatchLater = async (id: string, watchLater: boolean) => {
    const { error } = await supabase
      .from('movies')
      .update({ watch_later: !watchLater })
      .eq('id', id);
    
    if (!error) {
      setMovies(movies.map(movie => 
        movie.id === id ? { ...movie, watch_later: !watchLater } : movie
      ));
    }
  };

  const handleShowTrailer = (trailerUrl: string) => {
    setSelectedTrailer(trailerUrl);
  };

  const getCountryCategories = () => categories.filter(cat => cat.type === 'country');
  const getYearCategories = () => categories.filter(cat => cat.type === 'year');
  const getGenreCategories = () => categories.filter(cat => cat.type === 'genre');
  const getTypeCategories = () => categories.filter(cat => cat.type === 'type');

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-gray-900 text-light">
      <Navbar 
        onSearch={handleSearch} 
        onCreateMovie={handleCreateMovie} 
      />
      
      <HeroSection movies={movies} onShowTrailer={handleShowTrailer} />
      
      <div className="container mx-auto px-4 py-8">
        <FilterBar 
          countryCategories={getCountryCategories()}
          yearCategories={getYearCategories()}
          genreCategories={getGenreCategories()}
          typeCategories={getTypeCategories()}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
        
        <MovieGrid 
          movies={filteredMovies} 
          onEdit={handleEditMovie}
          onDelete={handleDeleteMovie}
          onToggleFavorite={handleToggleFavorite}
          onToggleWatched={handleToggleWatched}
          onToggleWatchLater={handleToggleWatchLater}
          onShowTrailer={handleShowTrailer}
        />
      </div>
      
      {showForm && (
        <MovieForm 
          movie={editingMovie} 
          onClose={() => setShowForm(false)} 
          onSave={handleSaveMovie}
        />
      )}
      
      {selectedTrailer && (
        <TrailerModal 
          trailerUrl={selectedTrailer} 
          onClose={() => setSelectedTrailer(null)} 
        />
      )}
    </div>
  );
}