// Import necessary components and services from Angular and other modules
import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

// Define the AuthPopupComponent with necessary metadata
@Component({
  selector: 'app-auth-popup',
  standalone: true,
  imports: [],
  templateUrl: './auth-popup.component.html',
  styleUrl: './auth-popup.component.scss'
})
export class AuthPopupComponent {
  // Inject the AuthService using Angular's inject function
  private authService = inject(AuthService);

  // Method to trigger the login process using the AuthService
  login(): void {
    this.authService.login();
  }
}
