import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrls: ['./loader.css'],
})
export class Loader {
  isLoading: boolean = true;
  
  show() {
    this.isLoading = true;

  }

  hide() {
    this.isLoading = false;
  }
}
