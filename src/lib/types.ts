
export type Genre = {
  id: string;
  name: string;
};

export type Movie = {
  id: string;
  title: string;
  description: string;
  poster_url?: string;
  rating: number;
  release_year: number;
  trailer_url?: string;
  type: string; // movie atau series
  country: string;
  is_watched: boolean;
  is_favorite: boolean;
  watch_later: boolean;
  genres: Genre[]; // genre dalam bentuk objek id + name
};

export type MovieFormData = {
  title: string;
  description: string;
  poster_url?: string;
  rating: number;
  release_year: number;
  trailer_url?: string;
  type: string;
  country: string;
  is_watched: boolean;
  is_favorite: boolean;
  watch_later: boolean;
  genres: string[]; // ID genre saja, bukan objek Genre[]
};


export type FilterState = {
  search: string;
  genre: string;
  type: string;
  sort: string;
  watchStatus: string; // 'watched', 'watchLater', 'unwatched', ''

};

export type Category = {
  id: string;
  name: string;
  type: string;
};


// Error field form (optional dan hanya sebagian field MovieFormData)
export type MovieFormErrors = Partial<Record<keyof MovieFormData, string>>;
