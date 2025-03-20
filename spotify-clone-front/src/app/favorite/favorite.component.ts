// Import necessary components and services from Angular and other modules
import { Component, effect, inject, OnInit } from '@angular/core';
import { FavoriteSongBtnComponent } from '../shared/favorite-song-btn/favorite-song-btn.component';
import { SmallSongCardComponent } from '../shared/small-song-card/small-song-card.component';
import { ReadSong } from '../service/model/song.model';
import { SongService } from '../service/song.service';
import { SongContentService } from '../service/song-content.service';

// Define the FavoriteComponent with necessary metadata
@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [
    FavoriteSongBtnComponent,
    SmallSongCardComponent,
  ],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  // Initialize an empty array to store favorite songs
  favoriteSongs: Array<ReadSong> = [];

  // Inject necessary services using Angular's inject function
  songService = inject(SongService);
  songContentService = inject(SongContentService);

  // Constructor to handle side effects related to favorite song management
  constructor() {
    // Effect to handle adding or removing favorite songs
    effect(() => {
      let addOrRemoveFavoriteSongSig =
        this.songService.addOrRemoveFavoriteSongSig();
      if (addOrRemoveFavoriteSongSig.status === 'OK') {
        // Fetch favorite songs after a successful add/remove operation
        this.songService.fetchFavorite();
      }
    });

    // Effect to handle fetching favorite songs
    effect(() => {
      let favoriteSongState = this.songService.fetchFavoriteSongSig();
      if (favoriteSongState.status === 'OK') {
        // Mark each song as favorite and update the favoriteSongs array
        favoriteSongState.value?.forEach((song) => (song.favorite = true));
        this.favoriteSongs = favoriteSongState.value!;
      }
    });
  }

  // Lifecycle hook to fetch favorite songs on initialization
  ngOnInit(): void {
    this.songService.fetchFavorite();
  }

  // Method to handle playing a song and creating a new queue
  onPlay(firstSong: ReadSong) {
    // Create a new queue starting with the first song and including all favorite songs
    this.songContentService.createNewQueue(firstSong, this.favoriteSongs);
  }
}
