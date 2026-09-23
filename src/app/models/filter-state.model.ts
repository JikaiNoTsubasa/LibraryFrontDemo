/**
 * Filter State Model
 * Represents the current state of filters applied to the book catalog
 */
export interface FilterState {
  /** Selected genre filters */
  genres: string[];

  /** Selected author ID filters */
  authorIds: string[];

  /** Price range filter */
  priceRange: {
    min: number;
    max: number;
  };

  /** Search query string */
  searchQuery: string;

  /** Sort field */
  sortBy: 'title' | 'price' | 'date' | 'rating';

  /** Sort direction */
  sortOrder: 'asc' | 'desc';
}

/**
 * Default filter state (no filters applied)
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  genres: [],
  authorIds: [],
  priceRange: {
    min: 0,
    max: 1000,
  },
  searchQuery: '',
  sortBy: 'title',
  sortOrder: 'asc',
};
