import { Component, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./features/footer/footer.component";
import { HeaderComponent } from "./features/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    FooterComponent, 
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test-v2';

  get isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true';
  }

  onLogout() {}
}
