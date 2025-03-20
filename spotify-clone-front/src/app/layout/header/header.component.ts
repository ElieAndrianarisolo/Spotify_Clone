// Import necessary components and services from Angular and other modules
import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../service/auth.service';
import { User } from '../../service/model/user.model';
import { Location } from '@angular/common';

// Define the HeaderComponent with necessary metadata
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  // Inject the AuthService using Angular's inject function
  authService = inject(AuthService);

  // Initialize the connectedUser object with default values
  connectedUser: User = { email: this.authService.notConnected };

  // Inject the Location service to handle navigation
  location = inject(Location);

  // Constructor to handle side effects related to fetching user data
  constructor() {
    // Effect to update the connectedUser object when user data is fetched
    effect(() => {
      if (this.authService.fetchUser().status == 'OK') {
        // If successful, assign the fetched user data to the connectedUser object
        this.connectedUser = this.authService.fetchUser().value!;
      }
    });
  }

  // Lifecycle hook to fetch user data on initialization
  ngOnInit(): void {
    this.authService.fetch();
  }

  // Method to trigger the login process using the AuthService
  login(): void {
    this.authService.login();
  }

  // Method to trigger the logout process using the AuthService
  logout(): void {
    this.authService.logout();
  }

  // Method to navigate backward in the browser history
  goBackward(): void {
    this.location.back();
  }

  // Method to navigate forward in the browser history
  goForward(): void {
    this.location.forward();
  }
}
