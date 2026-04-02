import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent {
  @Input() isLoading = true;
}
