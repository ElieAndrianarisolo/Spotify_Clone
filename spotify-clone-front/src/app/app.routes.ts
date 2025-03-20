// Import necessary modules and components from Angular and other modules
import { Routes } from '@angular/router';
import { AddSongComponent } from './add-song/add-song.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { FavoriteComponent } from './favorite/favorite.component';

// Export the application routes configuration
export const routes: Routes = [
  // Default route for the home page
  {
    path: '',
    component: HomeComponent
  },
  // Route for the search page
  {
    path: 'search',
    component: SearchComponent
  },
  // Route for adding a new song
  {
    path: "add-song",
    component: AddSongComponent
  },
  // Route for displaying favorite songs
  {
    path: "favorites",
    component: FavoriteComponent
  }
];
