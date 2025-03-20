// Import necessary components and modules from Angular and other libraries
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { animate, style, transition, trigger } from '@angular/animations';
import { ReadSong } from '../../service/model/song.model';

// Define the SongCardComponent with necessary metadata
@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
  // Define animations for the play icon
  animations: [
    trigger('inOutAnimation', [
      // Transition for when the icon enters the view
      transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate(
          '.2s ease-out',
          style({ transform: 'translateY(0px)', opacity: 1 })
        ),
      ]),
      // Transition for when the icon leaves the view
      transition(':leave', [
        style({ transform: 'translateY(0px)', opacity: 1 }),
        animate(
          '.2s ease-in',
          style({ transform: 'translateY(10px)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class SongCardComponent implements OnInit {
  // Input property for the song object, marked as required
  song = input.required<ReadSong>();

  // Local copy of the song object for display purposes
  songDisplay: ReadSong = { favorite: false, displayPlay: false };

  // Output event emitter to notify when a song is selected for playback
  @Output()
  songToPlay$ = new EventEmitter<ReadSong>();

  // Lifecycle hook to initialize the songDisplay object
  ngOnInit(): void {
    this.songDisplay = this.song();
  }

  // Method to toggle the display of the play icon on hover
  onHoverPlay(displayIcon: boolean): void {
    this.songDisplay.displayPlay = displayIcon;
  }

  // Method to play the song and emit the songToPlay event
  play(): void {
    this.songToPlay$.next(this.songDisplay);
  }
}
