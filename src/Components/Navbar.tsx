import { useState } from 'react';
import { FaSearch, FaPlus, FaUser, FaFilm, } from 'react-icons/fa';

interface NavbarProps {
  onSearch: (searchTerm: string) => void;
  onCreateMovie: () => void;
}

const Navbar = ({ onSearch, onCreateMovie }: NavbarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
              <FaFilm className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-white-400 bg-gradient-to-r from-primary to-accent">
              List Movie
            </h1>
          </div>
          
          <div className="flex-1 max-w-2xl w-full">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari film atau series..."
                className="w-full py-2 px-4 pl-10 bg-gray-800 text-light rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCreateMovie}
              className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white py-2 px-4 rounded-full flex items-center transition-all duration-300"
            >
              <FaPlus className="mr-2" />
              <span className="hidden sm:inline">Tambah Film</span>
            </button>
            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
              <FaUser className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;