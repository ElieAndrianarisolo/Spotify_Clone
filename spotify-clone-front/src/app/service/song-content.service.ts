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
import { ReadSong, SongContent } from './model/song.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment';

// Injectable service for managing song content and playback queues
@Injectable({
  providedIn: 'root',
})
export class SongContentService {
  // Inject the HttpClient for making HTTP requests
  http = inject(HttpClient);

  // Writable signal for managing the playback queue
  private queueToPlay$: WritableSignal<Array<ReadSong>> = signal([]);
  // Computed property to access the playback queue
  queueToPlay = computed(() => this.queueToPlay$());

  // Writable signal for managing the state of playing a new song
  private play$: WritableSignal<State<SongContent, HttpErrorResponse>> = signal(
    State.Builder<SongContent, HttpErrorResponse>().forInit().build()
  );
  // Computed property to access the state of playing a new song
  playNewSong = computed(() => this.play$());

  // Method to create a new playback queue starting with a given song
  createNewQueue(firstSong: ReadSong, songsToPlay: Array<ReadSong>): void {
    // Remove the first song from the list of songs to play (to avoid duplicates)
    songsToPlay = songsToPlay.filter(
      (song) => song.publicId !== firstSong.publicId
    );

    // Add the first song to the beginning of the queue if there are other songs
    if (songsToPlay) {
      songsToPlay.unshift(firstSong);
    }

    // Update the playback queue signal
    this.queueToPlay$.set(songsToPlay);
  }

  // Method to fetch the content of the next song in the queue
  fetchNextSong(songToPlay: SongContent): void {
    // Create query parameters for the HTTP request
    const queryParam = new HttpParams().set('publicId', songToPlay.publicId!);

    // Make a GET request to fetch the song content
    this.http
      .get<SongContent>(`${environment.API_URL}/api/songs/get-content`, {
        params: queryParam,
      })
      .subscribe({
        // Handle successful response by mapping and updating the play state
        next: (songContent) => {
          // Map the ReadSong properties to the SongContent object
          this.mapReadSongToSongContent(songContent, songToPlay);
          // Update the play state with the successful response
          this.play$.set(
            State.Builder<SongContent, HttpErrorResponse>()
              .forSuccess(songContent)
              .build()
          );
        },
        // Handle errors during the request
        error: (err) =>
          // Update the play state with the error
          this.play$.set(
            State.Builder<SongContent, HttpErrorResponse>()
              .forError(err)
              .build()
          ),
      });
  }

  // Empty constructor
  constructor() {}

  // Helper method to map properties from a ReadSong to a SongContent object
  private mapReadSongToSongContent(
    songContent: SongContent,
    songToPlay: ReadSong
  ) {
    // Copy cover properties
    songContent.cover = songToPlay.cover;
    songContent.coverContentType = songToPlay.coverContentType;
    // Copy title and author properties
    songContent.title = songToPlay.title;
    songContent.author = songToPlay.author;
    // Copy favorite property
    songContent.favorite = songToPlay.favorite;
  }
}
