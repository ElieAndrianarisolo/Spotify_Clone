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
  HttpParams,
} from '@angular/common/http';
import { ReadSong, SaveSong } from './model/song.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { ToastService } from './toast.service';

// Injectable service for managing song-related operations
@Injectable({
  providedIn: 'root',
})
export class SongService {
  // Inject the HttpClient for making HTTP requests
  http = inject(HttpClient);

  // Inject the ToastService for displaying notifications
  toastService = inject(ToastService);

  // Writable signal for managing the state of adding a new song
  private add$: WritableSignal<State<SaveSong, HttpErrorResponse>> = signal(
    State.Builder<SaveSong, HttpErrorResponse>().forInit().build()
  );
  // Computed property to access the add song state
  addSig = computed(() => this.add$());

  // Writable signal for managing the state of fetching all songs
  private getAll$: WritableSignal<State<Array<ReadSong>, HttpErrorResponse>> =
    signal(
      State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit().build()
    );
  // Computed property to access the get all songs state
  getAllSig = computed(() => this.getAll$());

  // Writable signal for managing the state of adding or removing a favorite song
  private addOrRemoveFavoriteSong$: WritableSignal<
    State<ReadSong, HttpErrorResponse>
  > = signal(State.Builder<ReadSong, HttpErrorResponse>().forInit().build());
  // Computed property to access the add/remove favorite song state
  addOrRemoveFavoriteSongSig = computed(() => this.addOrRemoveFavoriteSong$());

  // Writable signal for managing the state of fetching favorite songs
  private fetchFavoriteSong$: WritableSignal<
    State<Array<ReadSong>, HttpErrorResponse>
  > = signal(
    State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit().build()
  );
  // Computed property to access the fetch favorite songs state
  fetchFavoriteSongSig = computed(() => this.fetchFavoriteSong$());

  // Method to add a new song
  add(song: SaveSong): void {
    // Create a FormData object to include files in the request
    const formData = new FormData();
    formData.append('cover', song.cover!);
    formData.append('file', song.file!);
    // Clone the song object and remove files to include in the request body
    const clone = structuredClone(song);
    clone.file = undefined;
    clone.cover = undefined;
    formData.append('dto', JSON.stringify(clone));

    // Make a POST request to add the new song
    this.http
      .post<SaveSong>(`${environment.API_URL}/api/songs`, formData)
      .subscribe({
        // Handle successful response by updating the add song state
        next: (savedSong) =>
          this.add$.set(
            State.Builder<SaveSong, HttpErrorResponse>()
              .forSuccess(savedSong)
              .build()
          ),
        // Handle errors during the request
        error: (err) =>
          this.add$.set(
            State.Builder<SaveSong, HttpErrorResponse>().forError(err).build()
          ),
      });
  }

  // Method to reset the add song state
  reset(): void {
    this.add$.set(
      State.Builder<SaveSong, HttpErrorResponse>().forInit().build()
    );
  }

  // Method to fetch all songs
  getAll(): void {
    // Make a GET request to fetch all songs
    this.http
      .get<Array<ReadSong>>(`${environment.API_URL}/api/songs`)
      .subscribe({
        // Handle successful response by updating the get all songs state
        next: (songs) =>
          this.getAll$.set(
            State.Builder<Array<ReadSong>, HttpErrorResponse>()
              .forSuccess(songs)
              .build()
          ),
        // Handle errors during the request
        error: (err) =>
          this.getAll$.set(
            State.Builder<Array<ReadSong>, HttpErrorResponse>()
              .forError(err)
              .build()
          ),
      });
  }

  // Method to search for songs based on a term
  search(
    newSearchTerm: string
  ): Observable<State<Array<ReadSong>, HttpErrorResponse>> {
    // Create query parameters for the search term
    const queryParam = new HttpParams().set('term', newSearchTerm);

    // Make a GET request to search for songs
    return this.http
      .get<Array<ReadSong>>(`${environment.API_URL}/api/songs/search`, {
        params: queryParam,
      })
      .pipe(
        // Map the response to a successful state
        map((songs) =>
          State.Builder<Array<ReadSong>, HttpErrorResponse>()
            .forSuccess(songs)
            .build()
        ),
        // Catch any errors and return an error state
        catchError((err) =>
          of(
            State.Builder<Array<ReadSong>, HttpErrorResponse>()
              .forError(err)
              .build()
          )
        )
      );
  }

  // Method to add or remove a song as a favorite
  addOrRemoveAsFavorite(favorite: boolean, publicId: string): void {
    // Make a POST request to add or remove the song as a favorite
    this.http
      .post<ReadSong>(`${environment.API_URL}/api/songs/like`, {
        favorite,
        publicId,
      })
      .subscribe({
        // Handle successful response by updating the add/remove favorite song state
        next: (updatedSong) => {
          this.addOrRemoveFavoriteSong$.set(
            State.Builder<ReadSong, HttpErrorResponse>()
              .forSuccess(updatedSong)
              .build()
          );
          // Display a toast notification based on the action
          if (updatedSong.favorite) {
            this.toastService.show('Song added to favorite', 'SUCCESS');
          } else {
            this.toastService.show('Song removed from favorite', 'SUCCESS');
          }
        },
        // Handle errors during the request
        error: (err) => {
          this.addOrRemoveFavoriteSong$.set(
            State.Builder<ReadSong, HttpErrorResponse>().forError(err).build()
          );
          // Display an error toast notification
          this.toastService.show(
            'Error when adding song to favorite',
            'DANGER'
          );
        },
      });
  }

  // Method to fetch favorite songs
  fetchFavorite(): void {
    // Make a GET request to fetch favorite songs
    this.http
      .get<Array<ReadSong>>(`${environment.API_URL}/api/songs/like`)
      .subscribe({
        // Handle successful response by updating the fetch favorite songs state
        next: (favoritesSongs) =>
          this.fetchFavoriteSong$.set(
            State.Builder<Array<ReadSong>, HttpErrorResponse>()
              .forSuccess(favoritesSongs)
              .build()
          ),
        // Handle errors during the request
        error: (err) =>
          this.fetchFavoriteSong$.set(
            State.Builder<Array<ReadSong>, HttpErrorResponse>()
              .forError(err)
              .build()
          ),
      });
  }
}
