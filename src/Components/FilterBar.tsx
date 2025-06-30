import { FaFilter, FaSort } from 'react-icons/fa';
import { Category, FilterState, Genre } from '@/lib/types'; 


interface FilterBarProps {
  countryCategories: Category[];
  yearCategories: Category[];
  genreCategories: Genre[]; 
  typeCategories: Category[];
  filters: FilterState;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortOption: string) => void;
}

const FilterBar = ({   
  genreCategories, 
  filters,
  onFilterChange,
  onSortChange
}: FilterBarProps) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center text-gray-300">
          <FaFilter className="mr-2" />
          <span>Filter:</span>
        </div>
        
        {/* Genre Filter - Sekarang menggunakan data dari tabel genres */}
          <select
            value={filters.genre}
            onChange={(e) => onFilterChange('genre', e.target.value)}
            className="bg-gray-700 text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="">Semua Genre</option>
            {genreCategories.map((genre) => (
              <option key={genre.id} value={genre.id}> {/* Gunakan genre.id sebagai value */}
                {genre.name}
              </option>
            ))}
          </select>
        
        {/* Filter Tipe Movie / Series */}
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="bg-gray-700 text-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="">Format</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>


          {/* Gabungan Watched & Watch Later */}
          <select
            value={filters.watchStatus}
            onChange={(e) => onFilterChange('watchStatus', e.target.value)}
            className="bg-gray-700 text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="watched">Sudah Ditonton</option>
            <option value="watchLater">Tonton Nanti</option>
            <option value="unwatched">Belum Ditonton</option>
          </select>


        
        <div className="flex items-center ml-auto text-gray-300">
          <FaSort className="mr-2" />
          <span>Urutkan:</span>
          <select
            value={filters.sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="ml-2 bg-gray-700 text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="rating_desc">Rating (Tinggi ke Rendah)</option>
            <option value="rating_asc">Rating (Rendah ke Tinggi)</option>
            <option value="year_desc">Tahun (Terbaru)</option>
            <option value="year_asc">Tahun (Terlama)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;