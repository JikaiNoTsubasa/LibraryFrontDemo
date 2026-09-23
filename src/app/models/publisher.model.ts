/**
 * Publisher Model
 * Represents a book publisher
 */
export interface Publisher {
  /** Unique identifier for the publisher */
  id: string;

  /** Publisher name */
  name: string;

  /** URL to publisher logo */
  logo: string;

  /** Publisher's website */
  website?: string;

  /** Year the publisher was founded */
  foundedYear?: number;

  /** Publisher's location/headquarters */
  location?: string;

  /** Array of book IDs published by this publisher */
  bookIds: string[];
}
