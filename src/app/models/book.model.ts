/**
 * Book Model
 * Represents a book in the library catalog
 */
export interface Book {
  /** Unique identifier for the book */
  id: string;

  /** Main title of the book */
  title: string;

  /** Optional subtitle */
  subtitle?: string;

  /** Full description/synopsis of the book */
  description: string;

  /** URL to the book cover image */
  coverImage: string;

  /** Reference to the author ID */
  authorId: string;

  /** Denormalized author name for quick access */
  authorName: string;

  /** Reference to the publisher ID */
  publisherId: string;

  /** Denormalized publisher name for quick access */
  publisherName: string;

  /** Array of genre tags (e.g., ['Fantasy', 'Adventure']) */
  genres: string[];

  /** Price in the specified currency */
  price: number;

  /** Currency code (e.g., 'USD', 'EUR') */
  currency: string;

  /** ISBN number */
  isbn: string;

  /** Publication date */
  publicationDate: Date;

  /** Number of pages in the book */
  pageCount: number;

  /** Language of the book (e.g., 'English', 'French') */
  language: string;

  /** Whether this book is featured in the hero banner */
  isFeatured: boolean;

  /** Average rating (0-5) */
  rating?: number;

  /** Additional categorization tags */
  tags?: string[];
}
