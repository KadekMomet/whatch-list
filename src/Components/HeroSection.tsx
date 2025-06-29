import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

// Tambahkan tipe Movie
type Movie = {
  id: string;
  title: string;
//   description: string;
  country: string;
  release_year: number;
  genre: string;
  type: string;
  rating: number;
  is_favorite: boolean;
  is_watched: boolean;
  watch_later: boolean;
  poster_url?: string;
  trailer_url?: string;
};

interface HeroSectionProps {
  movies: Movie[];
  onShowTrailer: (trailerUrl: string) => void;
}

const HeroSection = ({ movies, onShowTrailer }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const topMovies = movies
    .filter(movie => movie.rating >= 8)
    .slice(0, 5);

  useEffect(() => {
    if (topMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topMovies.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [topMovies.length]);

  if (topMovies.length === 0) return null;

  const currentMovie = topMovies[currentSlide];

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10" />
      
      {currentMovie.poster_url ? (
        <Image 
          src={currentMovie.poster_url} 
          alt={currentMovie.title} 
          width={1920}
          height={1920}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-primary to-secondary" />
      )}
      
      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center mb-2">
              <div className="bg-primary px-3 py-1 rounded-full text-sm font-bold mr-3">
                {currentMovie.type === 'movie' ? 'MOVIE' : 'SERIES'}
              </div>
              <div className="flex items-center text-yellow-400">
                <FaStar className="mr-1" />
                <span>{currentMovie.rating.toFixed(1)}</span>
              </div>
              <span className="mx-3">•</span>
              <span>{currentMovie.release_year}</span>
              <span className="mx-3">•</span>
              <span>{currentMovie.genre}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentMovie.title}
            </h1>
            
            {/* <p className="text-gray-300 mb-6 line-clamp-2">
              {currentMovie.description}
            </p> */}
            
            <div className="flex space-x-4">
              <button 
                onClick={() => onShowTrailer(currentMovie.trailer_url || '')}
                className="bg-white text-gray-600 px-6 py-3 rounded-full flex items-center font-semibold hover:bg-gray-300 transition-colors"
              >
                <FaPlay className="mr-2" /> Putar Trailer
              </button> 
              <button className="bg-gray-700 bg-opacity-70 text-white px-6 py-3 rounded-full flex items-center hover:bg-gray-600 transition-colors">
                + Daftar Tonton
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="absolute bottom-8 right-8 z-30 flex space-x-2">
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + topMovies.length) % topMovies.length)}
          className="bg-gray-800 bg-opacity-70 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <FaChevronLeft />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % topMovies.length)}
          className="bg-gray-800 bg-opacity-70 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <FaChevronRight />
        </button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {topMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-6' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;