import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ParallaxHeroComponent } from '../../components/parallax-hero/parallax-hero';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

/**
 * Home Page Component
 * Landing page with parallax hero banner and featured content
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [CommonModule, ParallaxHeroComponent],
})
export class HomeComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);

  /** Observable of featured books for the hero banner */
  featuredBooks$!: Observable<Book[]>;

  ngOnInit() {
    // Load featured books
    this.featuredBooks$ = this.bookService.getFeaturedBooks();
  }

  /**
   * Handle book click from hero banner - navigate to book detail
   */
  onBookClick(book: Book) {
    this.router.navigate(['/book', book.id]);
  }
}
