// Import necessary components and services from Angular and other modules
import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongCardComponent } from './song-card/song-card.component';
import { SongService } from '../service/song.service';
import { ToastService } from '../service/toast.service';
import { ReadSong } from '../service/model/song.model';
import { SongContentService } from '../service/song-content.service';
import { FavoriteSongCardComponent } from './favorite-song-card/favorite-song-card.component';

// Define the HomeComponent with necessary metadata
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule, SongCardComponent, FavoriteSongCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Inject necessary services using Angular's inject function
  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private songContentService = inject(SongContentService);

  // Array to store all songs fetched from the service
  allSongs: Array<ReadSong> | undefined;

  // Flag to track if data is currently loading
  isLoading = false;

  // Constructor to handle side effects related to fetching all songs
  constructor() {
    // Set the loading flag to true initially
    this.isLoading = true;

    // Effect to handle fetching all songs and updating the component state
    effect(() => {
      const allSongsResponse = this.songService.getAllSig();
      if (allSongsResponse.status === 'OK') {
        // If successful, assign the fetched songs to the allSongs array
        this.allSongs = allSongsResponse.value;
      } else if (allSongsResponse.status === 'ERROR') {
        // If there's an error, display a danger toast
        this.toastService.show(
          'An error occurred when fetching all songs',
          'DANGER'
        );
      }
      // Reset the loading flag after the operation completes
      this.isLoading = false;
    });
  }

  // Method to handle playing a song and creating a new queue
  onPlaySong(songToPlayFirst: ReadSong) {
    // Create a new queue starting with the selected song and including all songs
    this.songContentService.createNewQueue(songToPlayFirst, this.allSongs!);
  }
}
