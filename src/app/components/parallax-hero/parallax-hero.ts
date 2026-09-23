import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';

/**
 * Parallax Hero Component
 * Full-page hero banner with parallax scrolling effects and tilted container
 * Features multiple layers moving at different speeds for depth effect
 */
@Component({
  selector: 'app-parallax-hero',
  templateUrl: './parallax-hero.html',
  styleUrl: './parallax-hero.scss',
  imports: [CommonModule],
})
export class ParallaxHeroComponent implements AfterViewInit {
  /** Featured books to display in the hero banner */
  @Input() featuredBooks: Book[] = [];

  /** Emits when a book cover is clicked */
  @Output() bookClicked = new EventEmitter<Book>();

  /** Reference to the hero container element */
  @ViewChild('heroContainer', { static: false }) heroContainer!: ElementRef<HTMLElement>;

  /** Transform values for each parallax layer */
  layer1Transform = signal('translate3d(0, 0, 0)');
  layer2Transform = signal('translate3d(0, 0, 0)');
  layer3Transform = signal('translate3d(0, 0, 0)');

  /** Request animation frame ID for cleanup */
  private rafId: number | null = null;

  ngAfterViewInit() {
    // Initial parallax calculation
    this.updateParallax();
  }

  /**
   * Listen to window scroll events and trigger parallax update
   */
  @HostListener('window:scroll')
  onScroll() {
    // Cancel previous animation frame if still pending
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    // Request new animation frame for smooth 60fps animation
    this.rafId = requestAnimationFrame(() => {
      this.updateParallax();
    });
  }

  /**
   * Update parallax layer transforms based on scroll position
   * Each layer moves at a different speed for depth effect
   */
  private updateParallax() {
    if (!this.heroContainer) {
      return;
    }

    const scrollY = window.scrollY;
    const heroHeight = this.heroContainer.nativeElement.offsetHeight;

    // Only apply parallax while hero is visible
    if (scrollY < heroHeight) {
      // Different speeds for each layer (slower = more distant)
      // Layer 1 (background): slowest - 0.2x scroll speed
      // Layer 2 (mid-ground): medium - 0.5x scroll speed
      // Layer 3 (foreground/books): fastest - 0.8x scroll speed
      this.layer1Transform.set(`translate3d(0, ${scrollY * 0.2}px, 0)`);
      this.layer2Transform.set(`translate3d(0, ${scrollY * 0.5}px, 0)`);
      this.layer3Transform.set(`translate3d(0, ${scrollY * 0.8}px, 0)`);
    }
  }

  /**
   * Handle book cover click
   */
  onBookClick(book: Book, event: MouseEvent) {
    event.preventDefault();
    this.bookClicked.emit(book);
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByBookId(index: number, book: Book): string {
    return book.id;
  }

  /**
   * Cleanup on component destroy
   */
  ngOnDestroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
