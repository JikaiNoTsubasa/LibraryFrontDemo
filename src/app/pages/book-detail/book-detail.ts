import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Book3DViewerComponent } from '../../components/book-3d-viewer/book-3d-viewer';

/**
 * Book Detail Page Component
 * Displays detailed information about a single book
 */
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
  imports: [CommonModule, Book3DViewerComponent],
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);

  book$!: Observable<Book | undefined>;

  ngOnInit() {
    this.book$ = this.route.params.pipe(switchMap((params) => this.bookService.getBookById(params['id'])));
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
