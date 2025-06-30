'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/Components/Navbar';
import HeroSection from '@/Components/HeroSection';
import FilterBar from '@/Components/FilterBar';
import MovieGrid from '@/Components/MovieGrid';
import MovieForm from '@/Components/MovieForm';
import TrailerModal from '@/Components/TrailerModal';
import { Movie, Category, Genre, FilterState, MovieFormData } from '@/lib/types';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    genre: '',
    type: '',
    sort: 'rating_desc',
    watchStatus: '', 
  });

  useEffect(() => {
    const fetchMovies = async () => {
      const { data, error } = await supabase
        .from('movies')
        .select(`
          *,
          movie_genres (
            genres (
              id,
              name
            )
          )
        `);

      if (!error && data) {
        const moviesWithGenres: Movie[] = data.map(movie => ({
          ...movie,
          genres: movie.movie_genres.map((mg: { genres: Genre }) => mg.genres),
        }));

        setMovies(moviesWithGenres);
        setFilteredMovies(moviesWithGenres);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data) setCategories(data);
    };

    const fetchGenres = async () => {
      const { data, error } = await supabase.from('genres').select('*');
      if (!error && data) setGenres(data);
    };

    fetchMovies();
    fetchCategories();
    fetchGenres();
  }, []);

  useEffect(() => {
    let result = [...movies];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(term) ||
        movie.description.toLowerCase().includes(term)
      );
    }


    if (filters.genre) {
      result = result.filter(movie =>
        movie.genres.some(g => g.id === filters.genre)
      );
    }

    if (filters.type) {
      result = result.filter(movie => movie.type === filters.type);
    }

    if (filters.watchStatus) {
      switch (filters.watchStatus) {
        case 'watched':
          result = result.filter(movie => movie.is_watched);
          break;
        case 'watchLater':
          result = result.filter(movie => movie.watch_later);
          break;
        case 'unwatched':
          result = result.filter(movie => !movie.is_watched);
          break;
      }
    }


    switch (filters.sort) {
      case 'rating_desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_asc':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'year_desc':
        result.sort((a, b) => b.release_year - a.release_year);
        break;
      case 'year_asc':
        result.sort((a, b) => a.release_year - b.release_year);
        break;
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

  const handleSaveMovie = async (movieData: MovieFormData): Promise<void> => {
    if (editingMovie) {
      const { data: updatedMovie, error } = await supabase
        .from('movies')
        .update({
          title: movieData.title,
          description: movieData.description,
          poster_url: movieData.poster_url,
          rating: movieData.rating,
          release_year: movieData.release_year,
          trailer_url: movieData.trailer_url,
          type: movieData.type,
          country: movieData.country,
          is_watched: movieData.is_watched,
          is_favorite: movieData.is_favorite,
          watch_later: movieData.watch_later
        })
        .eq('id', editingMovie.id)
        .select()
        .single();

      if (!error && updatedMovie) {
        if (movieData.genres) {
          await supabase.from('movie_genres').delete().eq('movie_id', editingMovie.id);

          const relations = movieData.genres.map(gid => ({
            movie_id: editingMovie.id,
            genre_id: gid,
          }));

          await supabase.from('movie_genres').insert(relations);

          const { data: genreData } = await supabase
            .from('genres')
            .select('id, name')
            .in('id', movieData.genres);

          if (genreData) {
            setMovies(movies.map(m =>
              m.id === editingMovie.id
                ? { ...updatedMovie, genres: genreData }
                : m
            ));
          }
        } else {
          setMovies(movies.map(m =>
            m.id === editingMovie.id
              ? { ...updatedMovie, genres: m.genres }
              : m
          ));
        }
      }
    } else {
      const { data: newMovie, error } = await supabase
        .from('movies')
        .insert([{
          title: movieData.title,
          description: movieData.description,
          poster_url: movieData.poster_url,
          rating: movieData.rating,
          release_year: movieData.release_year,
          trailer_url: movieData.trailer_url,
          type: movieData.type,
          country: movieData.country,
          is_watched: movieData.is_watched,
          is_favorite: movieData.is_favorite,
          watch_later: movieData.watch_later
        }])
        .select()
        .single();

      if (!error && newMovie && movieData.genres) {
        const relations = movieData.genres.map(gid => ({
          movie_id: newMovie.id,
          genre_id: gid,
        }));

        await supabase.from('movie_genres').insert(relations);

        const { data: genreData } = await supabase
          .from('genres')
          .select('id, name')
          .in('id', movieData.genres);

        if (genreData) {
          setMovies([...movies, { ...newMovie, genres: genreData }]);
        }
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
      setMovies(movies.map(m =>
        m.id === id ? { ...m, is_favorite: !isFavorite } : m
      ));
    }
  };

  const handleToggleWatched = async (id: string, isWatched: boolean) => {
    const { error } = await supabase
      .from('movies')
      .update({ is_watched: !isWatched })
      .eq('id', id);

    if (!error) {
      setMovies(movies.map(m =>
        m.id === id ? { ...m, is_watched: !isWatched } : m
      ));
    }
  };

  const handleToggleWatchLater = async (id: string, watchLater: boolean) => {
    const { error } = await supabase
      .from('movies')
      .update({ watch_later: !watchLater })
      .eq('id', id);

    if (!error) {
      setMovies(movies.map(m =>
        m.id === id ? { ...m, watch_later: !watchLater } : m
      ));
    }
  };

  const handleShowTrailer = (url: string) => {
    setSelectedTrailer(url);
  };

  const getCountryCategories = () => categories.filter(c => c.type === 'country');
  const getYearCategories = () => categories.filter(c => c.type === 'year');
  const getTypeCategories = () => categories.filter(c => c.type === 'type');

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-gray-900 text-light">
      <Navbar onSearch={handleSearch} onCreateMovie={handleCreateMovie} />

      <HeroSection
          movies={movies}
          onShowTrailer={handleShowTrailer}
         />


      <div className="container mx-auto px-4 py-8">
        <FilterBar
          countryCategories={getCountryCategories()}
          yearCategories={getYearCategories()}
          genreCategories={genres}
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
          movie={
            editingMovie
              ? {
                  ...editingMovie,
                  genres: editingMovie.genres.map((g) => g.id), 
                }
              : null
          }
          genres={genres}
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
