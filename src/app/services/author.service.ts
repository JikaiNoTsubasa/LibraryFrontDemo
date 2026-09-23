import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, combineLatest } from 'rxjs';
import { Author } from '../models/author.model';
import { Book } from '../models/book.model';
import { MOCK_AUTHORS } from '../data/mock-authors';
import { BookService } from './book.service';

/**
 * Author Service
 * Manages author data and provides methods for querying authors
 */
@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  /** All authors stored in a BehaviorSubject */
  private authorsSubject = new BehaviorSubject<Author[]>(MOCK_AUTHORS);

  /** Observable stream of all authors */
  public authors$ = this.authorsSubject.asObservable();

  constructor(private bookService: BookService) {}

  /**
   * Get all authors
   */
  getAllAuthors(): Observable<Author[]> {
    return this.authors$;
  }

  /**
   * Get a single author by ID
   */
  getAuthorById(id: string): Observable<Author | undefined> {
    return this.authors$.pipe(map((authors) => authors.find((author) => author.id === id)));
  }

  /**
   * Get author with their books
   * Combines author data with their book collection
   */
  getAuthorWithBooks(id: string): Observable<{ author: Author; books: Book[] } | null> {
    const author$ = this.getAuthorById(id);
    const books$ = this.bookService.getBooksByAuthor(id);

    return combineLatest([author$, books$]).pipe(
      map(([author, books]) => {
        if (!author) {
          return null;
        }
        return { author, books };
      })
    );
  }

  /**
   * Get authors that have published books in a specific genre
   */
  getAuthorsByGenre(genre: string): Observable<Author[]> {
    return combineLatest([this.authors$, this.bookService.getAllBooks()]).pipe(
      map(([authors, books]) => {
        const authorIds = new Set<string>();

        // Find all author IDs that have books in this genre
        books.forEach((book) => {
          if (book.genres.some((g) => g.toLowerCase() === genre.toLowerCase())) {
            authorIds.add(book.authorId);
          }
        });

        // Return authors with matching IDs
        return authors.filter((author) => authorIds.has(author.id));
      })
    );
  }

  /**
   * Search authors by name or bio
   */
  searchAuthors(query: string): Observable<Author[]> {
    if (!query || query.trim() === '') {
      return this.authors$;
    }

    const lowerQuery = query.toLowerCase().trim();

    return this.authors$.pipe(
      map((authors) =>
        authors.filter(
          (author) =>
            author.name.toLowerCase().includes(lowerQuery) ||
            author.bio.toLowerCase().includes(lowerQuery) ||
            author.nationality?.toLowerCase().includes(lowerQuery)
        )
      )
    );
  }
}
