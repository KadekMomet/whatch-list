import { FaFilter, FaSort } from 'react-icons/fa';

// Definisikan ulang tipe Category dan FilterState
type Category = {
  id: string;
  name: string;
  type: string;
};

type FilterState = {
  search: string;
  country: string;
  year: string;
  genre: string;
  type: string;
  sort: string;
};

interface FilterBarProps {
  countryCategories: Category[];
  yearCategories: Category[];
  genreCategories: Category[];
  typeCategories: Category[];
  filters: FilterState;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortOption: string) => void;
}

const FilterBar = ({ 
  countryCategories, 
  yearCategories, 
  genreCategories, 
  typeCategories,
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
        
        <select
          value={filters.country}
          onChange={(e) => onFilterChange('country', e.target.value)}
          className="bg-gray-700 text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Semua Negara</option>
          {countryCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        
        <select
          value={filters.year}
          onChange={(e) => onFilterChange('year', e.target.value)}
          className="bg-gray-700 text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Semua Tahun</option>
          {yearCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        
        <select
          value={filters.genre}
          onChange={(e) => onFilterChange('genre', e.target.value)}
          className="bg-gray-700 text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Semua Genre</option>
          {genreCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="bg-gray-700 text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Semua Tipe</option>
          {typeCategories.map((category) => (
            <option key={category.id} value={category.name.toLowerCase()}>
              {category.name}
            </option>
          ))}
        </select>
        
        <div className="flex items-center ml-auto text-gray-300">
          <FaSort className="mr-2" />
          <span>Urutkan:</span>
          <select
            value={filters.sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="ml-2 bg-gray-700 text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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