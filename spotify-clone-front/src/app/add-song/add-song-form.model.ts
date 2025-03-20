// Import the FormControl class from the Angular Forms module
import { FormControl } from '@angular/forms';

// Define a type for the content of the Create Song form
export type CreateSongFormContent = {
  // FormControl for the song title, expecting a string value
  title: FormControl<string>;

  // FormControl for the song author, expecting a string value
  author: FormControl<string>;

  // FormControl for the song cover image, allowing either a File object or null
  cover: FormControl<File | null>;

  // FormControl for the song file, allowing either a File object or null
  file: FormControl<File | null>;
};
