import { motion } from 'framer-motion';
import { FaTimes, FaPlay } from 'react-icons/fa';

interface TrailerModalProps {
  trailerUrl: string;
  onClose: () => void;
}

const TrailerModal = ({ trailerUrl, onClose }: TrailerModalProps) => {
  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(trailerUrl);
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-900 rounded-xl w-full max-w-4xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="text-xl font-bold">Trailer</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="relative aspect-video">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-gray-400">
              <FaPlay size={50} className="mb-4" />
              <p className="text-lg">Trailer tidak tersedia</p>
              <p className="mt-2 text-sm">URL trailer tidak valid</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrailerModal;