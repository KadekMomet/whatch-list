import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaTrash } from 'react-icons/fa';

// Tambahkan tipe Movie dan MovieFormData
type Movie = {
  id?: string;
  title: string;
  description: string;
  poster_url?: string;
  rating: number;
  release_year: number;
  trailer_url?: string;
  type: string;
  country: string;
  genre: string;
  is_watched: boolean;
  is_favorite: boolean;
  watch_later: boolean;
};

type MovieFormData = Omit<Movie, 'id'>;

type MovieFormErrors = Partial<Record<keyof MovieFormData, string>>;

interface MovieFormProps {
  movie: Movie | null;
  onClose: () => void;
  onSave: (movieData: MovieFormData) => void;
}

const MovieForm = ({ movie, onClose, onSave }: MovieFormProps) => {
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    description: '',
    poster_url: '',
    rating: 0,
    release_year: new Date().getFullYear(),
    trailer_url: '',
    type: 'movie',
    country: '',
    genre: '',
    is_watched: false,
    is_favorite: false,
    watch_later: false
  });

  const [errors, setErrors] = useState<MovieFormErrors>({});

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        poster_url: movie.poster_url || '',
        rating: movie.rating || 0,
        release_year: movie.release_year || new Date().getFullYear(),
        trailer_url: movie.trailer_url || '',
        type: movie.type || 'movie',
        country: movie.country || '',
        genre: movie.genre || '',
        is_watched: movie.is_watched || false,
        is_favorite: movie.is_favorite || false,
        watch_later: movie.watch_later || false
      });
    }
  }, [movie]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as { name: keyof MovieFormData; value: string };
    setFormData({
      ...formData,
      [name]:
        name === 'rating' || name === 'release_year'
          ? Number(value)
          : value
    });

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleToggle = (field: string) => {
    setFormData({
      ...formData,
      [field]: !formData[field as keyof typeof formData]
    });
  };

  const validate = () => {
    const newErrors: MovieFormErrors = {};
    
    if (!formData.title) newErrors.title = 'Judul wajib diisi';
    if (!formData.release_year) newErrors.release_year = 'Tahun rilis wajib diisi';
    if (!formData.country) newErrors.country = 'Negara wajib diisi';
    if (!formData.genre) newErrors.genre = 'Genre wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {movie ? 'Edit Film' : 'Tambah Film Baru'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.title ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="Judul film"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              
              {/* <div className="mb-4">
                <label className="block text-gray-300 mb-2">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.description ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="Deskripsi film"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div> */}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Tahun Rilis</label>
                  <input
                    type="number"
                    name="release_year"
                    value={formData.release_year}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className={`w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                      errors.release_year ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  {errors.release_year && <p className="text-red-500 text-sm mt-1">{errors.release_year}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Rating (0-10)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    // step="0.1"
                    className="w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">URL Poster (Opsional)</label>
                <input
                  type="text"
                  name="poster_url"
                  value={formData.poster_url}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/poster.jpg"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">URL Trailer YouTube (Opsional)</label>
                <input
                  type="text"
                  name="trailer_url"
                  value={formData.trailer_url}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Tipe</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Negara</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                      errors.country ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-primary'
                    }`}
                    placeholder="Negara asal"
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.genre ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="Genre film"
                />
                {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
              </div>
              
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_watched"
                    checked={formData.is_watched}
                    onChange={() => handleToggle('is_watched')}
                    className="mr-2 h-5 w-5 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="is_watched" className="text-gray-300">
                    Sudah ditonton
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_favorite"
                    checked={formData.is_favorite}
                    onChange={() => handleToggle('is_favorite')}
                    className="mr-2 h-5 w-5 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="is_favorite" className="text-gray-300">
                    Favorit
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="watch_later"
                    checked={formData.watch_later}
                    onChange={() => handleToggle('watch_later')}
                    className="mr-2 h-5 w-5 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="watch_later" className="text-gray-300">
                    Akan ditonton
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6 border-t border-gray-800 pt-4">
            {movie && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin menghapus film ini?')) {
                    onClose();
                  }
                }}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
              >
                <FaTrash className="mr-2" /> Hapus
              </button>
            )}
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary rounded-lg text-white transition-all"
            >
              <FaSave className="mr-2" /> Simpan
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MovieForm;