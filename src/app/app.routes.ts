import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
    title: 'Movie Arena – Home',
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./features/movies/pages/movies-page/movies-page.component').then(
        (m) => m.MoviesPageComponent
      ),
    title: 'Movies – Movie Arena',
  },
  {
    path: 'movies/:id',
    loadComponent: () =>
      import('./features/movies/pages/movie-detail/movie-detail.component').then(
        (m) => m.MovieDetailComponent
      ),
    title: 'Movie Detail – Movie Arena',
  },
  {
    path: 'tv-shows',
    loadComponent: () =>
      import('./features/tv-shows/pages/tv-shows-page/tv-shows-page.component').then(
        (m) => m.TvShowsPageComponent
      ),
    title: 'TV Shows – Movie Arena',
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./features/watchlist/pages/watchlist-page/watchlist-page.component').then(
        (m) => m.WatchlistPageComponent
      ),
    title: 'My Watchlist – Movie Arena',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: '404 – Movie Arena',
  },
];
