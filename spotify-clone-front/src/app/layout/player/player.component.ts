// Import necessary components and services from Angular and other modules
import { Component, effect, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { SmallSongCardComponent } from '../../shared/small-song-card/small-song-card.component';
import { SongContentService } from '../../service/song-content.service';
import { ReadSong, SongContent } from '../../service/model/song.model';
import { Howl } from 'howler';
import { FavoriteSongBtnComponent } from "../../shared/favorite-song-btn/favorite-song-btn.component";

// Define the PlayerComponent with necessary metadata
@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    SmallSongCardComponent,
    FavoriteSongBtnComponent
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  // Inject the SongContentService using Angular's inject function
  songContentService = inject(SongContentService);

  // Current song being played
  public currentSong: SongContent | undefined = undefined;

  // Howler instance for audio playback
  currentHowlInstance: Howl | undefined;

  // Flag to track if a song is currently playing
  isPlaying: boolean = false;

  // Current volume level (0 to 1)
  currentVolume = 0.5;

  // Flag to track if audio is muted
  isMuted = false;

  // Queues for managing song playback order
  private nextQueue: Array<SongContent> = [];
  private previousQueue: Array<SongContent> = [];

  // Constructor to handle side effects related to queue management and playback
  constructor() {
    // Effect to handle new queues
    effect(() => {
      const newQueue = this.songContentService.queueToPlay();
      if (newQueue.length > 0) {
        // If a new queue is available, update the next queue and start playing
        this.onNewQueue(newQueue);
      }
    });

    // Effect to handle playing new songs
    effect(() => {
      if (this.songContentService.playNewSong().status === 'OK') {
        // If a new song is ready to play, update the current song and start playback
        this.onNextSong();
      }
    });
  }

  // Method to handle a new queue of songs
  private onNewQueue(newQueue: Array<ReadSong>): void {
    // Update the next queue with the new songs
    this.nextQueue = newQueue;
    // Start playing the first song in the queue
    this.playNextSongInQueue();
  }

  // Method to play the next song in the queue
  private playNextSongInQueue(): void {
    if (this.nextQueue.length > 0) {
      // Set playback state to false temporarily
      this.isPlaying = false;
      // Add the current song to the previous queue if it exists
      if (this.currentSong) {
        this.previousQueue.unshift(this.currentSong);
      }
      // Fetch and prepare the next song from the queue
      const nextSong = this.nextQueue.shift();
      this.songContentService.fetchNextSong(nextSong!);
    }
  }

  // Method to handle playing the next song in the queue
  private onNextSong(): void {
    // Update the current song with the next one
    this.currentSong = this.songContentService.playNewSong().value!;
    // Create a new Howler instance for the next song
    const newHowlInstance = new Howl({
      src: [
        `data:${this.currentSong.fileContentType};base64,${this.currentSong.file}`,
      ],
      volume: this.currentVolume,
      onplay: () => this.onPlay(),
      onpause: () => this.onPause(),
      onend: () => this.onEnd(),
    });

    // Stop any existing playback before starting the new song
    if (this.currentHowlInstance) {
      this.currentHowlInstance.stop();
    }

    // Start playing the new song
    newHowlInstance.play();
    // Update the current Howler instance
    this.currentHowlInstance = newHowlInstance;
  }

  // Method to handle playback start
  private onPlay(): void {
    // Set playback state to true
    this.isPlaying = true;
  }

  // Method to handle playback pause
  private onPause(): void {
    // Set playback state to false
    this.isPlaying = false;
  }

  // Method to handle playback end
  private onEnd(): void {
    // Play the next song in the queue
    this.playNextSongInQueue();
    // Set playback state to false temporarily
    this.isPlaying = false;
  }

  // Method to skip to the next song
  onForward(): void {
    // Play the next song in the queue
    this.playNextSongInQueue();
  }

  // Method to skip to the previous song
  onBackward(): void {
    if (this.previousQueue.length > 0) {
      // Set playback state to false temporarily
      this.isPlaying = false;
      // Add the current song to the next queue if it exists
      if (this.currentSong) {
        this.nextQueue.unshift(this.currentSong!);
      }
      // Fetch and prepare the previous song from the queue
      const previousSong = this.previousQueue.shift();
      this.songContentService.fetchNextSong(previousSong!);
    }
  }

  // Method to pause playback
  pause(): void {
    if (this.currentHowlInstance) {
      // Pause the current Howler instance
      this.currentHowlInstance.pause();
    }
  }

  // Method to resume playback
  play(): void {
    if (this.currentHowlInstance) {
      // Play the current Howler instance
      this.currentHowlInstance.play();
    }
  }

  // Method to toggle mute
  onMute(): void {
    if (this.currentHowlInstance) {
      // Toggle the mute state
      this.isMuted = !this.isMuted;
      // Update the Howler instance's mute state
      this.currentHowlInstance.mute(this.isMuted);
      // Adjust volume accordingly
      if (this.isMuted) {
        this.currentVolume = 0;
      } else {
        this.currentVolume = 0.5;
        this.currentHowlInstance.volume(this.currentVolume);
      }
    }
  }

  // Method to handle volume changes
  onVolumeChange(newVolume: number): void {
    // Update the current volume level
    this.currentVolume = newVolume / 100;
    if (this.currentHowlInstance) {
      // Update the Howler instance's volume
      this.currentHowlInstance.volume(this.currentVolume);
      // Adjust mute state if volume is zero
      if (this.currentVolume === 0) {
        this.isMuted = true;
        this.currentHowlInstance.mute(this.isMuted);
      } else if (this.isMuted) {
        this.isMuted = false;
        this.currentHowlInstance.mute(this.isMuted);
      }
    }
  }
}
