// Import necessary components and services from Angular and other modules
import { Component, effect, inject, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReadSong } from '../../service/model/song.model';
import { AuthService } from '../../service/auth.service';
import { SongService } from '../../service/song.service';

// Define the FavoriteSongBtnComponent with necessary metadata
@Component({
  selector: 'app-favorite-song-btn',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './favorite-song-btn.component.html',
  styleUrl: './favorite-song-btn.component.scss'
})
export class FavoriteSongBtnComponent {
  // Input property for the song object, marked as required
  song = input.required<ReadSong>();

  // Inject the AuthService and SongService using Angular's inject function
  authService = inject(AuthService);
  songService = inject(SongService);

  // Constructor to handle side effects related to updating the favorite state
  constructor() {
    // Effect to update the song's favorite state when a new favorite state is received
    effect(() => {
      let favoriteSongState = this.songService.addOrRemoveFavoriteSongSig();
      // Check if the new state is successful and matches the current song's public ID
      if (
        favoriteSongState.status === 'OK' &&
        favoriteSongState.value &&
        this.song().publicId === favoriteSongState.value.publicId
      ) {
        // Update the song's favorite property with the new state
        this.song().favorite = favoriteSongState.value.favorite;
      }
    });
  }

  // Method to handle toggling a song's favorite status
  onFavorite(song: ReadSong) {
    // Call the SongService to add or remove the song as a favorite
    this.songService.addOrRemoveAsFavorite(!song.favorite, song.publicId!);
  }
}
