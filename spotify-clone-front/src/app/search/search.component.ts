// Import necessary components and services from Angular and other modules
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SmallSongCardComponent } from '../shared/small-song-card/small-song-card.component';
import { SongService } from '../service/song.service';
import { SongContentService } from '../service/song-content.service';
import { ToastService } from '../service/toast.service';
import { ReadSong } from '../service/model/song.model';
import { debounce, filter, interval, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { State } from '../service/model/state.model';
import { FavoriteSongBtnComponent } from "../shared/favorite-song-btn/favorite-song-btn.component";

// Define the SearchComponent with necessary metadata
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    SmallSongCardComponent,
    FavoriteSongBtnComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  // Search term input by the user
  searchTerm = '';

  // Inject necessary services using Angular's inject function
  private songService = inject(SongService);
  private songContentService = inject(SongContentService);
  private toastService = inject(ToastService);

  // Array to store search results
  songsResult: Array<ReadSong> = [];

  // Flag to track if a search is currently in progress
  isSearching = false;

  // Method to handle changes in the search term
  onSearch(newSearchTerm: string) {
    // Update the search term
    this.searchTerm = newSearchTerm;

    // Use RxJS to manage the search process with debouncing
    of(newSearchTerm)
      .pipe(
        // Reset search results if the search term is empty
        tap((newSearchTerm) => this.resetResultIfEmptyTerm(newSearchTerm)),
        // Filter out empty search terms
        filter((newSearchTerm) => newSearchTerm.length > 0),
        // Debounce the search by 300ms to prevent excessive requests
        debounce(() => interval(300)),
        // Set the isSearching flag to true before making the request
        tap(() => (this.isSearching = true)),
        // Switch to the search service call
        switchMap((newSearchTerm) => this.songService.search(newSearchTerm))
      )
      .subscribe({
        // Handle the response from the search service
        next: (searchState) => this.onNext(searchState),
      });
  }

  // Helper method to reset search results if the search term is empty
  private resetResultIfEmptyTerm(newSearchTerm: string) {
    if (newSearchTerm.length === 0) {
      this.songsResult = [];
    }
  }

  // Method to handle playing a song from the search results
  onPlay(firstSong: ReadSong) {
    // Create a new queue starting with the selected song and including all search results
    this.songContentService.createNewQueue(firstSong, this.songsResult);
  }

  // Method to handle the response from the search service
  private onNext(searchState: State<Array<ReadSong>, HttpErrorResponse>) {
    // Reset the isSearching flag after receiving a response
    this.isSearching = false;

    // Handle successful search results
    if (searchState.status === 'OK') {
      this.songsResult = searchState.value!;
    } 
    // Handle errors during the search
    else if (searchState.status === 'ERROR') {
      // Display an error toast
      this.toastService.show('An error occurred while searching', 'DANGER');
    }
  }
}
