// Import necessary modules and services from Angular and other libraries
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Location } from '@angular/common';
import { State } from './model/state.model';
import { User } from './model/user.model';
import { environment } from '../../environments/environment';

// Enum-like type for the authentication popup state
export type AuthPopupState = 'OPEN' | 'CLOSE';

// Injectable service for handling authentication-related tasks
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Inject the HttpClient for making HTTP requests
  http = inject(HttpClient);

  // Inject the Location service for handling URL navigation
  location = inject(Location);

  // Constant to represent a non-connected state
  notConnected = 'NOT_CONNECTED';

  // Writable signal for managing the fetch user state
  private fetchUser$: WritableSignal<State<User, HttpErrorResponse>> = signal(
    State.Builder<User, HttpErrorResponse>()
      .forSuccess({ email: this.notConnected })
      .build()
  );
  // Computed property to access the fetch user state
  fetchUser = computed(() => this.fetchUser$());

  // Writable signal for managing the authentication popup state
  private triggerAuthPopup$: WritableSignal<AuthPopupState> = signal('CLOSE');
  // Computed property to access the authentication popup state changes
  authPopupStateChange = computed(() => this.triggerAuthPopup$());

  // Method to fetch the authenticated user's data
  fetch(): void {
    // Make a GET request to the API to fetch the authenticated user
    this.http
      .get<User>(`${environment.API_URL}/api/get-authenticated-user`)
      .subscribe({
        // Handle successful response by updating the fetch user state
        next: (user) =>
          this.fetchUser$.set(
            State.Builder<User, HttpErrorResponse>().forSuccess(user).build()
          ),
        // Handle errors during the request
        error: (err: HttpErrorResponse) => {
          // If the error is a 401 Unauthorized and the user is authenticated, reset the user state
          if (
            err.status === HttpStatusCode.Unauthorized &&
            this.isAuthenticated()
          ) {
            this.fetchUser$.set(
              State.Builder<User, HttpErrorResponse>()
                .forSuccess({ email: this.notConnected })
                .build()
            );
          } else {
            // Otherwise, update the fetch user state with the error
            this.fetchUser$.set(
              State.Builder<User, HttpErrorResponse>().forError(err).build()
            );
          }
        },
      });
  }

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    // Check if the fetch user state has a value and if it's not the non-connected state
    if (this.fetchUser$().value) {
      return this.fetchUser$().value!.email !== this.notConnected;
    } else {
      return false;
    }
  }

  // Method to initiate the login process
  login(): void {
    // Redirect the user to the Okta authorization URL
    location.href = `${location.origin}${this.location.prepareExternalUrl(
      'oauth2/authorization/okta'
    )}`;
  }

  // Method to handle logout
  logout(): void {
    // Make a POST request to the API to log out
    this.http
      .post(`${environment.API_URL}/api/logout`, {}, { withCredentials: true })
      .subscribe({
        // Handle successful logout response
        next: (response: any) => {
          // Reset the fetch user state to the non-connected state
          this.fetchUser$.set(
            State.Builder<User, HttpErrorResponse>()
              .forSuccess({ email: this.notConnected })
              .build()
          );
          // Redirect the user to the logout URL provided in the response
          location.href = response.logoutUrl;
        },
      });
  }

  // Method to open or close the authentication popup
  openOrCloseAuthPopup(state: AuthPopupState) {
    // Update the authentication popup state signal
    this.triggerAuthPopup$.set(state);
  }

  // Empty constructor
  constructor() {}
}
