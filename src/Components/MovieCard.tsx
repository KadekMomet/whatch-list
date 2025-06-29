import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FaStar, 
  FaRegStar, 
  FaEye, 
  FaRegEye, 
  FaBookmark, 
  FaRegBookmark,
  FaPlay,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

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

interface MovieCardProps {
  movie: Movie;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onToggleWatched: () => void;
  onToggleWatchLater: () => void;
  onShowTrailer: () => void;
}

const MovieCard = ({ 
  movie, 
  onEdit, 
  onDelete,
  onToggleFavorite,
  onToggleWatched,
  onToggleWatchLater,
  onShowTrailer
}: MovieCardProps) => {
  return (
    <motion.div 
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      whileHover={{ y: -5 }}
    >
      {/* Movie Poster */}
      <div className="relative">
        {movie.poster_url ? (
          <Image 
            src={movie.poster_url}
            width={300}
            height={300}
            alt={movie.title} 
            className="w-full h-60 object-cover"
          />
        ) : (
          <div className="w-full h-60 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-lg font-bold">{movie.title}</span>
          </div>
        )}
        
        {/* Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-xs font-bold">
          {movie.type === 'movie' ? 'MOVIE' : 'SERIES'}
        </div>
        
        {/* Play Button */}
        {movie.trailer_url && (
          <button 
            onClick={onShowTrailer}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="bg-white text-dark p-3 rounded-full">
              <FaPlay />
            </div>
          </button>
        )}
      </div>
      
      {/* Movie Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{movie.title}</h3>
          <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full text-sm">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="text-gray-400 text-sm mb-4">
          <div className="flex flex-wrap gap-2">
            <span>{movie.release_year}</span>
            <span>•</span>
            <span>{movie.country}</span>
            <span>•</span>
            <span>{movie.genre}</span>
          </div>
        </div>
        
        {/* <p className="text-gray-300 text-sm line-clamp-2 mb-4">
          {movie.description}
        </p> */}
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button 
              onClick={onToggleFavorite}
              className={`p-2 rounded-full ${
                movie.is_favorite 
                  ? 'text-yellow-400 bg-yellow-400 bg-opacity-10' 
                  : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
              }`}
              aria-label={movie.is_favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
            >
              {movie.is_favorite ? <FaStar /> : <FaRegStar />}
            </button>
            
            <button 
              onClick={onToggleWatched}
              className={`p-2 rounded-full ${
                movie.is_watched 
                  ? 'text-green-400 bg-green-400 bg-opacity-10' 
                  : 'text-gray-400 hover:text-green-400 hover:bg-green-400 hover:bg-opacity-10'
              }`}
              aria-label={movie.is_watched ? "Tandai belum ditonton" : "Tandai sudah ditonton"}
            >
              {movie.is_watched ? <FaEye /> : <FaRegEye />}
            </button>
            
            <button 
              onClick={onToggleWatchLater}
              className={`p-2 rounded-full ${
                movie.watch_later 
                  ? 'text-blue-400 bg-blue-400 bg-opacity-10' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-400 hover:bg-opacity-10'
              }`}
              aria-label={movie.watch_later ? "Hapus dari daftar tonton" : "Tambah ke daftar tonton"}
            >
              {movie.watch_later ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={onEdit}
              className="p-2 rounded-full text-gray-400 hover:text-primary hover:bg-primary hover:bg-opacity-10"
              aria-label="Edit film"
            >
              <FaEdit />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500 hover:bg-opacity-10"
              aria-label="Hapus film"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;