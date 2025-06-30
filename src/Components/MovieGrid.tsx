import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { Movie } from '@/lib/types'; 

interface MovieGridProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onToggleWatched: (id: string, isWatched: boolean) => void;
  onToggleWatchLater: (id: string, watchLater: boolean) => void;
  onShowTrailer: (trailerUrl: string) => void;
}

const MovieGrid = ({
  movies,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleWatched,
  onToggleWatchLater,
  onShowTrailer
}: MovieGridProps) => {
  if (movies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h3 className="text-xl text-gray-400">Tidak ada film ditemukan</h3>
        <p className="text-gray-500 mt-2">Coba ubah filter pencarian Anda</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {movies.map((movie, index) => (
        <motion.div
          key={movie.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
            type: 'spring',
            stiffness: 100,
            damping: 15
          }}
          whileHover={{ scale: 1.03 }}
        >
          <MovieCard
            movie={movie}
            onEdit={() => onEdit(movie)}
            onDelete={() => onDelete(movie.id)}
            onToggleFavorite={() => onToggleFavorite(movie.id, movie.is_favorite)}
            onToggleWatched={() => onToggleWatched(movie.id, movie.is_watched)}
            onToggleWatchLater={() => onToggleWatchLater(movie.id, movie.watch_later)}
            onShowTrailer={() => movie.trailer_url && onShowTrailer(movie.trailer_url)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MovieGrid;
