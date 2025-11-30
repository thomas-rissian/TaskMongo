import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Header } from '../../../../libs/ui/header/header';
import { Footer } from '../../../../libs/ui/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Front');
}
