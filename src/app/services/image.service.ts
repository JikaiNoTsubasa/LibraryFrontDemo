import { Injectable } from '@angular/core';

/**
 * Image Service
 * Generates placeholder image URLs using Unsplash and other services
 */
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  /** Base URL for Unsplash source images */
  private readonly UNSPLASH_BASE = 'https://source.unsplash.com';

  /** Base URL for avatar placeholders */
  private readonly AVATAR_BASE = 'https://i.pravatar.cc';

  constructor() {}

  /**
   * Get a book cover placeholder image URL
   * @param bookId - Book ID (used for consistent image selection)
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @param genre - Optional genre for more relevant images
   * @returns URL string for the placeholder image
   */
  getBookCoverPlaceholder(bookId: string, width: number = 400, height: number = 600, genre?: string): string {
    // Map genres to Unsplash search keywords for better visual consistency
    const genreKeywords: Record<string, string> = {
      fantasy: 'fantasy,magic,mystical',
      'dark fantasy': 'dark,fantasy,gothic',
      'science fiction': 'scifi,space,future',
      cyberpunk: 'cyberpunk,neon,city',
      mystery: 'mystery,noir,detective',
      thriller: 'thriller,suspense,dark',
      horror: 'horror,dark,creepy',
      romance: 'romance,love,elegant',
      'young adult': 'adventure,youth,heroic',
      historical: 'historical,vintage,classic',
      paranormal: 'paranormal,supernatural,mystical',
      superhero: 'superhero,action,comic',
    };

    // Default to generic book imagery
    let keywords = 'book,cover,abstract';

    if (genre) {
      const lowerGenre = genre.toLowerCase();
      keywords = genreKeywords[lowerGenre] || `${genre},book`;
    }

    return `${this.UNSPLASH_BASE}/${width}x${height}/?${keywords}`;
  }

  /**
   * Get an author avatar placeholder
   * @param authorId - Author ID (used for consistent image selection)
   * @param size - Avatar size in pixels (square)
   * @returns URL string for the avatar placeholder
   */
  getAuthorAvatarPlaceholder(authorId: string, size: number = 300): string {
    // Use a hash of the author ID to get a consistent image number
    const imageNumber = this.hashStringToNumber(authorId, 70); // pravatar has 70 images
    return `${this.AVATAR_BASE}/${size}?img=${imageNumber}`;
  }

  /**
   * Get a generic placeholder with custom text
   * @param width - Width in pixels
   * @param height - Height in pixels
   * @param text - Text to display
   * @param bgColor - Background color (hex without #)
   * @param textColor - Text color (hex without #)
   * @returns URL string for the placeholder
   */
  getCustomPlaceholder(
    width: number,
    height: number,
    text: string,
    bgColor: string = '6b46c1',
    textColor: string = 'ffffff'
  ): string {
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
  }

  /**
   * Get a gradient placeholder for backgrounds
   * @param width - Width in pixels
   * @param height - Height in pixels
   * @param gradientType - Type of gradient (abstract, geometric, etc.)
   * @returns URL string for the gradient background
   */
  getGradientPlaceholder(width: number, height: number, gradientType: string = 'abstract'): string {
    return `${this.UNSPLASH_BASE}/${width}x${height}/?${gradientType},gradient`;
  }

  /**
   * Hash a string to a number within a range
   * Used for consistent image selection based on IDs
   * @private
   */
  private hashStringToNumber(str: string, max: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % max;
  }
}
