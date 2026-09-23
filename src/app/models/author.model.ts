/**
 * Author Model
 * Represents an author in the library system
 */
export interface Author {
  /** Unique identifier for the author */
  id: string;

  /** Author's full name */
  name: string;

  /** Author biography/description */
  bio: string;

  /** URL to author's avatar/photo */
  avatarImage: string;

  /** Author's date of birth */
  birthDate?: Date;

  /** Author's nationality */
  nationality?: string;

  /** Author's personal website */
  website?: string;

  /** Social media links */
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };

  /** Array of book IDs by this author */
  bookIds: string[];
}
