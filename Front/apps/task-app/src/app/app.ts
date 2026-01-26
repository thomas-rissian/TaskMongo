import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../../../../libs/ui/layout/header/header';
import { Footer } from '../../../../libs/ui/layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Front');

  constructor(private router: Router) {}

  isFullscreenRoute(): boolean {
    return this.router.url.includes('/board') || this.router.url === '/board-view';
  }
}
