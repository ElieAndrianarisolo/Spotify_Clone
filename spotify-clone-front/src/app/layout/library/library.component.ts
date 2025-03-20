// Import necessary components and services from Angular and other modules
import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { SmallSongCardComponent } from '../../shared/small-song-card/small-song-card.component';
import { SongService } from '../../service/song.service';
import { ReadSong } from '../../service/model/song.model';
import { SongContentService } from "../../service/song-content.service";

// Define the LibraryComponent with necessary metadata
@Component({
  selector: 'app-library',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, SmallSongCardComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit {
  // Inject necessary services using Angular's inject function
  private songService = inject(SongService);
  private songContentService = inject(SongContentService);

  // Array to store all songs fetched from the service
  songs: Array<ReadSong> = [];

  // Flag to track if data is currently loading
  isLoading = false;

  // Constructor to handle side effects related to fetching all songs
  constructor() {
    // Effect to update the songs array when data is fetched
    effect(() => {
      if (this.songService.getAllSig().status === 'OK') {
        // If successful, assign the fetched songs to the songs array
        this.songs = this.songService.getAllSig().value!;
      }
      // Reset the loading flag after the operation completes
      this.isLoading = false;
    });
  }

  // Lifecycle hook to fetch all songs on initialization
  ngOnInit(): void {
    this.fetchSongs();
  }

  // Method to fetch all songs and set the loading flag
  private fetchSongs() {
    this.isLoading = true;
    this.songService.getAll();
  }

  // Method to handle playing a song and creating a new queue
  onPlaySong(songToPlayFirst: ReadSong): void {
    // Create a new queue starting with the selected song and including all songs
    this.songContentService.createNewQueue(songToPlayFirst, this.songs!);
  }
}
