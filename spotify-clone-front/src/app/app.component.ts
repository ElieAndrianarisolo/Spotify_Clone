// Import necessary components and services from Angular and other modules
import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { LibraryComponent } from './layout/library/library.component';
import { HeaderComponent } from './layout/header/header.component';
import { ToastService } from './service/toast.service';
import { NgbModal, NgbModalRef, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { PlayerComponent } from './layout/player/player.component';
import { AuthPopupState, AuthService } from './service/auth.service';
import { AuthPopupComponent } from './layout/auth-popup/auth-popup.component';

// Define the AppComponent with necessary metadata
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    NavigationComponent,
    LibraryComponent,
    HeaderComponent,
    NgbToast,
    PlayerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // Application title
  title = 'spotify-clone-front';

  // Inject the FaIconLibrary to manage Font Awesome icons
  private faIconLibrary = inject(FaIconLibrary);

  // Inject the ToastService for displaying notifications
  toastService = inject(ToastService);

  // Inject the AuthService for authentication-related tasks
  private authService = inject(AuthService);

  // Inject the NgbModal service for managing modal windows
  private modalService = inject(NgbModal);

  // Reference to the authentication modal window
  private authModalRef: NgbModalRef | null = null;

  // Constructor to handle side effects related to authentication modal management
  constructor() {
    // Effect to open or close the authentication modal based on the AuthService state
    effect(
      () => {
        this.openOrCloseAuthModal(this.authService.authPopupStateChange());
      },
      { allowSignalWrites: true }
    );
  }

  // Lifecycle hook to initialize Font Awesome icons
  ngOnInit(): void {
    this.initFontAwesome();
  }

  // Method to initialize Font Awesome icons
  private initFontAwesome() {
    // Add the necessary Font Awesome icons to the library
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  // Method to open or close the authentication modal based on the AuthService state
  private openOrCloseAuthModal(state: AuthPopupState) {
    if (state === 'OPEN') {
      // Open the authentication modal if the state is 'OPEN'
      this.openAuthPopup();
    } else if (
      this.authModalRef !== null &&
      state === 'CLOSE' &&
      this.modalService.hasOpenModals()
    ) {
      // Close the authentication modal if it's open and the state is 'CLOSE'
      this.authModalRef.close();
    }
  }

  // Method to open the authentication modal
  private openAuthPopup() {
    // Open the AuthPopupComponent as a modal window
    this.authModalRef = this.modalService.open(AuthPopupComponent, {
      ariaDescribedBy: 'authentication-modal',
      centered: true,
    });

    // Subscribe to the dismissed event to close the modal and update the AuthService state
    this.authModalRef.dismissed.subscribe({
      next: () => {
        this.authService.openOrCloseAuthPopup('CLOSE');
      },
    });

    // Subscribe to the closed event to close the modal and update the AuthService state
    this.authModalRef.closed.subscribe({
      next: () => {
        this.authService.openOrCloseAuthPopup('CLOSE');
      },
    });
  }
}
