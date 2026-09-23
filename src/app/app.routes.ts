import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { CatalogComponent } from './pages/catalog/catalog';
import { BookDetailComponent } from './pages/book-detail/book-detail';
import { AuthorComponent } from './pages/author/author';

/**
 * Application Routes
 * Defines the navigation structure for the gaming library
 */
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Gaming Library - Discover Epic Books',
  },
  {
    path: 'catalog',
    component: CatalogComponent,
    title: 'Book Catalog - Gaming Library',
  },
  {
    path: 'book/:id',
    component: BookDetailComponent,
    title: 'Book Details - Gaming Library',
  },
  {
    path: 'author/:id',
    component: AuthorComponent,
    title: 'Author Profile - Gaming Library',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
