// Interface for a title value object
export interface TitleVO {
  // Optional string value for the title
  value?: string;
}

// Interface for an author value object
export interface AuthorVO {
  // Optional string value for the author
  value?: string;
}

// Base interface for a song, containing common properties
export interface SongBase {
  // Optional public ID for the song
  publicId?: string;
  // Optional title value object
  title?: TitleVO;
  // Optional author value object
  author?: AuthorVO;
}

// Interface for saving a song, extending SongBase with file and cover properties
export interface SaveSong extends SongBase {
  // Optional file object for the song
  file?: File;
  // Optional content type for the song file
  fileContentType?: string;
  // Optional file object for the song cover
  cover?: File;
  // Optional content type for the song cover
  coverContentType?: string;
}

// Interface for reading a song, extending SongBase with cover and favorite properties
export interface ReadSong extends SongBase {
  // Optional base64 encoded string for the song cover
  cover?: string;
  // Optional content type for the song cover
  coverContentType?: string;
  // Flag indicating if the song is marked as a favorite
  favorite: boolean;
  // Flag indicating if the play icon should be displayed
  displayPlay: boolean;
}

// Interface for song content, extending ReadSong with file properties
export interface SongContent extends ReadSong {
  // Optional base64 encoded string for the song file
  file?: string;
  // Optional content type for the song file
  fileContentType?: string;
}
