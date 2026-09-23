import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Book } from '../models/book.model';
import { FilterState } from '../models/filter-state.model';
import { MOCK_BOOKS } from '../data/mock-books';

/**
 * Book Service
 * Manages book data and provides methods for querying, filtering, and searching books
 */
@Injectable({
  providedIn: 'root',
})
export class BookService {
  /** All books stored in a BehaviorSubject for reactive updates */
  private booksSubject = new BehaviorSubject<Book[]>(MOCK_BOOKS);

  /** Observable stream of all books */
  public books$ = this.booksSubject.asObservable();

  constructor() {}

  /**
   * Get all books
   */
  getAllBooks(): Observable<Book[]> {
    return this.books$;
  }

  /**
   * Get a single book by ID
   */
  getBookById(id: string): Observable<Book | undefined> {
    return this.books$.pipe(map((books) => books.find((book) => book.id === id)));
  }

  /**
   * Get featured books for the hero banner
   * Returns only books where isFeatured === true
   */
  getFeaturedBooks(): Observable<Book[]> {
    return this.books$.pipe(map((books) => books.filter((book) => book.isFeatured)));
  }

  /**
   * Get books by a specific author
   */
  getBooksByAuthor(authorId: string): Observable<Book[]> {
    return this.books$.pipe(map((books) => books.filter((book) => book.authorId === authorId)));
  }

  /**
   * Get books by genre
   */
  getBooksByGenre(genre: string): Observable<Book[]> {
    return this.books$.pipe(
      map((books) => books.filter((book) => book.genres.some((g) => g.toLowerCase() === genre.toLowerCase())))
    );
  }

  /**
   * Search books by query string
   * Searches in title, subtitle, description, author name, and genres
   */
  searchBooks(query: string): Observable<Book[]> {
    if (!query || query.trim() === '') {
      return this.books$;
    }

    const lowerQuery = query.toLowerCase().trim();

    return this.books$.pipe(
      map((books) =>
        books.filter(
          (book) =>
            book.title.toLowerCase().includes(lowerQuery) ||
            book.subtitle?.toLowerCase().includes(lowerQuery) ||
            book.description.toLowerCase().includes(lowerQuery) ||
            book.authorName.toLowerCase().includes(lowerQuery) ||
            book.genres.some((genre) => genre.toLowerCase().includes(lowerQuery)) ||
            book.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        )
      )
    );
  }

  /**
   * Filter books based on multiple criteria
   * Applies genre filters, author filters, price range, search query, and sorting
   */
  filterBooks(filters: FilterState): Observable<Book[]> {
    return this.books$.pipe(
      map((books) => {
        let filtered = [...books];

        // Apply genre filter
        if (filters.genres.length > 0) {
          filtered = filtered.filter((book) =>
            filters.genres.some((genre) => book.genres.some((bookGenre) => bookGenre.toLowerCase() === genre.toLowerCase()))
          );
        }

        // Apply author filter
        if (filters.authorIds.length > 0) {
          filtered = filtered.filter((book) => filters.authorIds.includes(book.authorId));
        }

        // Apply price range filter
        if (filters.priceRange) {
          filtered = filtered.filter(
            (book) => book.price >= filters.priceRange.min && book.price <= filters.priceRange.max
          );
        }

        // Apply search query
        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
          const lowerQuery = filters.searchQuery.toLowerCase().trim();
          filtered = filtered.filter(
            (book) =>
              book.title.toLowerCase().includes(lowerQuery) ||
              book.subtitle?.toLowerCase().includes(lowerQuery) ||
              book.description.toLowerCase().includes(lowerQuery) ||
              book.authorName.toLowerCase().includes(lowerQuery) ||
              book.genres.some((genre) => genre.toLowerCase().includes(lowerQuery)) ||
              book.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
          );
        }

        // Apply sorting
        filtered = this.sortBooks(filtered, filters.sortBy, filters.sortOrder);

        return filtered;
      })
    );
  }

  /**
   * Get all unique genres from the book collection
   */
  getUniqueGenres(): Observable<string[]> {
    return this.books$.pipe(
      map((books) => {
        const genresSet = new Set<string>();
        books.forEach((book) => {
          book.genres.forEach((genre) => genresSet.add(genre));
        });
        return Array.from(genresSet).sort();
      })
    );
  }

  /**
   * Get related books based on shared genres or author
   * Excludes the current book from results
   */
  getRelatedBooks(bookId: string, limit: number = 4): Observable<Book[]> {
    return this.books$.pipe(
      map((books) => {
        const currentBook = books.find((b) => b.id === bookId);
        if (!currentBook) {
          return [];
        }

        // Filter books by same author or shared genres
        const related = books.filter((book) => {
          if (book.id === bookId) {
            return false;
          }

          // Same author
          if (book.authorId === currentBook.authorId) {
            return true;
          }

          // Shared genres
          const sharedGenres = book.genres.filter((genre) => currentBook.genres.includes(genre));
          return sharedGenres.length > 0;
        });

        // Sort by number of shared genres (more shared = higher priority)
        related.sort((a, b) => {
          const aShared = a.genres.filter((genre) => currentBook.genres.includes(genre)).length;
          const bShared = b.genres.filter((genre) => currentBook.genres.includes(genre)).length;
          return bShared - aShared;
        });

        return related.slice(0, limit);
      })
    );
  }

  /**
   * Sort books based on field and order
   */
  private sortBooks(books: Book[], sortBy: FilterState['sortBy'], sortOrder: FilterState['sortOrder']): Book[] {
    const sorted = [...books];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
          comparison = a.publicationDate.getTime() - b.publicationDate.getTime();
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }
}
