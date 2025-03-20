// Import necessary components and modules from Angular and other libraries
import { Component, effect, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthorVO, SaveSong, TitleVO } from '../service/model/song.model';
import { SongService } from '../service/song.service';
import { Router } from '@angular/router';
import { ToastService } from '../service/toast.service';
import { CreateSongFormContent } from './add-song-form.model';

// Define an enum for different flow statuses
type FlowStatus =
  | 'init'
  | 'validation-file-error'
  | 'validation-cover-error'
  | 'success'
  | 'error';

// Define the AddSongComponent with necessary metadata
@Component({
  selector: 'app-add-song',
  standalone: true,
  imports: [ReactiveFormsModule, NgbAlertModule, FontAwesomeModule],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss'
})
export class AddSongComponent implements OnDestroy {
  // Initialize an empty object to store song data for creation
  public songToCreate: SaveSong = {};

  // Inject necessary services using Angular's inject function
  private formBuilder = inject(FormBuilder);
  private songService = inject(SongService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Flag to track if the song creation process is ongoing
  isCreating = false;

  // Initialize the flow status to 'init'
  flowStatus: FlowStatus = 'init';

  // Create a reactive form with required fields for title, author, cover, and file
  public createForm = this.formBuilder.nonNullable.group<CreateSongFormContent>(
    {
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      author: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      cover: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      file: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    }
  );

  // Constructor to handle side effects related to song creation status
  constructor() {
    effect(() => {
      // Reset the isCreating flag
      this.isCreating = false;

      // Check the status of the song creation signal
      if (this.songService.addSig().status === 'OK') {
        // If successful, fetch all songs, show a success toast, and navigate to the home page
        this.songService.getAll();
        this.toastService.show('Song created with success', 'SUCCESS');
        this.router.navigate(['/']);
      } else if (this.songService.addSig().status === 'ERROR') {
        // If there's an error, show a danger toast
        this.toastService.show(
          'Error occurred when creating song, please try again',
          'DANGER'
        );
      }
    });
  }

  // Lifecycle hook to reset the song service when the component is destroyed
  ngOnDestroy(): void {
    this.songService.reset();
  }

  // Method to handle form submission and initiate song creation
  create(): void {
    // Set the isCreating flag to true
    this.isCreating = true;

    // Check if the file or cover is missing and update the flow status accordingly
    if (this.songToCreate.file === null) {
      this.flowStatus = 'validation-file-error';
    }

    if (this.songToCreate.cover === null) {
      this.flowStatus = 'validation-cover-error';
    }

    // Extract title and author values from the form and create corresponding VO objects
    const titleVO: TitleVO = { value: this.createForm.value.title };
    const authorVO: AuthorVO = { value: this.createForm.value.author };

    // Assign these VO objects to the songToCreate object
    this.songToCreate.title = titleVO;
    this.songToCreate.author = authorVO;

    // Call the song service to add the new song
    this.songService.add(this.songToCreate);
  }

  // Helper method to extract a file from an event target
  private extractFileFromTarget(target: EventTarget | null): File | null {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files[0];
  }

  // Method to handle cover image upload
  onUploadCover(target: EventTarget | null) {
    const cover = this.extractFileFromTarget(target);
    if (cover !== null) {
      // Assign the uploaded cover to the songToCreate object
      this.songToCreate.cover = cover;
      this.songToCreate.coverContentType = cover.type;
    }
  }

  // Method to handle MP3 file upload
  onUploadFile(target: EventTarget | null) {
    const file = this.extractFileFromTarget(target);
    if (file !== null) {
      // Assign the uploaded file to the songToCreate object
      this.songToCreate.file = file;
      this.songToCreate.fileContentType = file.type;
    }
  }
}
