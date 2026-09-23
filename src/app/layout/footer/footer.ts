import { Component } from '@angular/core';

/**
 * Footer Component
 * Simple footer with gradient background and copyright info
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  imports: [],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
