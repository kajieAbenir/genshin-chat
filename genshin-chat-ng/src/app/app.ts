import { Component, OnInit, signal } from '@angular/core';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoadingScreenComponent, ChatContainerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  isLoading = signal(true);

  ngOnInit(): void {
    // Simulate loading for 1.5 seconds
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);
  }
}
