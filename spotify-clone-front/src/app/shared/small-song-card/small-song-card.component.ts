// Import necessary components and models from Angular and other modules
import { Component, EventEmitter, input, Output } from '@angular/core';
import { ReadSong } from '../../service/model/song.model';

// Define the SmallSongCardComponent with necessary metadata
@Component({
  selector: 'app-small-song-card',
  standalone: true,
  imports: [],
  templateUrl: './small-song-card.component.html',
  styleUrl: './small-song-card.component.scss'
})
export class SmallSongCardComponent {
  // Input property for the song object, marked as required
  song = input.required<ReadSong>();

  // Output event emitter to notify when a song should be played
  @Output()
  songToPlay$ = new EventEmitter<ReadSong>();

  // Method to handle playing the song and emitting the songToPlay event
  play(): void {
    // Emit the songToPlay event with the current song object
    this.songToPlay$.next(this.song());
  }
}
